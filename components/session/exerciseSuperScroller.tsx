import React, { useRef, useState, useCallback, useEffect } from 'react'

import clsx from 'clsx'
import { InfoIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

import InfoPopoverExercise from './infoPopoverExercise'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function ExerciseSuperScroller({
  options,
  onSelect,
}: {
  // TODO: fix this type to allow for any object that has a name property
  options: ({ id: string; name: string | null } & {
    [key: string]: any
  })[]
  onSelect?: (id: string) => void
}) {
  const [newOptions, setNewOptions] = useState<any[]>([])

  useEffect(() => {
    setNewOptions(
      options
        .filter((option) => {
          return option.name !== null && option.name !== ''
        })
        .map((option) => {
          const newOpt = {
            ...option,
            letter: (option.name as string)[0].toUpperCase(),
          }
          return newOpt
        }),
    )
  }, [options])

  const [activeLetter, setActiveLetter] = useState('')
  const [filter, setFilter] = useState('')
  const [filteredExercises, setFilteredExercises] = useState(newOptions)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const letterIndexRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)

  const scrollToLetter = useCallback((letter: string) => {
    setActiveLetter(letter)
    const element = document.getElementById(letter)
    if (element && scrollAreaRef.current) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [])

  const handleLetterSelect = useCallback(
    (clientY: number) => {
      if (letterIndexRef.current) {
        const rect = letterIndexRef.current.getBoundingClientRect()
        const index = Math.floor(
          ((clientY - rect.top) / rect.height) * alphabet.length,
        )
        const letter =
          alphabet[Math.max(0, Math.min(index, alphabet.length - 1))]
        scrollToLetter(letter)
      }
    },
    [scrollToLetter],
  )

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    isDraggingRef.current = true
    handleLetterSelect(e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isDraggingRef.current) {
      handleLetterSelect(e.clientY)
    }
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true
    handleLetterSelect(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDraggingRef.current) {
      handleLetterSelect(e.touches[0].clientY)
    }
  }

  const handleTouchEnd = () => {
    isDraggingRef.current = false
  }

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchend', handleTouchEnd)
    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  useEffect(() => {
    const filtered = newOptions.filter((exercise) =>
      exercise.name.toLowerCase().includes(filter.toLowerCase()),
    )
    setFilteredExercises(filtered)
  }, [filter, newOptions])

  const availableLetters = Array.from(
    new Set(filteredExercises.map((exercise) => exercise.letter)),
  )

  return (
    <div className='flex flex-col w-full h-[400px] mx-auto border rounded-lg overflow-hidden bg-background'>
      <div className='p-2 border-b'>
        <Input
          type='text'
          placeholder='Search exercises...'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label='Search exercises'
          className='w-full text-lg'
        />
      </div>
      <div className='flex flex-1 overflow-hidden'>
        <ScrollArea className='flex-1' ref={scrollAreaRef}>
          <div className='pr-4'>
            {alphabet.map((letter) => {
              const exercisesForLetter = filteredExercises.filter(
                (exercise) => exercise.letter === letter,
              )
              if (exercisesForLetter.length === 0) return null
              return (
                <div key={letter} id={letter}>
                  <div className='sticky top-0 bg-background px-4 py-1 text-sm font-semibold'>
                    {letter}
                  </div>
                  {exercisesForLetter.map((exercise, index) => (
                    <div
                      key={index}
                      className='py-1 border-b last:border-b-0'
                      onClick={() => {
                        console.log(exercise)
                        setSelectedId(exercise.id)
                        onSelect && onSelect(exercise.id)
                      }}
                    >
                      <div
                        className={clsx(
                          'mx-3 px-2 py-1 my-1 flex justify-between items-center',
                          selectedId === exercise.id &&
                            'bg-blue-200 rounded-full',
                        )}
                      >
                        {exercise.name}

                        <InfoPopoverExercise exercise={exercise}>
                          <InfoIcon className='w-6 h-6 text-gray-400' />
                        </InfoPopoverExercise>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </ScrollArea>
        <div
          ref={letterIndexRef}
          className='flex flex-col justify-between py-1 px-0.5 bg-secondary select-none'
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          aria-label='Letter index'
          role='navigation'
        >
          {alphabet.map((letter) => (
            <button
              key={letter}
              className={`text-[10px] font-semibold leading-none ${
                activeLetter === letter
                  ? 'text-primary'
                  : 'text-muted-foreground'
              } ${availableLetters.includes(letter) ? 'opacity-100' : 'opacity-30'}`}
              onClick={() => scrollToLetter(letter)}
              aria-label={`Scroll to ${letter}`}
              disabled={!availableLetters.includes(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
