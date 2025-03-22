import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/utils/supabase'

import {
  Exercise,
  Set,
  Session,
  Quote,
  Split,
  Profile,
  MuscleGroup,
  SessionMuscleGroup,
  SessionExercise,
} from '../../../packages/toron-db/schema'

// Note: security depends on RLS preventing access to records with user ids that do not match the asset

function getFirstOrNull({
  data,
  key,
  onError,
}: {
  data: any[] | null
  key?: string
  onError?: () => any
}) {
  if (data && data.length > 0) {
    let res = data[0]
    if (key) {
      res = res[key]
    }
    return res
  } else if (onError) {
    onError()
  }
  return null
}

function toSnakeCase(obj: Record<string, any>) {
  const snakeCaseObj: Record<string, any> = {}
  for (const key in obj) {
    snakeCaseObj[
      key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    ] = obj[key]
  }
  return snakeCaseObj
}

function toCamelCase(obj: Record<string, any>) {
  const camelCaseObj: Record<string, any> = {}
  for (const key in obj) {
    camelCaseObj[key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())] = obj[key]
  }
  return camelCaseObj
}

export async function getSession(payload: { sessionId: Session['id'] }) {
  const { data, error } = await supabase
    .from('sessions')
    .select(
      `
    id,
    name,
    date,
    session_exercises (
      id,
      order,
      sessionId:session_id,
      exercise:exercises (
        id,
        name
      ),
      sets (
        id,
        exerciseId:exercise_id,
        sessionExerciseId:session_exercise_id,
        order,
        reps,
        rir,
        weight,
        sessionId:session_id
      )
    )
  `,
    )
    .eq('id', payload.sessionId)
    // order by sessionExercises.order
    .order('order', { ascending: false })

  if (error) {
    console.error('Error fetching session:', error)
    return []
  }

  return toCamelCase(data[0]) as any
  // console.log({ sessionId: payload.sessionId })
  // const { data, error } = await supabase
  //   .from('sessions')
  //   .select('*')
  //   .eq('id', payload.sessionId)
  // // .limit(10)
  // if (error) {
  //   console.error('Error fetching session:', error)
  //   return []
  // }
  // return getFirstOrNull({ data }) as Session
}

export async function getProfile() {
  const { data, error } = await supabase.from('profiles').select('*').single()
  // console.log({ data, error })
  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return toCamelCase(data) as Profile
}

export async function updateProfile(payload: {
  id: Profile['id']
  currentSplitId?: Profile['currentSplitId']
  updatedAt?: Profile['updatedAt']
}) {
  // update split in supabase
  const { data, error } = await supabase
    .from('profiles')
    .update(toSnakeCase(payload))
    .eq('id', payload.id)
    .select()
  console.log('*********************')
  console.log({ data, error })

  return getFirstOrNull({ data })
}

export async function getSplits() {
  const { data, error } = await supabase.from('splits').select('*')
  // .limit(10)
  if (error) {
    console.error('Error fetching splits:', error)
    return []
  }
  return data.map((d) => toCamelCase(d)) as Split[]
}

export async function getSplit(payload: { id: Split['id'] }) {
  const { data, error } = await supabase
    .from('splits')
    .select('*')
    .eq('id', payload.id)
    .single()

  if (error) {
    console.error('Error fetching split:', error)
    return null
  }

  return toCamelCase(data) as Split
}

export async function createSplit(payload: {
  id?: Split['id']
  name: Split['name']
  rirTarget?: Split['rirTarget']
  createdAt?: Split['createdAt']
  updatedAt?: Split['updatedAt']
}) {
  console.log({ id: payload.id })
  // create split in supabase
  const { data, error } = await supabase
    .from('splits')
    .insert(toSnakeCase(payload))
    .select('id')
  console.log({ data, error })

  return getFirstOrNull({ data, key: 'id' })
}

