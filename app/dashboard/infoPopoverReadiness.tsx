'use client'

import { Button } from 'components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  // SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from 'components/ui/sheet'

const exercise = {
  name: 'Squat',
  description:
    'squat down and then stand up squat down and then stand up squat down and then stand up squat down and then stand up',
  unilateral: false,
  parts: ['quads', 'hamstrings', 'glutes'],
  notes: '',
  weightIncrement: 5,
  equipment: 'barbell',
  topSets: [
    {
      weight: 100,
      reps: 5,
      difficulty: 5,
      date: '12-20-2025',
    },
    {
      weight: 200,
      reps: 2,
      difficulty: 9.5,
      date: '12-20-2025',
    },
  ],
}

export default function InfoPopoverReadiness({ children }: { children: any }) {
  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent side='bottom' className='max-h-screen overflow-scroll'>
        <SheetHeader>
          <SheetTitle>Readiness</SheetTitle>
          {/* <SheetDescription>
          This action cannot be undone. This will permanently
          delete your account and remove your data from our
          servers.
        </SheetDescription> */}
        </SheetHeader>
        Your Readiness Rating is one of the most integral components to
        customizing your program.
        <br /> <br />
        The Readiness Rating is based on research and development of a
        proprietary algorithm that takes into account your sleep, motivation,
        soreness, performance and more to help adjust your program at many
        levels including pre-training, intra-training, session to session, week
        to week, block to block and program to program.
        <br /> <br />
        It is critical that you are as forthright as possible when answering
        each questionnaire to help ensure that these ratings are as reflective
        as possible of you.
        <br /> <br />
        <div>Scores</div>
        <br />
        <br />
        <ul>
          <li>Scores range from around 0 to ~30</li>
          <li>
            If you{"'"}re consistently higher than 20 but feeling fatigued or
            lower than 12 and feeling great then you may not be honestly
            reporting your readiness questionnaire, RPEs, or end of session
            score
          </li>
          <li>
            If you{"'"}re consistently at or lower than 15 then consider
            strategies to improve recovery
          </li>
          <li>
            If you{"'"}re consistently at or higher than 20 after your second
            block (i.e. the system has recalibrated your full lifter profile)
            then review your RPEs ratings and maxes as they may be too light. If
            you simply want easier workouts then stay as you are.
          </li>
          <li>
            If you{"'"}re below 10 you are likely heavily fatigued and should
            consider taking a break from hard training. Switching to a bridge
            block is perfect for this.
          </li>
          <li>
            Your readiness decreasing through the weeks is expected but should
            return to around normal range towards the end of your deload and
            probably the first few days of your new block
          </li>
        </ul>
        <SheetClose className='mt-4 w-full'>
          <Button className='justify-self-end w-full uppercase font-mono text-white bg-green-400'>
            Close
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  )
}
