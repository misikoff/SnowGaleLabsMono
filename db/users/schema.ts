import { relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text, real } from 'drizzle-orm/sqlite-core'

export const repStyleEnum = ['high', 'medium', 'low'] as const
export type RepStyle = (typeof repStyleEnum)[number]

export const weightUnitsEnum = ['lbs', 'kg'] as const
export type WeightUnits = (typeof weightUnitsEnum)[number]

export const distanceUnitsEnum = ['yards', 'meters'] as const
export type DistanceUnits = (typeof distanceUnitsEnum)[number]

export const exerciseType = ['compound', 'isolation'] as const
export type ExerciseType = (typeof exerciseType)[number]

export const equipmentEnum = [
  'barbell',
  'dumbbell',
  'cable',
  'machine',
  'bodyweight',
  'band',
  'other',
] as const
export type EquipmentType = (typeof equipmentEnum)[number]

export const exercises = sqliteTable(
  'exercises',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name', { length: 256 }),
    description: text('description', { length: 256 }),
    equipmentType: text('equipment_type', { enum: equipmentEnum }),
    defaultRepRange: text('default_rep_range', { enum: repStyleEnum }).default(
      'medium',
    ),
    defaultWeightIncrement: real('default_weight_increment').default(5),
    defaultWeightUnits: text('default_weight_units', {
      enum: weightUnitsEnum,
    }).default('lbs'),
    useWeight: integer('use_weight', { mode: 'boolean' }).default(true),
    useDistance: integer('use_Distance', { mode: 'boolean' }).default(false),
    defaultDistanceIncrement: real('default_distance_increment').default(5),
    defaultDistanceUnits: text('default_distance_units', {
      enum: distanceUnitsEnum,
    }).default('yards'),
  },
  // (programs) => {
  //   return {
  //     nameIndex: uniqueIndex('program_name_idx').on(programs.name),
  //   }
  // },
)

export const exercisePreferences = sqliteTable('exercise_preferences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  exerciseId: integer('excercise_id').references(() => exercises.id),
  notes: text('notes', { length: 256 }),
  repRange: text('rep_range', { enum: repStyleEnum }),
  weightIncrement: real('weight_increment'),
  weightUnits: text('weight_units', { enum: weightUnitsEnum }),
  distanceIncrement: real('distance_increment'),
  distanceUnits: text('distance_units', { enum: distanceUnitsEnum }),
})

export const exercisePreferencesRelations = relations(
  exercisePreferences,
  ({ one }) => ({
    exercise: one(exercises, {
      fields: [exercisePreferences.exerciseId],
      references: [exercises.id],
    }),
  }),
)

// // create a table or Programs with a name and a description and a user column for the user who created it
export const programs = sqliteTable(
  'programs',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name', { length: 256 }),
    description: text('description', { length: 256 }),
  },
  // (programs) => {
  //   return {
  //     nameIndex: uniqueIndex('program_name_idx').on(programs.name),
  //   }
  // },
)

export const programsRelations = relations(programs, ({ one, many }) => ({
  microcycles: many(microcycles),
}))

export const microcycles = sqliteTable('microcycles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name', { length: 256 }),
  order: integer('order'),
  programId: integer('program_id').references(() => programs.id),
})

export const microcyclesRelations = relations(microcycles, ({ one, many }) => ({
  program: one(programs, {
    fields: [microcycles.programId],
    references: [programs.id],
  }),
  sessions: many(sessions),
  many: many(setGroups),
}))

export const sessions = sqliteTable(
  'sessions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name', { length: 256 }),
    microcycleId: integer('microcycle_id').references(() => microcycles.id),
    programId: integer('program_id').references(() => programs.id),
    order: integer('order'),
  },
  // (exercises) => {
  //   return {
  //     nameIndex: uniqueIndex('exercise_name_idx').on(exercises.name),
  //   }
  // },
)

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  setGroups: many(setGroups),
  program: one(programs, {
    fields: [sessions.programId],
    references: [programs.id],
  }),
  microcycle: one(microcycles, {
    fields: [sessions.microcycleId],
    references: [microcycles.id],
  }),
}))

export const setGroups = sqliteTable(
  'setGroups',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    sessionId: integer('session_id').references(() => sessions.id),
    microcycleId: integer('microcycle_id').references(() => microcycles.id),
    programId: integer('program_id'),
    // assuming a set group is a single exercise -- does not handle supersets
    exerciseId: integer('excercise_id'),
    order: integer('order'),
  },
  // (setGroups) => {
  //   return {
  //     nameIndex: uniqueIndex('setGroup_name_idx').on(setGroups.name),
  //   }
  // },
)

export const setGroupsRelation = relations(setGroups, ({ one, many }) => ({
  exercise: one(exercises, {
    fields: [setGroups.exerciseId],
    references: [exercises.id],
  }),
  session: one(sessions, {
    fields: [setGroups.sessionId],
    references: [sessions.id],
  }),
  microcycle: one(microcycles, {
    fields: [setGroups.microcycleId],
    references: [microcycles.id],
  }),
  program: one(programs, {
    fields: [setGroups.programId],
    references: [programs.id],
  }),
  sets: many(sets),
}))

export const sets = sqliteTable(
  'sets',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    // relations
    sessionId: integer('session_id').references(() => sessions.id),
    microcycleId: integer('microcycle_id').references(() => microcycles.id),
    programId: integer('program_id').references(() => programs.id),
    exerciseId: integer('excercise_id').references(() => exercises.id),
    setGroupId: integer('set_group_id').references(() => setGroups.id),
    // attributes
    prescribedReps: integer('prescribed_reps').default(0),
    prescribedRPE: real('prescribed_RPE').default(0),
    prescribedRIR: real('prescribed_RIR').default(0),
    prescribedWeight: real('prescribed_weight').default(0),
    reps: integer('reps').default(0),
    RPE: real('RPE').default(0),
    RIR: integer('RIR').default(0),
    weight: real('weight').default(0),
    order: integer('order'),
    createdAt: integer('created_at').default(sql`(cast(unixepoch() as int))`),
    updatedAt: integer('updated_at').default(sql`(cast(unixepoch() as int))`),
  },
  // (sets) => {
  //   return {
  //     nameIndex: uniqueIndex('set_name_idx').on(sets.name),
  //   }
  // },
)

export const setsRelation = relations(sets, ({ one }) => ({
  session: one(sessions, {
    fields: [sets.sessionId],
    references: [sessions.id],
  }),
  microcycle: one(microcycles, {
    fields: [sets.microcycleId],
    references: [microcycles.id],
  }),
  program: one(programs, {
    fields: [sets.programId],
    references: [programs.id],
  }),
  exercise: one(exercises, {
    fields: [sets.exerciseId],
    references: [exercises.id],
  }),
  setGroup: one(setGroups, {
    fields: [sets.setGroupId],
    references: [setGroups.id],
  }),
}))

export type Exercise = typeof exercises.$inferSelect
export type Program = typeof programs.$inferSelect
export type Microcycle = typeof microcycles.$inferSelect
export type Session = typeof sessions.$inferSelect
export type SetGroup = typeof setGroups.$inferSelect
export type Set = typeof sets.$inferSelect

export interface SetGroupWithExerciseAndSets extends SetGroup {
  exercise: Exercise
  sets: Set[]
}

export interface SessionWithSetGroupWithExerciseAndSets extends Session {
  setGroups: SetGroupWithExerciseAndSets[]
}
