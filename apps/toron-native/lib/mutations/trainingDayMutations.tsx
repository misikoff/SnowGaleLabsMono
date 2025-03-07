import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Split } from '../../../../packages/toron-db/schema'
import {
  createTrainingDay,
  updateTrainingDay,
  deleteTrainingDay,
} from '../dbFunctions'
import { mutationSettings } from './mutationSettings'
// import { invalidateSplitQueries, splitRefetcher } from './refetcher'

export const useCreateTrainingDayMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTrainingDay,
    onMutate: async (vars) => {
      if (!mutationSettings.optimisticUpdate) {
        return
      }
      await queryClient.cancelQueries({ queryKey: ['trainingDays'] })
      const previousTrainingDays = queryClient.getQueryData(['trainingDays'])
      const newSplit = { ...vars, id: Date.now().toString() }
      queryClient.setQueryData(['splits'], (old: any) => [...old, newSplit])
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
      queryClient.setQueryData(['splits'], (old: any) =>
        old.map((split: Split) =>
          split.id === vars.id ? { ...split, ...vars } : split,
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
      queryClient.setQueryData(['splits'], (old: any) =>
        old.filter((split: Split) => split.id !== vars.id),
      )
      return { previousTrainingDays }
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(['splits'], context?.previousTrainingDays)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['trainingDays'])
    },
    onSettled: () => {
      queryClient.invalidateQueries(['trainingDays'])
    },
  })
}
