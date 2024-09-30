'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'
import clsx from 'clsx'
import { ChevronLeft, ChevronRight, InfoIcon } from 'lucide-react'

import { Session } from '@repo/db/schema'

import InfoPopoverProgram from './infoPopoverProgram'
import InfoPopoverReadiness from './infoPopoverReadiness'
import ProgramChart from './programChart'
import ReadinessChart from './readinessChart'
import { getSessionsForProgram } from '../actions'

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    async function fetchData() {
      const sessions = await getSessionsForProgram('1')
      setSessions(sessions)
    }
    fetchData()
  }, [])

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
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/app/session/${session.id}/preview`}
              className={clsx(
                'group-hover:text-gray-700 w-full flex justify-between  text-xl items-center transition-colors duration-150',
                // session.completed ? 'text-gray-600' : 'text-gray-800',
              )}
            >
              <div>{session.name}</div>
              <ChevronRight />
            </Link>
          ))}
          <div>Complete Week</div>
        </div>
      </div>
    </div>
  )
}