export async function updateSplit(payload: {
  id: Split['id']
  name?: Split['name']
  updatedAt?: Split['updatedAt']
}) {
  // update split in supabase
  const { data, error } = await supabase
    .from('splits')
    .update(toSnakeCase(payload))
    .eq('id', payload.id)
    .select()
  console.log({ data, error })

  return getFirstOrNull({ data })
}

export async function deleteSplit({ id }: { id: Split['id'] }) {
  // delete split in supabase
  const { data, error } = await supabase.from('splits').delete().eq('id', id)
  console.log({ data, error })
}

export async function getSessions(payload: {
  sessionId?: Session['id']
  splitId?: Session['splitId']
  splitTemplateId?: Session['splitTemplateId']
}) {
  let query = supabase.from('sessions').select(
    `
    id,
    name,
    date,
    order,
    splitId:split_id,
    isTemplate:is_template,
    session_exercises (
      id,
      order,
      sessionId:session_id,
      exercise:exercises (
        id,
        name
      ),
      sets (
        id,
        exerciseId:exercise_id,
        sessionExerciseId:session_exercise_id,
        order,
        reps,
        rir,
        weight,
        sessionId:session_id
      )
    )
  `,
  )

  // Add filters dynamically based on the provided parameters
  if (payload.sessionId) {
    query = query.eq('id', payload.sessionId)
  }
  if (payload.splitId) {
    query = query.eq('split_id', payload.splitId)
  }
  if (payload.splitTemplateId !== undefined) {
    query = query.eq('split_template_id', payload.splitTemplateId)
  }

  query = query.order('order', { ascending: true })

  // Execute the query
  const { data, error } = await query

  if (error) {
    console.error('Error fetching session:', error)
    return []
  }

  return data.map((d) => toCamelCase(d)) as Session[]
}

// get sessions from last 14 days
export async function getSessionsForCalendar() {
  const { data, error } = await supabase
    .from('sessions')
    .select(
      `
    id,
    name,
    date,
    session_exercises (
      id,
      order,
      session_id,
      exercise:exercises (
        id,
        name
      ),
      sets (
        id,
        exercise_id,
        session_exercise_id,
        order,
        reps,
        rir,
        weight,
        session_id
      )
    )
  `,
    )
    // only get sessions from the last 14 days based on date (string)
    .gte(
      'date',
      new Date(new Date().setDate(new Date().getDate() - 14)).toISOString(),
    )

    // .gte('date', new Date(new Date().setDate(new Date().getDate() - 14)))
    .order('date', { ascending: false })
  // .limit(10)
  if (error) {
    console.error('Error fetching sessions2:', error)
    return []
  }
  return data.map((d) => toCamelCase(d)) as Session[]
}

export async function createSession(payload: {
  id?: Session['id']
  name?: Session['name']
  splitTemplateId?: Session['splitTemplateId']
  splitId?: Session['splitId']
  order?: Session['order']
  date?: Session['date']
  createdAt?: Session['createdAt']
  updatedAt?: Session['updatedAt']
}) {
  // create session in subabase
  const { data, error } = await supabase
    .from('sessions')
    .insert(toSnakeCase(payload))
    .select('id')
  console.log({ data, error })

  return getFirstOrNull({ data, key: 'id' })
}

export async function updateSession(payload: {
  id: Session['id']
  name?: Session['name']
  completed?: Session['completed']
  date?: Session['date']
}) {
  // create session in subabase
  const { data, error } = await supabase
    .from('sessions')
    .update(toSnakeCase(payload))
    .eq('id', payload.id)
    .select()
  console.log({ data, error })

  return getFirstOrNull({ data })
}

export async function deleteSession({ id }: { id: Session['id'] }) {
  // deletes all set groups and sets associated with the session
  const { data, error } = await supabase.from('sessions').delete().eq('id', id)
  console.log({ data, error })
}

export async function createSessionExercise(payload: {
  id?: SessionExercise['id']
  order?: SessionExercise['order']
  sessionId?: SessionExercise['id']
  exerciseId?: SessionExercise['id']
}) {
  // create session in subabase
  const { data, error } = await supabase
    .from('session_exercises')
    .insert(toSnakeCase(payload))
    .eq('id', payload.id)
    .select()
  console.log({ data, error })

  return getFirstOrNull({ data })
}

