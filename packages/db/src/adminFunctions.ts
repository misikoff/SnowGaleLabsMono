'use server'

// NOT USED ANYWHERE

import { eq } from 'drizzle-orm'

import { db } from './index'
import { Exercise, exercises, users } from '../schema'

// TODO: test for admin authorization to delete exercises
export async function getUsers() {
  return await db.select().from(users)
}

// TODO: test for admin authorization to delete exercises
export async function deleteAllExercises() {
  await db.delete(exercises)
}

// TODO: test for admin authorization to delete main exercises
export async function deleteAllMainExercises() {
  await db.delete(exercises).where(eq(exercises.isMainExercise, true))
}

// TODO: test for admin authorization to create main exercises
export async function createMainExercise({
  name,
  equipmentType,
}: {
  name: Exercise['name']
  equipmentType: Exercise['equipmentType']
}) {
  await db
    .insert(exercises)
    .values({ name, equipmentType, isMainExercise: true })
}
