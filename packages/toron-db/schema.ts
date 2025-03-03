import { relations, sql } from 'drizzle-orm'
import {
  boolean,
  date,
  index,
  pgPolicy,
  pgSchema,
  pgTable,
  real,
  smallint,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { authenticatedRole } from 'drizzle-orm/supabase'

export const weightUnitsEnum = ['lbs', 'kg'] as const
export type WeightUnits = (typeof weightUnitsEnum)[number]

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

const authSchema = pgSchema('auth')

const usersOnlyPolicy = pgPolicy('Only Users can do anything', {
  as: 'permissive',
  to: authenticatedRole,
  for: 'all',
  using: sql`(( SELECT auth.uid() AS uid) = user_id)`,
  withCheck: sql`true`,
})

const readOnlyPolicy = pgPolicy('Read Only Policy', {
  as: 'permissive',
  to: 'public',
  for: 'select',
  using: sql`true`,
  withCheck: sql``,
})

const userDef = sql`auth.uid()`
const primaryKeyDef = sql`gen_random_uuid()`
const id = uuid().default(primaryKeyDef).primaryKey()
const userId = uuid()
  .default(userDef)
  .references(() => users.id, {
    onDelete: 'cascade',
  })

// existing supabase auth table
const users = authSchema.table('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull(),
})

// need to link this to auth.users creation, deletion, and updates with a hook
export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id')
      .primaryKey()
      .references(() => users.id),
    name: text(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    prod: boolean().default(false),
  },
  (table) => [
    index('usersClerkIdIndex').on(table.id),
    pgPolicy('Only Users can do anything', {
      as: 'permissive',
      to: authenticatedRole,
      for: 'all',
      using: sql`(( SELECT auth.uid() AS uid) = id)`,
      withCheck: sql`true`,
    }),
  ],
)

export const quotes = pgTable(
  'quotes',
  {
    id,
    text: text().notNull(),
    author: text(),
    category: text(),
  },
  (table) => [index('quotesCategoryIndex').on(table.category), readOnlyPolicy],
)

// 🔹 Muscle Groups (e.g., "Chest", "Back", "Quads")
export const muscleGroups = pgTable(
  'muscle_groups',
  {
    id,
    name: text('name').notNull().unique(),
  },
  (table) => [readOnlyPolicy],
)

export const exercises = pgTable(
  'exercises',
  {
    id,
    muscleGroupId: uuid().references(() => muscleGroups.id),
    name: text(),
    description: text(),
    equipmentType: text({ enum: equipmentEnum }),
    weightIncrement: real().default(5),
    weightUnits: text({
      enum: weightUnitsEnum,
    }).default('lbs'),
    notes: text(),
  },
  (table) => [
    index('exercisesMuscleGroupIdIndex').on(table.muscleGroupId),
    readOnlyPolicy,
  ],
)

export const exercisesRelation = relations(exercises, ({ one }) => ({
  muscleGroups: one(muscleGroups),
}))

// 🔹 Splits (e.g., "Push/Pull/Legs")
export const splits = pgTable(
  'splits',
  {
    id,
    userId,
    name: text(),
    description: text(),
    rirTarget: smallint().default(0),
  },
  (table) => [index('splitsUserIdIndex').on(table.userId), usersOnlyPolicy],
)

export const splitsRelations = relations(splits, ({ one }) => ({
  user: one(users),
}))

// 🔹 Training Days (Part of a Split)
export const trainingDays = pgTable(
  'training_days',
  {
    id,
    userId,
    splitId: uuid().references(() => splits.id, {
      onDelete: 'cascade',
    }),
    name: text(),
    description: text(),
    order: smallint().default(0),
  },
  (table) => [
    index('trainingDaysUserIdIndex').on(table.userId),
    index('trainingDaysSplitIdIndex').on(table.splitId),
    usersOnlyPolicy,
  ],
)

export const trainingDaysRelations = relations(
  trainingDays,
  ({ one, many }) => ({
    user: one(users),
    exercises: many(exercises),
  }),
)

// 🔹 Ordered Muscle Groups for a Training Day
export const trainingDayMuscleGroups = pgTable(
  'training_day_muscle_groups',
  {
    id,
    trainingDayId: uuid()
      .references(() => trainingDays.id)
      .notNull(),
    userId,
    muscleGroupId: uuid()
      .references(() => muscleGroups.id)
      .notNull(),
    order: smallint('order').notNull(),
  },
  (table) => [usersOnlyPolicy],
)

