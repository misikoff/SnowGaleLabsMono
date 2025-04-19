import GlobeBall from '@/components/GlobeBall'
import { IconLink } from '@/components/IconLink'
import { Intro } from '@/components/Intro'
import PixelGridCanvas from '@/components/PixelCanvas'
import RestBento from '@/components/RestBento'
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
          <div className='mt-8 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {/* Bento Box 1 */}
            <RestBento />

            {/* Bento Box 2 */}
            <div className='flex flex-col items-start justify-start rounded-lg bg-white p-6 shadow-md'>
              <h4 className='text-lg font-semibold'>Streamlined Tracking</h4>
              <p className='mt-2 text-sm text-gray-600'>
                Only track what matters. Toron focuses on the data that drives
                your training, so you can spend less time logging and stay
                focused on the work.
              </p>
            </div>

            {/* Bento Box 3 */}
            <div className='flex flex-col items-start justify-start rounded-lg bg-white p-6 shadow-md'>
              <h4 className='text-lg font-semibold'>Split Building</h4>
              <p className='mt-2 text-sm text-gray-600'>
                Quickly create and adjust your training split with Toron{"'"}s
                intuitive builder. Create your own routine or specify your
                priorities and let Toron do the rest.
              </p>
            </div>

            {/* Bento Box 4 */}
            <div className='flex flex-col items-start justify-start rounded-lg bg-white p-6 shadow-md'>
              <h4 className='text-lg font-semibold'>Bento Box 4</h4>
              <p className='mt-2 text-sm text-gray-600'>
                Add more bento boxes as needed to showcase additional features
                or content.
              </p>
            </div>

            {/* Bento Box 5 */}
            <div className='flex flex-col items-start justify-start rounded-lg bg-white p-6 shadow-md'>
              <h4 className='text-lg font-semibold'>Bento Box 5</h4>
              <p className='mt-2 text-sm text-gray-600'>
                Bento boxes can be used to organize content in a visually
                appealing way.
              </p>
            </div>

            {/* Bento Box 6 */}
            <div className='flex flex-col items-start justify-start rounded-lg bg-white p-6 shadow-md'>
              <h4 className='text-lg font-semibold'>Bento Box 6</h4>
              <p className='mt-2 text-sm text-gray-600'>
                Use Tailwind utilities to customize the layout and appearance of
                each box.
              </p>
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
