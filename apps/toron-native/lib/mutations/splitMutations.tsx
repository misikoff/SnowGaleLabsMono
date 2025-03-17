import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Split } from '../../../../packages/toron-db/schema'
import { createSplit, updateSplit, deleteSplit } from '../dbFunctions'
import { mutationSettings } from './mutationSettings'

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
      const newSplit = { ...vars }
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
      const previousSplits = queryClient.getQueryData(['splits']) as
        | Split[]
        | undefined
      console.log({ vars })
      queryClient.setQueryData(
        ['splits'],
        // previousSplits
        //   ? previousSplits.filter((split: Split) => split.id !== vars.id)
        //   : [],
        (old: any) => old.filter((split: Split) => split.id !== vars.id),
      )

      // queryClient.setQueryData(['splits'], [])
      return { previousSplits }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['splits'])
      queryClient.invalidateQueries(['profile'])
    },
    onSettled: () => {
      queryClient.invalidateQueries(['splits'])
      queryClient.invalidateQueries(['profile'])
    },
  })
}
