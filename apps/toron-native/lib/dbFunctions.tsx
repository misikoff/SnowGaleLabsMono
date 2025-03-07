import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/utils/supabase'

import {
  Exercise,
  Set,
  SetGroup,
  Session,
  Quote,
  Split,
  Profile,
  TrainingDay,
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
    set_groups (
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
        setGroupId:set_group_id,
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
    // order by setGroups.order
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
  console.log('//////')
  console.log({ data, error })
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

export async function createTrainingDay(payload: {
  id?: TrainingDay['id']
  name: TrainingDay['name']
  splitId: TrainingDay['splitId']
  order?: TrainingDay['order']
  // createdAt?: TrainingDay['createdAt']
  // updatedAt?: TrainingDay['updatedAt']
}) {
  console.log({ id: payload.id })
  // create split in supabase
  const { data, error } = await supabase
    .from('training_days')
    .insert(toSnakeCase(payload))
    .select('id')
  console.log({ data, error })

  return getFirstOrNull({ data, key: 'id' })
}

export async function getTrainingDays() {
  const { data, error } = await supabase.from('training_days').select('*')
  // .limit(10)
  if (error) {
    console.error('Error fetching training days:', error)
    return []
  }
  return data.map((d) => toCamelCase(d)) as TrainingDay[]
}

export async function getTrainingDaysForSplit(payload: {
  splitId: TrainingDay['splitId']
}) {
  const { data, error } = await supabase
    .from('training_days')
    .select('*')
    .eq('split_id', payload.splitId)
    // order by order
    .order('order', { ascending: true })
  // .limit(10)
  if (error) {
    console.error('Error fetching training days:', error)
    return []
  }
  console.log({ data })
  return data.map((d) => toCamelCase(d)) as TrainingDay[]
}

export async function updateTrainingDay(payload: {
  id: TrainingDay['id']
  name?: TrainingDay['name']
  order?: TrainingDay['order']
  // updatedAt?: TrainingDay['updatedAt']
}) {
  // update split in supabase
  const { data, error } = await supabase
    .from('training_days')
    .update(toSnakeCase(payload))
    .eq('id', payload.id)
    .select()
  console.log({ data, error })

  return getFirstOrNull({ data })
}

export async function deleteTrainingDay({ id }: { id: TrainingDay['id'] }) {
  // delete split in supabase
  const { data, error } = await supabase
    .from('training_days')
    .delete()
    .eq('id', id)
  console.log({ data, error })
}

export async function getSessions() {
  const { data, error } = await supabase.from('sessions').select(
    `
    id,
    name,
    date,
    set_groups (
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
        set_group_id,
        order,
        reps,
        rir,
        weight,
        session_id
      )
    )
  `,
  )
  // .limit(10)
  if (error) {
    console.error('Error fetching sessions:', error)
    return []
  }
  return data.map((d) => toCamelCase(d)) as Session[]
}

export async function createSession(payload: {
  id?: Session['id']
  name?: Session['name']
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
  order?: Session['order']
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

export async function createSetGroup(payload: {
  id?: SetGroup['id']
  order?: SetGroup['order']
  sessionId?: Session['id']
  exerciseId?: Exercise['id']
}) {
  // create session in subabase
  const { data, error } = await supabase
    .from('set_groups')
    .insert(toSnakeCase(payload))
    .eq('id', payload.id)
    .select()
  console.log({ data, error })

  return getFirstOrNull({ data })
}

export async function updateSetGroup(payload: {
  id: Set['id']
  sessionId?: Session['id']
  exerciseId?: Exercise['id']
  order?: SetGroup['order']
}) {
  // create session in subabase
  const { data, error } = await supabase
    .from('set_groups')
    .update(toSnakeCase(payload))
    .eq('id', payload.id)
    .select()
  console.log({ data, error })

  return getFirstOrNull({ data })
}

export async function deleteSetGroup({ id }: { id: SetGroup['id'] }) {
  // deletes all set groups and sets associated with the session
  const { data, error } = await supabase
    .from('set_groups')
    .delete()
    .eq('id', id)
  console.log({ data, error })
}

export async function createSet(payload: {
  id?: Set['id']
  order?: Set['order']
  sessionId: Set['sessionId']
  exerciseId?: Set['exerciseId']
  setGroupId: Set['setGroupId']
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