export async function updateSessionExercise(payload: {
  id: Set['id']
  sessionId?: Session['id']
  exerciseId?: Exercise['id']
  order?: SessionExercise['order']
}) {
  // create session in subabase
  const { data, error } = await supabase
    .from('session_exercises')
    .update(toSnakeCase(payload))
    .eq('id', payload.id)
    .select()
  console.log({ data, error })

  return getFirstOrNull({ data })
}

export async function deleteSessionExercise({
  id,
}: {
  id: SessionExercise['id']
}) {
  // deletes all set groups and sets associated with the session
  const { data, error } = await supabase
    .from('session_exercises')
    .delete()
    .eq('id', id)
  console.log({ data, error })
}

export async function createSet(payload: {
  id?: Set['id']
  order?: Set['order']
  sessionId: Set['sessionId']
  exerciseId?: Set['exerciseId']
  sessionExerciseId: Set['sessionExerciseId']
}) {
  console.log('set incoming')
  console.log({ payload })
  // remove id from payload if it is null
  if (payload.exerciseId) {
    delete payload.exerciseId
  }
  payload.exerciseId = '8270f873-2b90-43cc-a7e6-5ce01d2bb504'
  // create session in subabase
  const { data, error } = await supabase
    .from('sets')
    .insert(toSnakeCase(payload))
    .select()
  console.log({ data, error })
  console.log('that was the set')
  return getFirstOrNull({ data })
}

export async function deleteSet({ id }: { id: Set['id'] }) {
  // deletes all set groups and sets associated with the session
  const { data, error } = await supabase.from('sets').delete().eq('id', id)
  console.log({ data, error })
  console.log('done')
}

export async function updateSet(payload: {
  id: Set['id']
  reps?: Set['reps']
  rir?: Set['rir']
  weight?: Set['weight']
  exerciseId?: Set['exerciseId']
}) {
  // create session in subabase
  const { data, error } = await supabase
    .from('sets')
    .update(toSnakeCase(payload))
    .eq('id', payload.id)
    .select()
  console.log({ data, error })
  console.log('done')

  return getFirstOrNull({ data })
}

export async function createSessionMuscleGroup(payload: {
  id?: SessionMuscleGroup['id']
  sessionId: SessionMuscleGroup['sessionId']
  muscleGroupId: SessionMuscleGroup['muscleGroupId']
  order?: SessionMuscleGroup['order']
}) {
  // create session in subabase
  const { data, error } = await supabase
    .from('session_muscle_groups')
    .insert(toSnakeCase(payload))
    .select()
  console.log({ data, error })

  return getFirstOrNull({ data })
}

export async function getExercises() {
  const { data, error } = await supabase.from('exercises').select()
  // console.log({ data, error })
  // console.log('done')
  // if no error, return data as Exercise[]
  if (error) {
    console.error('Error fetching exercises:', error)
    return []
  }

  return data.map((d) => toCamelCase(d)) as Exercise[]
}

export async function getMuscleGroups() {
  const { data, error } = await supabase.from('muscle_groups').select()
  // console.log({ data, error })
  // console.log('done')
  // if no error, return data as MuscleGroup[]
  if (error) {
    console.error('Error fetching muscle groups:', error)
    return []
  }

  return data.map((d) => toCamelCase(d)) as MuscleGroup[]
}

export async function getQuotes() {
  const { data, error } = await supabase.from('quotes').select()
  // console.log({ data, error })
  // console.log('done')
  // if no error, return data as Exercise[]
  if (error) {
    console.error('Error fetching quotes:', error)
    return []
  }
  // console.log({ quotes: data })

  return data.map((d) => toCamelCase(d)) as Quote[]
}

export function useSupabaseUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => supabase.auth.getUser(),
  })
}
