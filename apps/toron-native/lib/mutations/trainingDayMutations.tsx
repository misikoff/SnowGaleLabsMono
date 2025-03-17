import { useMutation, useQueryClient } from '@tanstack/react-query'

import { TrainingDay } from '../../../../packages/toron-db/schema'
import {
  createTrainingDay,
  updateTrainingDay,
  deleteTrainingDay,
} from '../dbFunctions'
import { mutationSettings } from './mutationSettings'

export const useCreateTrainingDayMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTrainingDay,
    onMutate: async (vars) => {
      if (!mutationSettings.optimisticUpdate) {
        return
      }
      await queryClient.cancelQueries({ queryKey: ['trainingDays'] })
      const previousTrainingDays = queryClient.getQueryData([
        'trainingDays',
      ]) as TrainingDay[] | undefined
      const newTrainingDay = { ...vars }
      queryClient.setQueryData(
        ['trainingDays'],
        previousTrainingDays
          ? [...previousTrainingDays, newTrainingDay]
          : [newTrainingDay],
      )
      return { previousTrainingDays }
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(['trainingDays'], context?.previousTrainingDays)
      console.error('error creating training day1', err)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['trainingDays'])
      // console.log('training day created1')
    },
    onSettled: () => {
      queryClient.invalidateQueries(['trainingDays'])
      // console.log('training day settled1')
    },
  })
}

export const useUpdateTrainingDayMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTrainingDay,
    onMutate: async (vars) => {
      if (!mutationSettings.optimisticUpdate) {
        return
      }
      await queryClient.cancelQueries({ queryKey: ['trainingDays'] })
      const previousTrainingDays = queryClient.getQueryData(['trainingDays'])
      queryClient.setQueryData(['trainingDays'], (old: any) =>
        old.map((trainingDay: TrainingDay) =>
          trainingDay.id === vars.id
            ? { ...trainingDay, ...vars }
            : trainingDay,
        ),
      )
      return { previousTrainingDays }
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(['trainingDays'], context?.previousTrainingDays)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['trainingDays'])
    },
    onSettled: () => {
      queryClient.invalidateQueries(['trainingDays'])
    },
  })
}

export const useDeleteTrainingDayMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTrainingDay,
    onMutate: async (vars) => {
      if (!mutationSettings.optimisticUpdate) {
        return
      }
      await queryClient.cancelQueries({ queryKey: ['trainingDays'] })
      const previousTrainingDays = queryClient.getQueryData(['trainingDays'])
      queryClient.setQueryData(['trainingDays'], (old: any) =>
        old.filter((trainingDay: TrainingDay) => trainingDay.id !== vars.id),
      )
      return { previousTrainingDays }
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(['trainingDays'], context?.previousTrainingDays)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['trainingDays'])
    },
    onSettled: () => {
      queryClient.invalidateQueries(['trainingDays'])
    },
  })
}
