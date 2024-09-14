import { Set } from 'db/schema'

export function createDummySet({
  id, // required
  userId = '', // should be present but not currently required
  microcycleId = '',
  programId = '',
  exerciseId, // required
  setGroupId, // required
  sessionId, // required
  prescribedReps = null,
  prescribedRPE = null,
  prescribedRIR = null,
  prescribedWeight = null,
  reps = null,
  RPE = null,
  RIR = null,
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
  prescribedRPE?: number | null
  prescribedRIR?: number | null
  prescribedWeight?: number | null
  reps?: number | null
  RIR?: number | null
  RPE?: number | null
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
    prescribedRPE,
    prescribedRIR,
    prescribedWeight,
    reps,
    RPE,
    RIR,
    weight,
    order,
    createdAt,
    updatedAt,
  }
}
