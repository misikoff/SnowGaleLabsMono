import Bento from '@/components/Bento'
import GlobeBall from '@/components/GlobeBall'
import { IconLink } from '@/components/IconLink'
import IntensityWidget from '@/components/IntensityWidget'
import { Intro } from '@/components/Intro'
import OfflineWidget from '@/components/OfflineWidget'
import PixelGridCanvas from '@/components/PixelCanvas'
import RestWidget from '@/components/RestWidget'
import { SignUpForm } from '@/components/SignUpForm'

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
          {/* <h3 className='text-lg font-bold text-blue-400'>
            Strength Operations
          </h3> */}
          {/* <div className='relative h-32 w-32'>
            <PixelGridCanvas />
          </div> */}
          <div className='max-w-lg'>
            <p>
              Most fitness apps push you to do more—more weight, more volume,
              more grind—without asking the one question that matters:{' '}
              <em>is it working?</em> They flood you with numbers, but blur the
              signal. They{"'"}re rigid when you need flexibility, vague when
              you need clarity.
            </p>
            <p>
              <br />
              <strong>
                <span className='text-blue-400'>Toron</span> changes that.
              </strong>
              <br />
            </p>
            <p>
              <br />
              Built for lifters who train with intent, Toron brings focus back
              to the fundamentals: effective reps, smart progression, and
              recovery that actually supports growth. It doesn{"'"}t push you to
              do more for its own sake—it helps you do what matters. No noise.
              No fluff. Just a clear path to strength that lasts.
            </p>
          </div>

          {/* <PixelGridCanvas className='h-64 w-64 bg-red-300' /> */}
        </div>
        {/* <div className='relative flex h-64 w-full flex-col items-center bg-slate-400'> */}
        {/* <div className='absolute right-0 overflow-hidden'> */}
        <div className='lg:w-1/2'>
          <GlobeBall className='' />
        </div>
      </section>
      <section className='relative flex w-full flex-col items-center justify-center bg-slate-300 p-8'>
        <div className='flex w-full flex-col items-center justify-center p-8'>
          <div className='mt-8 grid w-full grid-flow-dense grid-cols-1 grid-rows-[masonry] gap-6 sm:grid-cols-2'>
            <div>
              <Bento Widget={RestWidget}>
                <h4 className='text-center text-lg font-semibold'>
                  Flexible Rest Day Scheduling
                </h4>
                <p className='mt-2 text-sm text-gray-600'>
                  You decide how to handle rest days and your schedule. With
                  dynamic rest days your program shifts to accomodate rest days
                  that you take. <br />
                  <br />
                  With scheduled rest days, you can plan your rest days in
                  advance. If an unplanned rest day is needed it can take the
                  place of a training session or push it back. Rigid or
                  flexible, it{"'"}s up to you.
                </p>
              </Bento>
            </div>

            <div>
              <Bento Widget={OfflineWidget}>
                <h4 className='text-center text-lg font-semibold'>
                  Offline Logging
                </h4>
                <p className='mt-2 mb-4 text-sm text-gray-600'>
                  Training doesn{"'"}t wait on your connection. Toron keeps your
                  log intact when the signal drops and syncs it when you{"'"}re
                  back. No warnings, no interruptions—just the work, recorded.
                </p>
              </Bento>
            </div>

            <div>
              <Bento Widget={IntensityWidget}>
                <h4 className='text-center text-lg font-semibold'>
                  Measuring Intensity
                </h4>
                <p className='mt-2 text-sm text-gray-600'>
                  Reps in Reserve (<span className='font-bold'>RIR</span>)
                  allows you to track and plan intensity in line with your
                  current capacity. Toron{"'"}s RIR tracking is simple and
                  intuitive, so you can focus on the current set, not
                  percentages and estimated maxes.
                </p>
              </Bento>
            </div>
          </div>
        </div>
        <div className='absolute right-0 -bottom-12 left-0 h-12 w-full rounded-b-3xl bg-slate-300' />
      </section>
      <section className='mt-6 flex w-full flex-col items-center justify-center bg-black p-8'>
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
      <section className='my-8'>
        <div
          className='relative -mx-6 bg-gray-50 sm:mx-0 sm:rounded-2xl'
          style={{
            backgroundImage:
              'radial-gradient(88% 100% at top, white, rgb(255 255 255 / 0))',
            boxShadow:
              '0 10px 32px rgb(34 42 53 / 0.12), 0 1px 1px rgb(0 0 0 / 0.05), 0 0 0 1px rgb(34 42 53 / 0.05), 0 4px 6px rgb(34 42 53 / 0.08), 0 24px 108px rgb(47 48 55 / 0.10)',
          }}
        >
          <div className='relative px-6 pt-20 pb-14 sm:px-10 sm:pb-20 lg:px-[4.5rem]'>
            <p className='max-w-80 text-3xl font-semibold tracking-[-0.015em] text-balance text-gray-950'>
              <span>Start now, no&nbsp;strings attached</span>
            </p>
            <p className='mt-4 max-w-[26rem] text-base/6 text-gray-600'>
              Integrate complete user management in minutes.
              <strong className='font-medium lg:text-gray-950'>Free</strong> for
              your first 10,000 monthly active users and 100 monthly active
              orgs. No credit card required.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
