import {
  Program,
  Microcycle,
  Session,
  sessions,
  User,
  users,
} from '@repo/db/schema'
import { supabase } from '@/utils/supabase'
// const currentUserId = async () => {
//   const clerkUser = await currentUser()
//   if (!clerkUser) {
//     throw new Error('No clerk user found')
//   }
//   const user = await db.query.users.findFirst({
//     where: eq(users.clerkId, clerkUser.id),
//   })
//   if (!user) {
//     throw new Error('No user found')
//   }
//   return user.id
// }

// function that takes all keys of an object and make them snake_case
function toSnakeCase(obj: Record<string, any>) {
  const snakeCaseObj: Record<string, any> = {}
  for (const key in obj) {
    snakeCaseObj[
      key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    ] = obj[key]
  }
  return snakeCaseObj
}

export const currentUserId = async (clerkId: string) => {
  // TODO react query here to memoize
  console.log({ clerkId })
  console.log('getting user id')
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', clerkId)
  console.log({ data, error })
  if (data && data.length > 0) {
    const id = data[0].id
    return id
  } else {
    throw new Error('No user found')
  }
}

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

  // return await db
  //   .insert(users)
  //   .values({
  //     name,
  //     clerkId,
  //     prod,
  //   })
  //   .returning()
}
export async function getSessions({ userId }: { userId: User['id'] }) {
  if (userId) {
    userId = await currentUserId(userId)
    console.log({ userId })
  } else {
    console.log('badadadada')
  }
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
  // .limit(10)
  if (error) {
    console.error('Error fetching sessions:', error)
    return []
  }
  return data as Session[]
}

export async function createSession({
  id,
  name,
  order,
  programId,
  microcycleId,
  createdAt,
  updatedAt,
  userId,
}: {
  id?: Session['id']
  name?: Session['name']
  order?: Session['order']
  programId?: Program['id']
  microcycleId?: Microcycle['id']
  createdAt?: Session['createdAt']
  updatedAt?: Session['updatedAt']
  userId?: Session['userId']
}) {
  if (userId) {
    userId = await currentUserId(userId)
  }
  console.log({ userId })
  // console.log('creating')
  // const x = toSnakeCase({
  //   id,
  //   name,
  //   order,
  //   programId,
  //   microcycleId,
  //   createdAt,
  //   updatedAt,
  //   userId,
  // })
  // console.log({ x })

  // create session in subabase
  const { data, error } = await supabase
    .from('sessions')
    .insert(
      toSnakeCase({
        id,
        name,
        order,
        programId,
        microcycleId,
        createdAt,
        updatedAt,
        userId,
      }),
    )
    .select('id')
  console.log({ data, error })
  console.log('done')

  if (data && data.length > 0) {
    const res = data[0].id
    console.log({ res })
    return res
  }
  return null
}