// a program is made up of several, ordered workout templates which consist of a list of exercises, as well as the desired RIR, and a name
export const templates = pgTable(
  'templates',
  {
    id,
    trainingDayId: uuid().references(() => trainingDays.id, {
      onDelete: 'cascade',
    }),
    userId,
    name: text(),
    description: text(),
    order: smallint().default(0),
  },
  (table) => [usersOnlyPolicy],
)

export const templatesRelations = relations(templates, ({ one, many }) => ({
  user: one(users),
  exercises: many(exercises),
}))

// 🔹 Exercises for Each Muscle Group in a Template
export const templateExercises = pgTable(
  'template_exercises',
  {
    id,
    templateId: uuid()
      .references(() => templates.id)
      .notNull(),
    exerciseId: uuid()
      .references(() => exercises.id)
      .notNull(),
    muscleGroupId: uuid()
      .references(() => muscleGroups.id)
      .notNull(),
    userId,
    order: smallint('order').notNull(),
  },
  (table) => [usersOnlyPolicy],
)

// 🔹 Sessions (Instances of a Workout Template)
export const sessions = pgTable(
  'sessions',
  {
    id,
    userId,
    name: text(),
    templateId: uuid().references(() => templates.id),
    order: smallint().default(0),
    completed: boolean().default(false),
    date: date().notNull().defaultNow(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    // set completed at when completed becomes true
    completedAt: timestamp(),
  },
  (table) => [index('sessionsUserIdIndex').on(table.userId), usersOnlyPolicy],
)

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  user: one(users),
  sets: many(sets),
  setGroups: many(setGroups),
  templates: one(templates),
}))

export const setGroups = pgTable(
  'set_groups',
  {
    id,
    userId,
    sessionId: uuid().references(() => sessions.id, {
      onDelete: 'cascade',
    }),
    exerciseId: uuid().references(() => exercises.id),
    order: smallint().default(0),
  },
  (table) => [
    index('setGroupsUserIdIndex').on(table.userId),
    index('setGroupsSessionIdIndex').on(table.sessionId),
    usersOnlyPolicy,
  ],
)

export const setGroupsRelation = relations(setGroups, ({ one, many }) => ({
  user: one(users),
  exercises: one(exercises),
  session: one(sessions),
  sets: many(sets),
}))

export const sets = pgTable(
  'sets',
  {
    id,
    // relations
    userId,
    sessionId: uuid()
      .notNull()
      .references(() => sessions.id, {
        onDelete: 'cascade',
      }),
    exerciseId: uuid()
      .notNull()
      .references(() => exercises.id, {
        onDelete: 'cascade',
      }),
    // TODO: think about this. Should we delete the set if the exercise is deleted?
    setGroupId: uuid()
      .notNull()
      .references(() => setGroups.id, {
        onDelete: 'cascade',
      }),
    // attributes
    reps: smallint(),
    rir: smallint(),
    weight: real(),
    order: smallint().default(0),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('setsUserIdIndex').on(table.userId),
    index('setsSessionIdIndex').on(table.sessionId),
    index('setsExerciseIdIndex').on(table.exerciseId),
    index('setsSetGroupIdIndex').on(table.setGroupId),
    usersOnlyPolicy,
  ],
)

export const setsRelation = relations(sets, ({ one }) => ({
  user: one(users),
  sessions: one(sessions),
  templates: one(templates),
  exercises: one(exercises),
  setGroups: one(setGroups),
  exercise: one(exercises),
}))

export type User = typeof users.$inferSelect
export type Exercise = typeof exercises.$inferSelect
export type Template = typeof templates.$inferSelect
export type Session = typeof sessions.$inferSelect
export type SetGroup = typeof setGroups.$inferSelect
export type Set = typeof sets.$inferSelect
export type Quote = typeof quotes.$inferSelect
export type MuscleGroup = typeof muscleGroups.$inferSelect
export type Split = typeof splits.$inferSelect
export type TrainingDay = typeof trainingDays.$inferSelect
export type TemplateExercise = typeof templateExercises.$inferSelect
export type TrainingDayMuscleGroup = typeof trainingDayMuscleGroups.$inferSelect

export interface SetGroupWithExerciseAndSets extends SetGroup {
  exercise: Exercise
  sets: Set[]
}

export interface SessionWithSetGroupWithExerciseAndSets extends Session {
  setGroups: SetGroupWithExerciseAndSets[]
}

// TODO: determine if all relations can be removed because they are redundant for dribble query
// https://orm.drizzle.team/docs/rqb
