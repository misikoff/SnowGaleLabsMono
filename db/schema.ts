import { relations, sql } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  pgTable,
  real,
  smallint,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const repStyleEnum = ['high', 'medium', 'low'] as const
export type RepStyle = (typeof repStyleEnum)[number]

export const weightUnitsEnum = ['lbs', 'kg'] as const
export type WeightUnits = (typeof weightUnitsEnum)[number]

export const distanceUnitsEnum = ['yards', 'meters'] as const
export type DistanceUnits = (typeof distanceUnitsEnum)[number]

export const exerciseType = ['compound', 'isolation'] as const
export type ExerciseType = (typeof exerciseType)[number]

export const setGroupType = ['superset', 'circuit', 'normal'] as const

export const users = pgTable(
  'users',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    name: text('name'),
    clerkId: text('clerk_id'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    clerkIdIndex: index('clerk_id_idx').on(table.clerkId),
  }),
)

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

export const exercises = pgTable(
  'exercises',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    isMainExercise: boolean('is_main_exercise').default(false),
    // only generate main exercise id if isMainExercise is true
    mainExerciseId: uuid('main_exercise_id').$onUpdate(() => {
      return sql`CASE WHEN is_main_exercise = true THEN uuid_generate_v4() ELSE null END`
    }),
    // TODO: test the above
    name: text('name'),
    description: text('description'),
    equipmentType: text('equipment_type', { enum: equipmentEnum }),
    defaultRepRange: text('default_rep_range', { enum: repStyleEnum }).default(
      'medium',
    ),
    weightIncrement: real('weight_increment').default(5),
    weightUnits: text('weight_units', {
      enum: weightUnitsEnum,
    }).default('lbs'),
    useWeight: boolean('use_weight').default(true),
    useDistance: boolean('use_Distance').default(false),
    distanceIncrement: real('distance_increment').default(5),
    distanceUnits: text('distance_units', {
      enum: distanceUnitsEnum,
    }).default('yards'),
    notes: text('notes'),
  },
  (table) => ({
    isMainExerciseIndex: index('is_main_exercise_idx').on(table.isMainExercise),
    userIdIndex: index('user_id_idx').on(table.userId),
  }),
)

// // create a table or Programs with a name and a description and a user column for the user who created it
export const programs = pgTable(
  'programs',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'cascade',
    }),
    name: text('name'),
    description: text('description'),
  },
  (table) => ({
    userIdIndex: index('program_user_id_idx').on(table.userId),
  }),
)

export const programsRelations = relations(programs, ({ one, many }) => ({
  user: one(users),
  macrocycles: many(macrocycles),
  microcycles: many(microcycles),
}))

export const macrocycles = pgTable(
  'macrocycles',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    // TODO: should deletes cascade?,
    programId: uuid('program_id').references(() => programs.id),
    name: text('name'),
    order: smallint('order'),
  },
  (table) => ({
    userIdIndex: index('macro_cycle_user_id_idx').on(table.userId),
  }),
)

export const macrocyclesRelations = relations(macrocycles, ({ one, many }) => ({
  user: one(users),
  program: one(programs),
  microcycles: many(microcycles),
  sessions: many(sessions),
  many: many(setGroups),
}))

export const microcycles = pgTable(
  'microcycles',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    // TODO: should deletes cascade?,
    programId: uuid('program_id').references(() => programs.id),
    macrocycleId: uuid('macrocycle_id').references(() => macrocycles.id),
    name: text('name'),
    order: smallint('order'),
  },
  (table) => ({
    userIdIndex: index('microcyle_user_id_idx').on(table.userId),
  }),
)

