import {
  real,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'

export const playing_with_neon = pgTable(
  'playing_with_neon',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }),
    value: real('value'),
    x: varchar('x', { length: 256 }),
  },
  (playing_with_neon) => {
    return {
      nameIndex: uniqueIndex('name_idx').on(playing_with_neon.name),
    }
  },
)

export const exercises = pgTable(
  'exercises',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }),
    value: real('value'),
    x: varchar('x', { length: 256 }),
  },
  (exercises) => {
    return {
      nameIndex: uniqueIndex('exercise_name_idx').on(exercises.name),
    }
  },
)
