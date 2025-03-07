import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateProfile } from '../dbFunctions'
import { mutationSettings } from './mutationSettings'

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProfile,
    onMutate: async (vars) => {
      if (!mutationSettings.optimisticUpdate) {
        return
      }
      await queryClient.cancelQueries({ queryKey: ['profile'] })
      const previousProfile = queryClient.getQueryData(['profile'])
      queryClient.setQueryData(['profile'], (old: any) => ({ ...old, ...vars }))
      return { previousProfile }
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(['profile'], context?.previousProfile)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['profile'])
    },
    onSettled: () => {
      queryClient.invalidateQueries(['profile'])
    },
  })
}
