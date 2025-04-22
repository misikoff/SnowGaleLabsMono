import Bento from '@/components/Bento'
import GlobeBall from '@/components/GlobeBall'
import { IconLink } from '@/components/IconLink'
import { Intro } from '@/components/Intro'
import OfflineWidget from '@/components/OfflineWidget'
import PixelGridCanvas from '@/components/PixelCanvas'
import RestWidget from '@/components/RestWidget'

export default function Home() {
  return (
    <div className='relative flex w-full flex-col items-center text-slate-800'>
      <section className='flex w-full flex-col items-center justify-center bg-gray-100 p-8 shadow-2xl'>
        <div>
          {/* <Link href='/'> */}
          {/* <Logo className="inline-block h-8 w-auto" /> */}
          {/* </Link> */}
        </div>
        <div className='flex flex-col items-center justify-center text-center'>
          {/* lg:items-start lg:text-left */}
          {/* <h1 className='mt-14 font-display text-4xl/tight font-light text-white'>
            Toron - Lift Log
            <br />
            <span className='text-sky-300'>for Muscle & Strength</span>
          </h1>
          <p className='mt-4 max-w-lg text-sm/6 text-gray-300'>
            Toron is a focused, distraction-free workout tracker designed for
            those who train with intent. Log your workouts effortlessly, track
            muscle stimulus over time, and ensure your training aligns with your
            goals. No fluff, no social feeds—just powerful insights to help you
            progress.
          </p> */}
          <div className='font-display flex flex-col items-center justify-center gap-3 text-5xl text-slate-800 lg:items-start lg:text-left'>
            <div>
              Training, <strong>Refined</strong>.
            </div>
            <div>
              Effort, <strong>Demanded</strong>.
            </div>
          </div>
          <div className='mt-4 max-w-lg text-lg/6 text-slate-800'>
            Track progressive overload, build muscle, and log workouts — nothing
            extra, just logistics.
          </div>
          {/* <span className='text-blue-400'>Toron</span> */}
        </div>
      </section>
      <section className='flex w-full flex-row'>
        <div className='max-w-1/2 min-w-1/2 p-4 lg:mx-6 lg:w-1/2'>
          <h3 className='text-lg font-bold text-blue-400'>
            Strength Operations
          </h3>
          {/* <div className='relative h-32 w-32'>
            <PixelGridCanvas />
          </div> */}
          <div>
            Lifting is simple. But simple isn{"'"}t easy.
            <br />
            You train. You recover. You return. But beneath that rhythm are
            choices — how to progress, when to hold back, what to repeat, and
            what to leave behind.
            <br />
            Most tools don{"'"}t help with that. They{"'"}re too strict in the
            wrong places, and too vague in the ones that matter.
            <br />
            They lock you into brittle plans, but vanish when real decisions
            appear. They bury you in data, yet hide the signal.
            <br />
            The fundamentals haven{"'"}t changed. But the tools have forgotten
            them.
            <br />
            What you need is clarity. A way to train with purpose, not noise.
            <br />
          </div>
          {/* <PixelGridCanvas className='h-64 w-64 bg-red-300' /> */}
        </div>
        {/* <div className='relative flex h-64 w-full flex-col items-center bg-slate-400'> */}
        {/* <div className='absolute right-0 overflow-hidden'> */}
        <div className='lg:w-1/2'>
          <GlobeBall className='' />
        </div>
      </section>
      <section className='flex w-full flex-col items-center justify-center p-8'>
        <div className='flex w-full flex-col items-center justify-center p-8'>
          <h3>I am where the bento boxes go</h3>
          <div className='mt-8 grid w-full grid-flow-dense grid-cols-1 grid-rows-[masonry] gap-6 sm:grid-cols-2'>
            <div>
              <Bento Widget={RestWidget}>
                <h4 className='text-center text-lg font-semibold'>
                  Dynamic or Scheduled Rest Days
                </h4>
                <p className='mt-2 mb-8 text-sm text-gray-600'>
                  Rest when you need it, not when you don{"'"}t. Toron
                  {"'"}s calendar is flexible, so small deviations don{"'"}t
                  derail your progress.
                </p>
              </Bento>
            </div>

            <div>
              <Bento Widget={OfflineWidget}>
                <h4 className='text-center text-lg font-semibold'>
                  Offline Logging
                </h4>
                <p className='mt-2 mb-8 text-sm text-gray-600'>
                  Training doesn{"'"}t wait on Wi-Fi. Toron keeps your log
                  intact when the signal drops and syncs it when you{"'"}re
                  back. No warnings, no interruptions—just the work, recorded.
                </p>
              </Bento>
            </div>
          </div>
        </div>
      </section>
      <section className='flex w-full flex-col items-center justify-center bg-black p-8'>
        <div className='flex w-full flex-col items-center justify-center bg-black p-8'>
          <div className='flex flex-col items-center justify-center text-center lg:items-start lg:text-left'>
            <h2 className='font-display mt-14 text-4xl/tight font-light text-white'>
              Join the Movement
            </h2>
            <p className='mt-4 max-w-lg text-sm/6 text-gray-300'>
              Sign up for early access and be part of the Toron community. Your
              feedback will shape the future of training.
            </p>
          </div>
        </div>
        {/* <Intro /> */}
      </section>
    </div>
  )
}
