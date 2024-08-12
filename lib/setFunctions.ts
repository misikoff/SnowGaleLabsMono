import { Set } from 'db/users/schema'

function getSetType(set: Set) {
  // if (set.prescribedRepsLow && set.prescribedRepsHigh) {
  //   if (set.prescribedRepsLow === set.prescribedRepsHigh) {
  //     return `${set.prescribedRepsLow} reps`
  //   } else {
  //     return `not same ${set.prescribedRepsLow} - ${set.prescribedRepsHigh}`
  //   }
  // } else if (set.prescribedWeightLow && set.prescribedWeightHigh) {
  //   if (set.prescribedWeightLow === set.prescribedWeightHigh) {
  //     return `${set.prescribedWeightLow}lbs`
  //   } else {
  //     return `${set.prescribedWeightLow} - ${set.prescribedWeightHigh}lbs`
  //   }
  // } else if (set.prescribedDifficultyLow && set.prescribedDifficultyHigh) {
  //   if (set.prescribedDifficultyLow === set.prescribedDifficultyHigh) {
  //     return `${set.prescribedDifficultyLow} RPE`
  //   } else {
  //     return `${set.prescribedDifficultyLow} - ${set.prescribedDifficultyHigh} RPE`
  //   }
  // }
  return ''
}
