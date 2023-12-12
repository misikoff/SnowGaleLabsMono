import Link from 'next/link'
// import { neon } from '@neondatabase/serverless'
import clsx from 'clsx'
import { ChevronLeft, ChevronRight, InfoIcon } from 'lucide-react'

import InfoPopoverProgram from './infoPopoverProgram'
import ProgramChart from '../programChart'

export default function Home() {
  return (
    <div>
      <div className='flex items-center gap-2'>
        Your Program
        <InfoPopoverProgram>
          <InfoIcon className='w-6 h-6 text-gray-400' />
        </InfoPopoverProgram>
      </div>
      <div>Cycle Overview</div>
      <div className='p-2 bg-gray-600 rounded-md'>
        <div>X Days Out</div>
        <div>Saturday, Blah, Blah</div>
        <ProgramChart />
      </div>
    </div>
  )
}
