import { Set } from '@repo/db/schema'

export function createDummySet({
  id, // required
  userId = '', // should be present but not currently required
  microcycleId = '',
  programId = '',
  exerciseId, // required
  setGroupId, // required
  sessionId, // required
  prescribedReps = null,
  prescribedRpe = null,
  prescribedRir = null,
  prescribedWeight = null,
  reps = null,
  rpe = null,
  rir = null,
  weight = null,
  order = null,
  createdAt = new Date(),
  updatedAt = new Date(),
}: {
  id: string
  userId?: string
  microcycleId?: string
  programId?: string
  exerciseId: string
  setGroupId: string
  sessionId: string
  prescribedReps?: number | null
  prescribedRpe?: number | null
  prescribedRir?: number | null
  prescribedWeight?: number | null
  reps?: number | null
  rpe?: number | null
  rir?: number | null
  weight?: number | null
  order?: number | null
  createdAt?: Date
  updatedAt?: Date
}): Set {
  return {
    id,
    userId,
    microcycleId,
    programId,
    exerciseId,
    setGroupId,
    sessionId,
    prescribedReps,
    prescribedRpe,
    prescribedRir,
    prescribedWeight,
    reps,
    rpe,
    rir,
    weight,
    order,
    createdAt,
    updatedAt,
  }
}
