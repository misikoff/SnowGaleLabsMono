import { ReactElement, useState } from 'react'

import Link from 'next/link'
import {
  InfoIcon,
  MinusIcon,
  PenIcon,
  PencilIcon,
  ArrowRightLeftIcon,
  PlusIcon,
  ArrowRightIcon,
} from 'lucide-react'

import { Button } from 'components/ui/button'
import { Label } from 'components/ui/label'
import { RadioGroup, RadioGroupItem } from 'components/ui/radio-group'

const user = {
  preferredUnits: 'lbs',
}

type question = {
  text: string
  response: number
  responseDescription: string[]
}

const generalQuestions: question[] = [
  {
    text: 'How did you sleep last night?',
    response: 3,
    responseDescription: ['blah', 'blah2', 'blah3', 'blah4', 'blah5'],
  },
  {
    text: 'How would you characterize your mood/motivation to train?',
    response: 3,
    responseDescription: ['blah', 'blah2', 'blah3', 'blah4', 'blah5'],
  },
  {
    text: 'How would you rate your diet in the last 24 hours?',
    response: 3,
    responseDescription: ['blah', 'blah2', 'blah3', 'blah4', 'blah5'],
  },
  {
    text: 'Do you feel strong and well recovered today?',
    response: 3,
    responseDescription: ['blah', 'blah2', 'blah3', 'blah4', 'blah5'],
  },
]

const bodyQuestions: question[] = [
  {
    text: 'Pecs / Shoulders / Triceps',
    response: 3,
    responseDescription: [
      'Feeling tired and not very strong',
      'Feeling a little tired/weak',
      'Feeling normal',
      'Feeling good, no tiredness or weakness',
      'Feeling great and ready to do extra work!',
    ],
  },
]

const workout = {
  name: 'Workout 1',
  id: '1',
  exercises: [
    {
      name: 'Squat',
      notes: '',
      weightIncrement: 5,
      equipment: 'barbell',
      unilateral: false,
      parts: ['quads', 'hamstrings', 'glutes'],
      sets: [
        {
          prescribedRepsLow: null,
          prescribedRepsHigh: null,
          prescribedWeightLow: 100,
          prescribedWeightHigh: 100,
          prescribedDifficultyLow: null,
          prescribedDifficultyHigh: null,
          style: 'myoreps',
          weight: 0,
          reps: 0,
          notes: '',
        },
        {
          prescribedRepsLow: 5,
          prescribedRepsHigh: 5,
          prescribedWeightLow: null,
          prescribedWeightHigh: null,
          prescribedDifficultyLow: null,
          prescribedDifficultyHigh: null,
          style: 'myoreps',
          weight: 0,
          reps: 0,
          notes: '',
        },
        {
          prescribedRepsLow: null,
          prescribedRepsHigh: null,
          prescribedWeightLow: null,
          prescribedWeightHigh: null,
          prescribedDifficultyLow: '8',
          prescribedDifficultyHigh: '8',
          style: 'myoreps',
          weight: 0,
          reps: 0,
          notes: '',
        },
        {
          prescribedRepsLow: null,
          prescribedRepsHigh: null,
          prescribedWeightLow: null,
          prescribedWeightHigh: null,
          prescribedDifficultyLow: 5,
          prescribedDifficultyHigh: 5,
          style: 'myoreps',
          weight: 0,
          reps: 0,
          notes: '',
        },
      ],
    },
    {
      name: 'bench',
      notes: '',
      weightIncrement: 5,
      equipment: 'barbell',
      unilateral: false,
      parts: ['chest', 'triceps', 'shoulders'],
      sets: [
        {
          prescribedRepsLow: null,
          prescribedRepsHigh: null,
          prescribedWeightLow: 100,
          prescribedWeightHigh: 100,
          prescribedDifficultyLow: null,
          prescribedDifficultyHigh: null,
          style: 'myoreps',
          weight: 0,
          reps: 0,
          notes: '',
        },
      ],
    },
  ],
}

export default function Home() {
  return (
    <div>
      <div>{workout.name}</div>

      <div className='flex flex-col gap-y-4'>
        {generalQuestions.map((question) => (
          <div key='s'>
            <div>{question.text}</div>
            <RadioGroup defaultValue='3'>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className='flex items-center space-x-2'>
                  <RadioGroupItem value={i + ''} id={i + ''} />
                  <Label htmlFor={i + ''}>{i}</Label>
                </div>
              ))}
            </RadioGroup>
            <div>{question.responseDescription[3]}</div>
          </div>
        ))}
      </div>
      <Link
        href={`/app/workout/${workout.id}`}
        className='flex gap-3 bg-green-400 rounded-md'
      >
        Start Workout <ArrowRightIcon />
      </Link>
    </div>
  )
}
