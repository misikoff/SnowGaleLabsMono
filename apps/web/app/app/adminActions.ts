'use server'

import { unstable_noStore as noStore } from 'next/cache'
import {  eq } from 'drizzle-orm'

import { db } from '@repo/db/index'
import {
  Exercise,
  exercises,
  users,
} from '@repo/db/schema'
import { currentUserId } from '@/app/app/actions'

export async function getUsers() {
  noStore()
  return await db.select().from(users)
}

export async function deleteAllExercises() {
  // TODO: test for admin authorization to delete exercises
  noStore()
  await db.delete(exercises)
}

export async function deleteAllMainExercises() {
  // TODO: test for admin authorization to delete main exercises
  noStore()
  await db.delete(exercises).where(eq(exercises.isMainExercise, true))
}

export async function createExercise({
  name,
  equipmentType,
}: {
  name: Exercise['name']
  equipmentType: Exercise['equipmentType']
}) {
  console.log('adding exercise', name)
  noStore()
  await db
    .insert(exercises)
    .values({ name, equipmentType, userId: await currentUserId() })
}

export async function createMainExercise({
  name,
  equipmentType,
}: {
  name: Exercise['name']
  equipmentType: Exercise['equipmentType']
}) {
  // TODO: test for admin authorization to create main exercises
  noStore()
  console.log('adding exercise', name)
  await db
    .insert(exercises)
    .values({ name, equipmentType, isMainExercise: true })
}
