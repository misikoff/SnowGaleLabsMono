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
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false)
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])
  const [showPhantomSuggestion, setShowPhantomSuggestion] = useState(false)
  const [showTiersModal, setShowTiersModal] = useState(false)
  const [showClearTodayModal, setShowClearTodayModal] = useState(false)

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

  // Suggest muscle groups for today's workout
  const suggestMuscleGroups = () => {
    if (!muscleGroups || !miniExercises) {
      return []
    }

    const today = currentDate
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10)

    // Get muscle groups trained yesterday
    const yesterdayMuscleGroups = new Set(
      miniExercises
        .filter((ex) => ex.date === yesterday)
        .map((ex) => ex.muscleGroupId),
    )

    // Get muscle group training frequency in last 14 days
    const muscleGroupFrequency: Record<string, number> = {}
    const muscleGroupLastTrained: Record<string, string> = {}

    miniExercises.forEach((ex) => {
      if (ex.muscleGroupId) {
        muscleGroupFrequency[ex.muscleGroupId] =
          (muscleGroupFrequency[ex.muscleGroupId] || 0) + 1

        if (
          !muscleGroupLastTrained[ex.muscleGroupId] ||
          ex.date > muscleGroupLastTrained[ex.muscleGroupId]
        ) {
          muscleGroupLastTrained[ex.muscleGroupId] = ex.date
        }
      }
    })

    // Filter eligible muscle groups (not trained yesterday)
    const eligibleGroups = muscleGroups.filter(
      (mg) => !yesterdayMuscleGroups.has(mg.id),
    )

    // Score muscle groups based on freshness and tier
    const scoredGroups = eligibleGroups.map((mg) => {
      const lastTrained = muscleGroupLastTrained[mg.id]
      const frequency = muscleGroupFrequency[mg.id] || 0

      let daysSinceLastTrained = 14 // default if never trained
      if (lastTrained) {
        const daysDiff = Math.floor(
          (new Date(today).getTime() - new Date(lastTrained).getTime()) /
            (24 * 60 * 60 * 1000),
        )
        daysSinceLastTrained = daysDiff
      }

      // Get tier bonus (higher tier = higher priority)
      const tier = getMuscleGroupTier(mg.name)
      const tierBonus = tier === 1 ? 300 : tier === 2 ? 100 : 0

      // Higher score = better choice
      // Prioritize: tier, days since last trained, then lower frequency
      const score = tierBonus + daysSinceLastTrained * 100 - frequency

      return {
        ...mg,
        score,
        daysSinceLastTrained,
        frequency,
        tier,
      }
    })

    // Sort by score (highest first) and return 4-6 groups
    const suggested = scoredGroups
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(6, Math.max(4, eligibleGroups.length)))
      .map((sg) => sg.id)

    return suggested
  }

  // Handle toggle suggestion checkbox
  const handleToggleSuggestion = (muscleGroupId: string) => {
    setSelectedSuggestions((prev) => {
      if (prev.includes(muscleGroupId)) {
        // Remove from array
        return prev.filter((id) => id !== muscleGroupId)
      } else {
        // Add to end of array
        return [...prev, muscleGroupId]
      }
    })
  }

  // Handle add selected suggestions
  const handleAddSelectedSuggestions = () => {
    selectedSuggestions.forEach((muscleGroupId) => {
      createMiniExerciseMutation.mutate({
        id: uuidv4(),
        date: currentDate,
        muscleGroupId,
      })
    })
    setSelectedSuggestions([])
    setShowSuggestionsModal(false)
  }

  // Handle clear today's exercises
  const handleClearTodayExercises = () => {
    const todayExercises = (miniExercises ?? []).filter(
      (ex) => ex.date === currentDate,
    )

    todayExercises.forEach((exercise) => {
      deleteMiniExerciseMutation.mutate({ id: exercise.id })
    })

    setShowClearTodayModal(false)
  }

  // Muscle group tier system
  const muscleTiers = {
    tier1: ['glutes', 'traps', 'neck', 'mid/upper back'], // Priority
    tier2: ['hamstrings', 'triceps', 'calves', 'abs', 'forearms'], // Mid-tier
    tier3: ['chest', 'shoulders', 'lats', 'quads', 'biceps'], // Maintenance
  }

  // Get tier for a muscle group
  const getMuscleGroupTier = (muscleGroupName: string): 1 | 2 | 3 => {
    const normalizedName = muscleGroupName.toLowerCase()
    if (muscleTiers.tier1.includes(normalizedName)) {
      return 1
    }
    if (muscleTiers.tier2.includes(normalizedName)) {
      return 2
    }
    return 3
  }

  // Get top suggestion for phantom display
  const getTopSuggestion = () => {
    const suggestions = suggestMuscleGroups()
    return suggestions.length > 0 ? suggestions[0] : null
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

  // Include today's date if phantom suggestion is enabled and today doesn't exist
  if (
    showPhantomSuggestion &&
    !groupedByDate[currentDate] &&
    getTopSuggestion()
  ) {
    groupedByDate[currentDate] = []
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

  // Scroll to bottom when phantom suggestion is enabled
  useEffect(() => {
    if (showPhantomSuggestion && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [showPhantomSuggestion])

  return (
    <div className='flex h-full w-full flex-col'>
      {/* Phantom suggestion toggle and tiers button */}
      <div className='mb-4 flex items-center justify-center gap-4'>
        <label className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={showPhantomSuggestion}
            onChange={(e) => setShowPhantomSuggestion(e.target.checked)}
            className='h-4 w-4'
          />
          <span className='text-sm text-gray-700'>
            Show suggestion in today&apos;s list
          </span>
        </label>
        <button
          className='rounded bg-gray-600 px-2 py-1 text-xs text-white hover:bg-gray-700'
          onClick={() => setShowTiersModal(true)}
        >
          Tiers
        </button>
      </div>
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
                <div className='mt-2 mb-1 flex items-center justify-between'>
                  <span className='font-mono font-semibold text-blue-900'>
                    {date}
                  </span>
                  {date === currentDate && (
                    <button
                      className='rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700'
                      onClick={() => setShowClearTodayModal(true)}
                    >
                      Clear
                    </button>
                  )}
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
                      {date === currentDate && (
                        <button
                          className='ml-4 rounded bg-zinc-400 px-2 py-1 text-xs text-white hover:bg-red-700'
                          onClick={() => {
                            setExerciseToDelete(ex)
                            setShowDeleteModal(true)
                          }}
                        >
                          <XIcon className='h-4 w-4' />
                        </button>
                      )}
                    </li>
                  ))}
                  {/* Phantom suggestion for today */}
                  {date === currentDate &&
                    showPhantomSuggestion &&
                    getTopSuggestion() && (
                      <li
                        className='flex cursor-pointer items-center justify-between border-b border-dashed py-1 text-sm opacity-60 hover:opacity-80'
                        onClick={() => {
                          const topSuggestion = getTopSuggestion()
                          if (topSuggestion) {
                            createMiniExerciseMutation.mutate({
                              id: uuidv4(),
                              date: currentDate,
                              muscleGroupId: topSuggestion,
                            })
                          }
                        }}
                      >
                        <span className='text-gray-500 italic'>
                          +{' '}
                          {muscleGroups?.find(
                            (mg) => mg.id === getTopSuggestion(),
                          )?.name || 'Suggested muscle group'}
                        </span>
                        <span className='text-xs text-gray-400'>
                          (click to add)
                        </span>
                      </li>
                    )}
                </ul>
              </li>
            ))}
          </ul>
          <div className='mt-4 flex gap-2'>
            <button
              className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
              onClick={() => setShowCreateModal(true)}
            >
              Add Exercise
            </button>
            <button
              className='rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700'
              onClick={() => {
                setSelectedSuggestions([])
                setShowSuggestionsModal(true)
              }}
            >
              Suggest Today&apos;s Workout
            </button>
          </div>
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
      {/* Suggestions Modal */}
      {showSuggestionsModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
          <div className='min-w-[400px] rounded bg-white p-6 text-black shadow-lg'>
            <h3 className='mb-4 text-lg font-semibold'>
              Suggested Muscle Groups for Today
            </h3>
            <div className='mb-4 text-sm text-gray-600'>
              Based on your training history (avoiding yesterday&apos;s muscles,
              prioritizing 4-6 day rest):
            </div>
            <div className='space-y-2'>
              {suggestMuscleGroups().map((muscleGroupId) => {
                const muscleGroup = muscleGroups?.find(
                  (mg) => mg.id === muscleGroupId,
                )
                const isChecked = selectedSuggestions.includes(muscleGroupId)
                const selectedIndex = selectedSuggestions.indexOf(muscleGroupId)
                const tier = muscleGroup
                  ? getMuscleGroupTier(muscleGroup.name)
                  : 3
                const tierColors = {
                  1: 'bg-green-100 text-green-800',
                  2: 'bg-yellow-100 text-yellow-800',
                  3: 'bg-gray-100 text-gray-800',
                }
                const tierLabels = {
                  1: 'Priority',
                  2: 'Mid-tier',
                  3: 'Maintenance',
                }
                return (
                  <div
                    key={muscleGroupId}
                    className='flex cursor-pointer items-center gap-3 rounded border p-3 hover:bg-gray-50'
                    onClick={() => handleToggleSuggestion(muscleGroupId)}
                  >
                    <input
                      type='checkbox'
                      checked={isChecked}
                      onChange={() => handleToggleSuggestion(muscleGroupId)}
                      className='pointer-events-none h-4 w-4'
                    />
                    <span className='flex-1 font-medium'>
                      {muscleGroup?.name}
                    </span>
                    <div className='flex items-center gap-2'>
                      {isChecked && (
                        <span className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white'>
                          {selectedIndex + 1}
                        </span>
                      )}
                      <span
                        className={`rounded px-2 py-1 text-xs ${tierColors[tier]}`}
                      >
                        {tierLabels[tier]}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className='mt-6 flex justify-end gap-2'>
              <button
                className='rounded bg-gray-200 px-4 py-2'
                onClick={() => {
                  setSelectedSuggestions([])
                  setShowSuggestionsModal(false)
                }}
              >
                Cancel
              </button>
              <button
                className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400'
                onClick={handleAddSelectedSuggestions}
                disabled={
                  selectedSuggestions.length === 0 ||
                  createMiniExerciseMutation.isPending
                }
              >
                {createMiniExerciseMutation.isPending
                  ? 'Adding...'
                  : `Add Selected (${selectedSuggestions.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Tiers Modal */}
      {showTiersModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
          <div className='min-w-[400px] rounded bg-white p-6 text-black shadow-lg'>
            <h3 className='mb-4 text-lg font-semibold'>Muscle Group Tiers</h3>
            <div className='mb-6 rounded bg-blue-50 p-4 text-sm text-blue-800'>
              <p className='mb-2 font-medium'>How suggestions work:</p>
              <ul className='space-y-1 text-xs'>
                <li>• Suggests 4-6 muscle groups for today&apos;s workout</li>
                <li>• Avoids any muscle groups trained yesterday</li>
                <li>
                  • Prioritizes higher tier muscles (Priority &gt; Mid-tier &gt;
                  Maintenance)
                </li>
                <li>• Favors muscles not trained in 4-6+ days</li>
                <li>• Considers training frequency in the last 14 days</li>
              </ul>
            </div>
            <div className='space-y-4'>
              <div>
                <div className='mb-2 flex items-center gap-2'>
                  <span className='rounded bg-green-100 px-2 py-1 text-xs text-green-800'>
                    Priority
                  </span>
                  <span className='text-sm font-medium'>Tier 1</span>
                </div>
                <div className='text-sm text-gray-600'>
                  {muscleTiers.tier1.join(', ')}
                </div>
              </div>
              <div>
                <div className='mb-2 flex items-center gap-2'>
                  <span className='rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800'>
                    Mid-tier
                  </span>
                  <span className='text-sm font-medium'>Tier 2</span>
                </div>
                <div className='text-sm text-gray-600'>
                  {muscleTiers.tier2.join(', ')}
                </div>
              </div>
              <div>
                <div className='mb-2 flex items-center gap-2'>
                  <span className='rounded bg-gray-100 px-2 py-1 text-xs text-gray-800'>
                    Maintenance
                  </span>
                  <span className='text-sm font-medium'>Tier 3</span>
                </div>
                <div className='text-sm text-gray-600'>
                  {muscleTiers.tier3.join(', ')}
                </div>
              </div>
            </div>
            <div className='mt-6 flex justify-end'>
              <button
                className='rounded bg-gray-200 px-4 py-2'
                onClick={() => setShowTiersModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Clear Today Modal */}
      {showClearTodayModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
          <div className='min-w-[300px] rounded bg-white p-6 text-black shadow-lg'>
            <h3 className='mb-4 text-lg font-semibold'>
              Clear Today&apos;s Exercises
            </h3>
            <p className='mb-4 text-sm text-gray-600'>
              Are you sure you want to delete all exercises for {currentDate}?
              This action cannot be undone.
            </p>
            <div className='flex justify-end gap-2'>
              <button
                className='rounded bg-gray-200 px-4 py-2'
                onClick={() => setShowClearTodayModal(false)}
              >
                Cancel
              </button>
              <button
                className='rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700'
                onClick={handleClearTodayExercises}
                disabled={deleteMiniExerciseMutation.isPending}
              >
                {deleteMiniExerciseMutation.isPending
                  ? 'Clearing...'
                  : 'Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
