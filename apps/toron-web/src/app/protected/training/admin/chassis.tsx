'use client'

import { useState } from 'react'

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { produce } from 'immer'
import { v4 as uuidv4 } from 'uuid'

import {
  getMuscleGroups,
  createMiniExercise,
  getMiniExercises,
  deleteMiniExercise,
} from '@/lib/dbFunctions'

const miniExercisesToImport = [
  { date: '2025-04-27', muscleGroupName: 'Shoulders' },
  { date: '2025-04-27', muscleGroupName: 'Mid/upper back' },
  { date: '2025-04-27', muscleGroupName: 'Triceps - long' },
  { date: '2025-04-27', muscleGroupName: 'Biceps - hammer' },
  { date: '2025-04-27', muscleGroupName: 'Abductors/glutes' },
  { date: '2025-04-27', muscleGroupName: 'Adductors' },
  { date: '2025-04-28', muscleGroupName: 'Chest' },
  { date: '2025-04-28', muscleGroupName: 'Neck' },
  { date: '2025-04-28', muscleGroupName: 'Quads' },
  { date: '2025-04-28', muscleGroupName: 'Lats' },
  { date: '2025-04-28', muscleGroupName: 'Calves' },
  { date: '2025-04-30', muscleGroupName: 'Hamstrings' },
  { date: '2025-04-30', muscleGroupName: 'Biceps' },
  { date: '2025-04-30', muscleGroupName: 'Mid back' },
  { date: '2025-04-30', muscleGroupName: 'Chest' },
  { date: '2025-04-30', muscleGroupName: 'Calves' },
  { date: '2025-05-01', muscleGroupName: 'Lats' },
  { date: '2025-05-01', muscleGroupName: 'Triceps' },
  { date: '2025-05-01', muscleGroupName: 'Shoulders' },
  { date: '2025-05-01', muscleGroupName: 'Quads' },
  { date: '2025-05-01', muscleGroupName: 'Abs' },
  { date: '2025-05-01', muscleGroupName: 'Mid traps' },
  { date: '2025-05-04', muscleGroupName: 'Shoulders' },
  { date: '2025-05-04', muscleGroupName: 'Mid back' },
  { date: '2025-05-04', muscleGroupName: 'Triceps' },
  { date: '2025-05-04', muscleGroupName: 'Neck' },
  { date: '2025-05-04', muscleGroupName: 'Biceps' },
  { date: '2025-05-05', muscleGroupName: 'Chest' },
  { date: '2025-05-05', muscleGroupName: 'Biceps' },
  { date: '2025-05-05', muscleGroupName: 'Quads' },
  { date: '2025-05-05', muscleGroupName: 'Lats' },
  { date: '2025-05-05', muscleGroupName: 'Calves' },
  { date: '2025-05-05', muscleGroupName: 'Shoulders' },
  { date: '2025-05-06', muscleGroupName: 'Triceps' },
  { date: '2025-05-06', muscleGroupName: 'Mid traps' },
  { date: '2025-05-06', muscleGroupName: 'Glutes' },
  { date: '2025-05-06', muscleGroupName: 'Abs' },
  { date: '2025-05-06', muscleGroupName: 'Hamstrings' },
  { date: '2025-05-08', muscleGroupName: 'Chest' },
  { date: '2025-05-08', muscleGroupName: 'Lats' },
  { date: '2025-05-08', muscleGroupName: 'Biceps - hammer' },
  { date: '2025-05-08', muscleGroupName: 'Shoulders' },
  { date: '2025-05-08', muscleGroupName: 'Triceps - long' },
  { date: '2025-05-09', muscleGroupName: 'Shoulders' },
  { date: '2025-05-09', muscleGroupName: 'Neck' },
  { date: '2025-05-09', muscleGroupName: 'Upper traps' },
  { date: '2025-05-09', muscleGroupName: 'Calves' },
  { date: '2025-05-09', muscleGroupName: 'Quads' },
  { date: '2025-05-11', muscleGroupName: 'Chest' },
  { date: '2025-05-11', muscleGroupName: 'Biceps' },
  { date: '2025-05-11', muscleGroupName: 'Hamstrings' },
  { date: '2025-05-11', muscleGroupName: 'Adductors' },
  { date: '2025-05-11', muscleGroupName: 'Abductors' },
  { date: '2025-05-11', muscleGroupName: 'Triceps' },
  { date: '2025-05-12', muscleGroupName: 'Shoulders' },
  { date: '2025-05-12', muscleGroupName: 'Lats' },
  { date: '2025-05-12', muscleGroupName: 'Calves' },
  { date: '2025-05-12', muscleGroupName: 'Biceps' },
  { date: '2025-05-12', muscleGroupName: 'Abs' },
  { date: '2025-05-12', muscleGroupName: 'Chest' },
  { date: '2025-05-14', muscleGroupName: 'Upper back' },
  { date: '2025-05-14', muscleGroupName: 'Lats' },
  { date: '2025-05-14', muscleGroupName: 'Neck' },
  { date: '2025-05-14', muscleGroupName: 'Hamstrings' },
  { date: '2025-05-14', muscleGroupName: 'Shoulders' },
  { date: '2025-05-16', muscleGroupName: 'Shoulders' },
  { date: '2025-05-16', muscleGroupName: 'Biceps' },
  { date: '2025-05-16', muscleGroupName: 'Biceps - hammer' },
  { date: '2025-05-16', muscleGroupName: 'Glutes' },
  { date: '2025-05-16', muscleGroupName: 'Upper back' },
  { date: '2025-05-16', muscleGroupName: 'Shoulders - lateral' },
  { date: '2025-05-19', muscleGroupName: 'Mid back' },
  { date: '2025-05-19', muscleGroupName: 'Chest' },
  { date: '2025-05-19', muscleGroupName: 'Triceps' },
  { date: '2025-05-19', muscleGroupName: 'Biceps - hammer' },
  { date: '2025-05-19', muscleGroupName: 'Lats' },
  { date: '2025-05-20', muscleGroupName: 'Shoulders' },
  { date: '2025-05-20', muscleGroupName: 'Quads' },
  { date: '2025-05-20', muscleGroupName: 'Biceps' },
  { date: '2025-05-20', muscleGroupName: 'Chest' },
  { date: '2025-05-20', muscleGroupName: 'Calves' },
  { date: '2025-05-22', muscleGroupName: 'Mid back' },
  { date: '2025-05-22', muscleGroupName: 'Neck' },
  { date: '2025-05-22', muscleGroupName: 'Lats' },
  { date: '2025-05-22', muscleGroupName: 'Quads' },
  { date: '2025-05-22', muscleGroupName: 'Triceps' },
  { date: '2025-05-23', muscleGroupName: 'Shoulders' },
  { date: '2025-05-23', muscleGroupName: 'Chest' },
  { date: '2025-05-23', muscleGroupName: 'Biceps' },
  { date: '2025-05-23', muscleGroupName: 'Calves' },
  { date: '2025-05-23', muscleGroupName: 'Abductors' },
  { date: '2025-05-23', muscleGroupName: 'Adductors' },
  { date: '2025-05-23', muscleGroupName: 'Hamstrings' },
  { date: '2025-05-24', muscleGroupName: 'Chest' },
  { date: '2025-05-24', muscleGroupName: 'Triceps' },
  { date: '2025-05-24', muscleGroupName: 'Lats' },
  { date: '2025-05-24', muscleGroupName: 'Biceps-hammer' },
  { date: '2025-05-24', muscleGroupName: 'Shoulders' },
  { date: '2025-05-25', muscleGroupName: 'Mid back' },
  { date: '2025-05-25', muscleGroupName: 'Triceps' },
  { date: '2025-05-25', muscleGroupName: 'Biceps' },
  { date: '2025-05-25', muscleGroupName: 'Abs' },
  { date: '2025-05-25', muscleGroupName: 'Calves' },
  { date: '2025-05-28', muscleGroupName: 'Chest' },
  { date: '2025-05-28', muscleGroupName: 'Lats' },
  { date: '2025-05-28', muscleGroupName: 'Triceps' },
  { date: '2025-05-28', muscleGroupName: 'Biceps' },
  { date: '2025-05-29', muscleGroupName: 'Quads' },
  { date: '2025-05-29', muscleGroupName: 'Hamstrings' },
  { date: '2025-05-29', muscleGroupName: 'Neck' },
  { date: '2025-05-29', muscleGroupName: 'Shoulders' },
  { date: '2025-05-29', muscleGroupName: 'Midtraps' },
]

