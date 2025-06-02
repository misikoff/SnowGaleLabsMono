'use client'

import { useState, useRef, useEffect } from 'react'

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { produce } from 'immer'
import { XIcon } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

import {
  getMuscleGroups,
  createMiniExercise,
  getMiniExercises,
  deleteMiniExercise,
} from '@/lib/dbFunctions'

import { MiniExercise } from '../../../../../../packages/toron-db/schema'

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
  const [currentDate] = useState(() => {
    const now = new Date()
    // Get YYYY-MM-DD in local time
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  })

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

  // Group mini exercises by date
  const groupedByDate: Record<string, any[]> = {}
  for (const ex of sortedMiniExercises) {
    if (!groupedByDate[ex.date]) {
      groupedByDate[ex.date] = []
    }
    groupedByDate[ex.date].push(ex)
  }
  const groupedDates = Object.keys(groupedByDate).sort((a, b) =>
    // b.localeCompare(a),
    a.localeCompare(b),
  )

  // Ref for the scroll container
  const scrollRef = useRef<HTMLUListElement>(null)

  // Scroll to bottom on mount or when exercises change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [sortedMiniExercises.length])

  return (
    <div className='flex h-full w-full flex-col'>
      <div className='flex w-full flex-1 flex-col items-center justify-center'>
        {(isLoading || error) && (
          <div className='mt-4 flex flex-col gap-4'>
            {isLoading && <div>Loading muscle groups...</div>}
            {error && (
              <div className='text-red-600'>Error loading muscle groups</div>
            )}
          </div>
        )}
        <div className='h-full w-full max-w-md rounded-lg border p-4 text-black shadow-lg'>
          <h2 className='mb-2 font-semibold'>Exercise History</h2>
          {isLoadingMiniExercises && <div>Loading exercises...</div>}
          {sortedMiniExercises.length === 0 && !isLoadingMiniExercises && (
            <div className='text-gray-500'>No exercises found.</div>
          )}
          <ul
            ref={scrollRef}
            className='max-h-96 space-y-1 overflow-scroll'
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {groupedDates.map((date) => (
              <li key={date}>
                <div className='mt-2 mb-1 font-mono font-semibold text-blue-900'>
                  {date}
                </div>
                <ul>
                  {groupedByDate[date].map((ex: any) => (
                    <li
                      key={ex.id}
                      className='flex items-center justify-between border-b py-1 text-sm'
                    >
                      <span>
                        {muscleGroups?.find(
                          (mg) => mg.id === ex.muscleGroupId,
                        ) && (
                          <span className='text-gray-700'>
                            {
                              muscleGroups?.find(
                                (mg) => mg.id === ex.muscleGroupId,
                              )!.name
                            }
                          </span>
                        )}
                      </span>
                      <button
                        className='ml-4 rounded bg-zinc-400 px-2 py-1 text-xs text-white hover:bg-red-700'
                        onClick={() => {
                          setExerciseToDelete(ex)
                          setShowDeleteModal(true)
                        }}
                      >
                        <XIcon className='h-4 w-4' />
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <button
            className='mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
            onClick={() => setShowCreateModal(true)}
          >
            Add Exercise
          </button>
        </div>
      </div>
      {/* Create Mini Exercise Modal */}
      {showCreateModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
          <div className='min-w-[300px] rounded bg-white p-6 text-black shadow-lg'>
            <h3 className='mb-4 text-lg font-semibold'>Add Exercise</h3>
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
                {muscleGroups
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  .map((group: any) => (
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
          <div className='min-w-[300px] rounded bg-white p-6 text-black shadow-lg'>
            <h3 className='mb-4 text-lg font-semibold'>Confirm Delete</h3>
            <p>
              Are you sure you want to delete this exercise:{' '}
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
