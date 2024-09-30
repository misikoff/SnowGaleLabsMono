'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  // SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

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

export default function InfoPopoverProgram({ children }: { children: any }) {
  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent side='bottom' className='max-h-screen overflow-scroll'>
        <SheetHeader>
          <SheetTitle>Program</SheetTitle>
          {/* <SheetDescription>
          This action cannot be undone. This will permanently
          delete your account and remove your data from our
          servers.
        </SheetDescription> */}
        </SheetHeader>
        <div>Overview</div>
        <p>
          Welcome to your JuggernautAl program! We cannot wait to help you reach
          your full potential and become stronger than ever.
          <br />
          Below {"you'll"} find out most common terms used throughout the app
          what what they mean
        </p>
        <br />
        <div>Reading your graph</div>
        <p>
          Your macro-cycle graph displays the different phases of training
          throughout your program.
          <br />
          <br />
          The colored vertical bars indicate the level of volume (i.e. how much
          you will lift) you will have during each week. The dotted intensity
          line indicates the level of intensity (i.e. how heavy your weights
          will be) throughout the program.
          <br />
          <br />
          You can cycle between squat, bench and deadlift to see the effect the
          varying periodization styles have on your intensity for that specific
          lift.
        </p>
        <br />
        <div>X Days Out</div>
        <p>
          Days Out refers to how many days you away from your meet/test day.This
          is the day you test your true strength and perform a 1 rep max for
          your competition style Squat, Bench and Deadlift. The date of this can
          be found directly below your days out marker.
        </p>
        <br />
        <div>MRV</div>
        <p>
          Maximum Recoverable Volume is the most amount of training that you can
          effectively recover from. We refer to this as a specific number of
          sets and that number of sets will be unique to each phase of training.
        </p>
        <br />
        <div>MEV</div>
        <p>
          Minimum Effective Volume is the least amount of training that will
          produce a positive effect for you in muscle size or strength. We refer
          to this as a specific number of sets and that number of sets will be
          unique to each phase of training.
        </p>
        <br />
        <div>Frequency</div>
        <p>
          Frequency refers to how often you are training, this is both total
          training sessions (chosen by you) and overloading sessions for each of
          the primary lifts and their variations.
        </p>
        <br />
        <div>Periodization (Linear, Alternating, Undulating)</div>
        <p>
          Periodization is how your training is progressed over time, how does
          your intensity and volume change over time.
          <br />
          <br />
          Linear Periodization is a simple, week to week overload of
          volume/intensity, whichever is appropriate for your current phase.
          <br />
          <br />
          Alternating Periodization employs a bit more fatigue management by
          alternating weekly between overloading the Squat and Bench or the
          Deadlift.
          <br />
          <br />
          Undulating Periodization is our most intricate scheme that rotates
          between Low, Medium and High sessions for each of the primary lifts,
          allowing for the most recovery between overloading sessions which is
          necessary for more advanced lifters or those with reduced recovery
          capacity, like Masters aged athletes.
        </p>
        <SheetClose className='mt-4 w-full'>
          <Button className='justify-self-end w-full uppercase font-mono text-white bg-green-400'>
            Close
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  )
}