import { MiniExercise } from '../../../../../../../packages/toron-db/schema'

export default function Chassis() {
  const queryClient = useQueryClient()
  const {
    data: muscleGroups,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['muscleGroups'],
    queryFn: getMuscleGroups,
  })

  // get miniexercises
  const { data: miniExercises, isLoading: isLoadingMiniExercises } = useQuery({
    queryKey: ['miniExercises'],
    queryFn: () => getMiniExercises(),
  })

  // Current date state
  const [currentDate] = useState(() => new Date().toISOString().slice(0, 10))

  // Selected muscle group state
  const [selectedGroup, setSelectedGroup] = useState<string>('')

  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [exerciseToDelete, setExerciseToDelete] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Optimistic mutation for creating mini exercise
  const createMiniExerciseMutation = useMutation({
    mutationFn: async (payload: {
      id: string
      date: string
      muscleGroupId: string
    }) => {
      return createMiniExercise(payload)
    },
    onMutate: async (newExercise) => {
      setShowCreateModal(false)
      await queryClient.cancelQueries({ queryKey: ['miniExercises'] })
      const previous =
        queryClient.getQueryData<MiniExercise[]>(['miniExercises']) || []
      console.log({ previous })
      const nextMiniExercises = produce(previous, (draft: MiniExercise[]) => {
        draft = draft || []
        draft.push({
          ...newExercise,
        } as any)
      })

      setSelectedGroup('')
      // console.log({ nextSessions })
      // Optimistically update to the new value
      queryClient.setQueryData(['miniExercises'], nextMiniExercises)

      // Return a context object with the snapshotted value
      return { previous }
    },
    onError: (_err, _newExercise, context) => {
      console.error('Error creating mini exercise:', _err)
      if (context?.previous) {
        queryClient.setQueryData(['miniExercises'], context.previous)
      }
    },
    onSettled: () => {
      console.log('Mini exercise settled')
      queryClient.invalidateQueries({ queryKey: ['miniExercises'] })
    },
    onSuccess: (data) => {
      console.log('Mini exercise created successfully:', data)
    },
  })

  // Optimistic mutation for deleting mini exercise
  const deleteMiniExerciseMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      return deleteMiniExercise({ id })
    },
    onMutate: async ({ id }) => {
      setShowDeleteModal(false)
      setExerciseToDelete(null)
      await queryClient.cancelQueries({ queryKey: ['miniExercises'] })
      const previous =
        queryClient.getQueryData<MiniExercise[]>(['miniExercises']) || []
      // Optimistically remove the exercise
      queryClient.setQueryData<any[]>(
        ['miniExercises'],
        previous.filter((ex: any) => ex.id !== id),
      )
      console.log('Optimistically deleted mini exercise:', id)
      console.log('Previous mini exercises:', previous)

      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['miniExercises'], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['miniExercises'] })
    },
  })

  // Bulk import mutation
  const importAllMutation = useMutation({
    mutationFn: async () => {
      if (!muscleGroups) {
        return
      }
      // Map muscleGroupName to muscleGroupId
      const nameToId: Record<string, string> = {}
      muscleGroups.forEach((mg: any) => {
        nameToId[mg.name.trim().toLowerCase()] = mg.id
      })
      // Filter out those that can't be matched
      const toImport = miniExercisesToImport
        .map((ex) => ({
          ...ex,
          muscleGroupId: nameToId[ex.muscleGroupName.trim().toLowerCase()],
        }))
        .filter((ex) => ex.muscleGroupId)
      // Insert all
      for (const ex of toImport) {
        console.log('Importing mini exercise:', ex)
        await createMiniExercise({
          id: uuidv4(),
          date: ex.date,
          muscleGroupId: ex.muscleGroupId,
        })
      }
      return toImport.length
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['miniExercises'] })
    },
    onError: (error) => {
      console.error('Error importing mini exercises:', error)
    },
    onSettled: () => {
      console.log('Import all mini exercises settled')
      queryClient.invalidateQueries({ queryKey: ['miniExercises'] })
    },
  })

  // Handle create mini exercise
  const handleCreateMiniExercise = async () => {
    if (!selectedGroup) {
      return
    }
    createMiniExerciseMutation.mutate({
      id: uuidv4(), // Generate a unique ID
      date: currentDate,
      muscleGroupId: selectedGroup,
    })
  }

  // Handle delete mini exercise
  const handleDeleteMiniExercise = (id: string) => {
    deleteMiniExerciseMutation.mutate({ id })
  }

  // Sort mini exercises descending by date (assumes date property exists)
  const sortedMiniExercises = (miniExercises ?? [])
    .slice()
    .sort((a: any, b: any) => (b.date ?? '').localeCompare(a.date ?? ''))

  return (
    <div className='flex h-full w-full flex-col bg-red-50'>
      <div className='flex flex-1 flex-col items-center justify-center'>
        <div className='mt-4 flex flex-col gap-4'>
          {isLoading && <div>Loading muscle groups...</div>}
          {error && (
            <div className='text-red-600'>Error loading muscle groups</div>
          )}
        </div>
        <div className='mt-6'>
          <h2 className='mb-2 font-semibold'>Mini Exercises</h2>
          <button
            className='mb-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700'
            onClick={() => importAllMutation.mutate()}
            disabled={importAllMutation.isPending}
          >
            {importAllMutation.isPending ? 'Importing...' : 'Import All'}
          </button>
          {isLoadingMiniExercises && <div>Loading mini exercises...</div>}
          {sortedMiniExercises.length === 0 && !isLoadingMiniExercises && (
            <div className='text-gray-500'>No mini exercises found.</div>
          )}
          <ul className='space-y-1'>
            {sortedMiniExercises.map((ex: any) => (
              <li
                key={ex.id}
                className='flex items-center justify-between border-b py-1 text-sm'
              >
                <span>
                  <span className='font-mono'>{ex.date}</span>
                  {muscleGroups?.find((mg) => mg.id === ex.muscleGroupId) && (
                    <span className='ml-2 text-gray-700'>
                      {
                        muscleGroups?.find((mg) => mg.id === ex.muscleGroupId)!
                          .name
                      }
                    </span>
                  )}
                </span>
                <button
                  className='ml-4 rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-700'
                  onClick={() => {
                    setExerciseToDelete(ex)
                    setShowDeleteModal(true)
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <button
            className='mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
            onClick={() => setShowCreateModal(true)}
          >
            Create Mini Exercise
          </button>
        </div>
      </div>
      {/* Create Mini Exercise Modal */}
      {showCreateModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
          <div className='min-w-[300px] rounded bg-white p-6 shadow-lg'>
            <h3 className='mb-4 text-lg font-semibold'>Create Mini Exercise</h3>
            <div>
              <div>
                <span className='font-semibold'>Current Date:</span>{' '}
                {currentDate}
              </div>
              <select
                className='mt-4 w-full rounded border px-2 py-1'
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                <option value=''>Select muscle group</option>
                {muscleGroups?.map((group: any) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>

              <div className='mt-6 flex justify-end gap-2'>
                <button
                  className='rounded bg-gray-200 px-4 py-2'
                  onClick={() => {
                    setShowCreateModal(false)
                  }}
                >
                  Cancel
                </button>
                <button
                  className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
                  onClick={handleCreateMiniExercise}
                  disabled={createMiniExerciseMutation.isPending}
                >
                  {createMiniExerciseMutation.isPending
                    ? 'Creating...'
                    : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Modal */}
      {showDeleteModal && exerciseToDelete && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
          <div className='min-w-[300px] rounded bg-white p-6 shadow-lg'>
            <h3 className='mb-4 text-lg font-semibold'>Confirm Delete</h3>
            <p>
              Are you sure you want to delete the mini exercise on{' '}
              <span className='font-mono'>{exerciseToDelete.date}</span>{' '}
              {muscleGroups?.find(
                (mg) => mg.id === exerciseToDelete.muscleGroupId,
              )?.name
                ? `(${muscleGroups.find((mg) => mg.id === exerciseToDelete.muscleGroupId)?.name})`
                : ''}
              ?
            </p>
            <div className='mt-6 flex justify-end gap-2'>
              <button
                className='rounded bg-gray-200 px-4 py-2'
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className='rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700'
                onClick={() => handleDeleteMiniExercise(exerciseToDelete.id)}
                disabled={deleteMiniExerciseMutation.isPending}
              >
                {deleteMiniExerciseMutation.isPending
                  ? 'Deleting...'
                  : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