export const microcyclesRelations = relations(microcycles, ({ one, many }) => ({
  user: one(users),
  program: one(programs),
  macrocycle: one(macrocycles),
  sessions: many(sessions),
  many: many(setGroups),
}))

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'cascade',
    }),
    name: text('name'),
    programId: uuid('program_id').references(() => programs.id),
    macrocycleId: uuid('macrocycle_id').references(() => macrocycles.id),
    microcycleId: uuid('microcycle_id').references(() => microcycles.id),
    order: smallint('order'),
    completed: boolean('completed').default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
    // set completed at when completed becomes true
    completedAt: timestamp('completed_at').$onUpdate(() => {
      return sql`CASE WHEN completed = true THEN now() ELSE null END`
    }),
    // TODO: test the above
  },
  (table) => ({
    userIdIndex: index('session_user_id_idx').on(table.userId),
  }),
)

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  user: one(users),
  sets: many(sets),
  setGroups: many(setGroups),
  program: one(programs),
  macrocycle: one(macrocycles),
  microcycle: one(microcycles),
}))

export const setGroups = pgTable(
  'setGroups',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    sessionId: uuid('session_id').references(() => sessions.id),
    microcycleId: uuid('microcycle_id').references(() => microcycles.id),
    programId: uuid('program_id').references(() => programs.id),
    type: text('type', { enum: setGroupType }).default('normal'),
    // if type is not normal then set exerciseId to null, but dont generate the id automatically
    // TODO: if type is normal make sure the excerciseId is not null
    exerciseId: uuid('exercise_id')
      .references(() => exercises.id)
      .$onUpdate(() => {
        return sql`CASE WHEN type != 'normal' THEN null END`
      }),
    // TODO: test the above
    order: smallint('order'),
  },
  (table) => ({
    userIdIndex: index('set_group_user_id_idx').on(table.userId),
    sessionIdIndex: index('set_group_session_id_idx').on(table.sessionId),
  }),
)

export const setGroupsRelation = relations(setGroups, ({ one, many }) => ({
  user: one(users),
  exercise: one(exercises),
  session: one(sessions),
  microcycle: one(microcycles),
  program: one(programs),
  sets: many(sets),
}))

export const sets = pgTable(
  'sets',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    // relations
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    sessionId: uuid('session_id')
      .notNull()
      .references(() => sessions.id, {
        onDelete: 'cascade',
      }),
    microcycleId: uuid('microcycle_id').references(() => microcycles.id),
    programId: uuid('program_id').references(() => programs.id),
    exerciseId: uuid('excercise_id')
      .notNull()
      .references(() => exercises.id, {
        onDelete: 'cascade',
      }),
    // TODO: think about this. Should we delete the set if the exercise is deleted?
    setGroupId: uuid('set_group_id')
      .notNull()
      .references(() => setGroups.id, {
        onDelete: 'cascade',
      }),
    // attributes
    prescribedReps: integer('prescribed_reps').default(0),
    prescribedRPE: real('prescribed_RPE').default(0),
    prescribedRIR: real('prescribed_RIR').default(0),
    prescribedWeight: real('prescribed_weight').default(0),
    reps: integer('reps').default(0),
    RPE: real('RPE').default(0),
    RIR: integer('RIR').default(0),
    weight: real('weight').default(0),
    order: smallint('order'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdIndex: index('set_user_id_idx').on(table.userId),
    sessionIdIndex: index('set_session_id_idx').on(table.sessionId),
    exerciseIdIndex: index('set_exercise_id_idx').on(table.exerciseId),
    setGroupIdIndex: index('set_set_group_id_idx').on(table.setGroupId),
  }),
)

export const setsRelation = relations(sets, ({ one }) => ({
  user: one(users),
  session: one(sessions),
  microcycle: one(microcycles),
  program: one(programs),
  exercise: one(exercises),
  setGroup: one(setGroups),
}))

export type User = typeof users.$inferSelect
export type Exercise = typeof exercises.$inferSelect
export type Program = typeof programs.$inferSelect
export type Macrocycle = typeof macrocycles.$inferSelect
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

// TODO: determine if all relations can be removed because they are redundant for dribble query
// https://orm.drizzle.team/docs/rqb
