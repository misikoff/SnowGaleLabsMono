import {
  Exercise,
  Program,
  Microcycle,
  Set,
  SetGroup,
  Session,
  User,
} from '@repo/db/schema'
import queryClient from '@/lib/queryClient'
import { supabase } from '@/utils/supabase'

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

async function toSupabaseUserPayload<T extends { userId?: User['clerkId'] }>(
  obj: T,
): Promise<T> {
  if (obj.userId) {
    obj.userId = await getCurrentUserId(obj.userId)
  }
  return obj
}

const getCurrentUserId = async (clerkId: string) => {
  const result = await queryClient.fetchQuery({
    queryKey: ['currentUser', clerkId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkId)
      console.log({ data, error })

      return getFirstOrNull({
        data,
        key: 'id',
        onError: () => {
          throw new Error('No user found')
        },
      })
    },
  })
  return result
}

// maybe add id and return it
export async function createUser(
  clerkId: User['clerkId'],
  name: User['name'],
  prod: User['prod'],
) {
  // create user in subabase
  const { data, error } = await supabase.from('users').insert({
    clerkId,
    name,
    prod,
  })
  console.log({ data, error })
}

export async function getSession(payload: {
  userId: User['id']
  sessionId: Session['id']
}) {
  payload = await toSupabaseUserPayload(payload)
  const { data, error } = await supabase
    .from('sessions')
    .select(
      `
    id,
    name,
    date,
    setGroups (
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
        rpe,
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

  return data[0] as any
  // console.log({ sessionId: payload.sessionId })
  // const { data, error } = await supabase
  //   .from('sessions')
  //   .select('*')
  //   .eq('user_id', payload.userId)
  //   .eq('id', payload.sessionId)
  // // .limit(10)
  // if (error) {
  //   console.error('Error fetching session:', error)
  //   return []
  // }
  // return getFirstOrNull({ data }) as Session
}

export async function getSessions(payload: { userId: User['id'] }) {
  payload = await toSupabaseUserPayload(payload)
  const { data, error } = await supabase
    .from('sessions')
    .select(
      `
    id,
    name,
    date,
    setGroups (
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
        rpe,
        rir,
        weight,
        sessionId:session_id
      )
    )
  `,
    )
    .eq('user_id', payload.userId)
  // .limit(10)
  if (error) {
    console.error('Error fetching sessions:', error)
    return []
  }
  return data as any as Session[]
}

export async function createSession(payload: {
  id?: Session['id']
  name?: Session['name']
  order?: Session['order']
  programId?: Program['id']
  microcycleId?: Microcycle['id']
  date?: Session['date']
  createdAt?: Session['createdAt']
  updatedAt?: Session['updatedAt']
  userId?: Session['userId']
}) {
  payload = await toSupabaseUserPayload(payload)

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
  userId?: Session['userId']
}) {
  payload = await toSupabaseUserPayload(payload)

  // create session in subabase
  const { data, error } = await supabase
    .from('sessions')
    .update(toSnakeCase(payload))
    .eq('id', payload.id)
    .select()
  console.log({ data, error })

  return getFirstOrNull({ data })
}

export async function deleteSession(id: Session['id']) {
  // deletes all set groups and sets associated with the session
  const { data, error } = await supabase.from('sessions').delete().eq('id', id)
  console.log({ data, error })
}

export async function createSetGroup(payload: {
  id?: SetGroup['id']
  order?: SetGroup['order']
  programId?: Program['id']
  microcycleId?: Microcycle['id']
  sessionId?: Session['id']
  exerciseId?: Exercise['id']
  userId?: Session['userId']
}) {
  payload = await toSupabaseUserPayload(payload)
  // create session in subabase
  const { data, error } = await supabase
    .from('setGroups')
    .insert(toSnakeCase(payload))
    .eq('id', payload.id)
    .select()
  console.log({ data, error })

  return getFirstOrNull({ data })
}

export async function updateSetGroup(payload: {
  id: Set['id']
  sessionId?: Session['id']
  // microcycleId?: Microcycle['id']
  // programId?: Program['id']
  exerciseId?: Exercise['id']
  order?: SetGroup['order']
  userId?: Session['userId']
}) {
  payload = await toSupabaseUserPayload(payload)

  // create session in subabase
  const { data, error } = await supabase
    .from('setGroups')
    .update(toSnakeCase(payload))
    .eq('id', payload.id)
    .select()
  console.log({ data, error })

  return getFirstOrNull({ data })
}

export async function deleteSetGroup(id: SetGroup['id']) {
  // deletes all set groups and sets associated with the session
  const { data, error } = await supabase.from('setGroups').delete().eq('id', id)
  console.log({ data, error })
}

export async function createSet(payload: {
  id?: Set['id']
  order?: Set['order']
  programId?: Set['programId']
  microcycleId?: Set['microcycleId']
  sessionId: Set['sessionId']
  exerciseId?: Set['exerciseId']
  setGroupId: Set['setGroupId']
  userId?: Session['userId']
}) {
  payload = await toSupabaseUserPayload(payload)
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
  rpe?: Set['rpe']
  rir?: Set['rir']
  weight?: Set['weight']
  exerciseId?: Set['exerciseId']
  userId?: Set['userId']
}) {
  payload = await toSupabaseUserPayload(payload)

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

  return data as Exercise[]
}
