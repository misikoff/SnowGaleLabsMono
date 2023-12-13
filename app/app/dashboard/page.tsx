import Link from 'next/link'
// import { neon } from '@neondatabase/serverless'
import clsx from 'clsx'
import { ChevronLeft, ChevronRight, InfoIcon } from 'lucide-react'

import InfoPopoverProgram from './infoPopoverProgram'
import InfoPopoverReadiness from './infoPopoverReadiness'
import ProgramChart from './programChart'
import ReadinessChart from './readinessChart'

const workouts = [
  {
    id: 1,
    slug: 'wow',
    name: 'Workout 1',
    scheduledDate: '2021-01-01',
    completed: true,
  },
  {
    id: 2,
    slug: 'wow2',
    name: 'Workout 2',
    scheduledDate: '2021-01-02',
    completed: false,
  },
  {
    id: 3,
    slug: 'wow2',
    name: 'Workout 2',
    scheduledDate: '2021-01-02',
    completed: false,
  },
  {
    id: 4,
    slug: 'wow2',
    name: 'Workout 2',
    scheduledDate: '2021-01-02',
    completed: false,
  },
  {
    id: 5,
    slug: 'wow2',
    name: 'Workout 2',
    scheduledDate: '2021-01-02',
    completed: false,
  },
]
// async function getData() {
//   const sql = neon(process.env.DATABASE_URL!)

//   const response = await sql`SELECT * FROM playing_with_neon;`
//   console.log(response)
//   return response
// }

export default function Home() {
  // const data = await getData()
  // console.log({ woo: data })

  return (
    <div>
      <div className='bg-blue-200 bg-opacity-30 py-4'>
        <div className='relative flex items-center gap-2 mx-3'>
          Readiness
          <div className='absolute top-0 left-0 mt-6 font-extrabold text-black text-3xl'>
            19.20
          </div>
          <InfoPopoverReadiness>
            <InfoIcon className='w-6 h-6 text-gray-400' />
          </InfoPopoverReadiness>
        </div>
        <ReadinessChart />
      </div>
      <div className='bg-red-300 p-4'>
        <div className='flex justify-between w-full'>
          <div className='flex items-center gap-2'>
            My Program
            <InfoPopoverProgram>
              <InfoIcon className='w-6 h-6 text-gray-400' />
            </InfoPopoverProgram>
          </div>
          <Link
            href='/dashboard/program'
            className='text-sm inline-flex items-center'
          >
            Review program
            <ChevronRight />
          </Link>
        </div>
        <ProgramChart />
        <div className='flex justify-between items-center'>
          <div>
            <div>Hypertrophy</div>
            <div>July 31st</div>
          </div>
          <div className='inline-flex'>
            <ChevronLeft />
            <ChevronRight />
          </div>
        </div>
        <div className='text-2xl'>Week 2</div>
        <div className='flex flex-col items-center'>
          {workouts.map((workout) => (
            <Link
              key={workout.id}
              href={`/workout/{workout.id}/preview`}
              className={clsx(
                'group-hover:text-gray-700 w-full flex justify-between  text-xl items-center transition-colors duration-150',
                workout.completed ? 'text-gray-600' : 'text-gray-800',
              )}
            >
              <div>{workout.name}</div>
              <ChevronRight />
            </Link>
          ))}
          <div>Complete Week</div>
        </div>
      </div>
    </div>
  )
}
