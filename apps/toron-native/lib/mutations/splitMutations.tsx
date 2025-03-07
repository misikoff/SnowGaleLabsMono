import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Split } from '../../../../packages/toron-db/schema'
import { createSplit, updateSplit, deleteSplit } from '../dbFunctions'
import { mutationSettings } from './mutationSettings'
import { invalidateSplitQueries, splitRefetcher } from './refetcher'

export const useCreateSplitMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSplit,
    onMutate: async (vars) => {
      if (!mutationSettings.optimisticUpdate) {
        return
      }
      await queryClient.cancelQueries({ queryKey: ['splits'] })
      const previousSplits = queryClient.getQueryData(['splits'])
      const newSplit = { ...vars, id: Date.now().toString() }
      queryClient.setQueryData(['splits'], (old: any) => [...old, newSplit])
      return { previousSplits }
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(['splits'], context?.previousSplits)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['splits'])
    },
    onSettled: () => {
      queryClient.invalidateQueries(['splits'])
    },
  })
}

export const useUpdateSplitMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateSplit,
    onMutate: async (vars) => {
      if (!mutationSettings.optimisticUpdate) {
        return
      }
      await queryClient.cancelQueries({ queryKey: ['splits'] })
      const previousSplits = queryClient.getQueryData(['splits'])
      queryClient.setQueryData(['splits'], (old: any) =>
        old.map((split: Split) =>
          split.id === vars.id ? { ...split, ...vars } : split,
        ),
      )
      return { previousSplits }
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(['splits'], context?.previousSplits)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['splits'])
    },
    onSettled: () => {
      queryClient.invalidateQueries(['splits'])
    },
  })
}

export const useDeleteSplitMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSplit,
    onMutate: async (vars) => {
      if (!mutationSettings.optimisticUpdate) {
        return
      }
      await queryClient.cancelQueries({ queryKey: ['splits'] })
      const previousSplits = queryClient.getQueryData(['splits'])
      queryClient.setQueryData(['splits'], (old: any) =>
        old.filter((split: Split) => split.id !== vars.id),
      )
      return { previousSplits }
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(['splits'], context?.previousSplits)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['splits'])
    },
    onSettled: () => {
      queryClient.invalidateQueries(['splits'])
    },
  })
}
