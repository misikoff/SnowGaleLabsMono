import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { List, ListItem } from '@/components/List'
import { SectionIntro } from '@/components/SectionIntro'
import { StylizedImage } from '@/components/StylizedImage'
import { Testimonial } from '@/components/Testimonial'
import imageLaptop from '@/images/laptop.jpg'
import { type Project, type MDXEntry, loadProjects } from '@/lib/mdx'

// function Clients() {
//   return (
//     <div className="mt-24 rounded-4xl bg-neutral-950 py-20 sm:mt-32 sm:py-32 lg:mt-56">
//       <Container>
//         <FadeIn className="flex items-center gap-x-8">
//           <h2 className="text-center font-display text-sm font-semibold tracking-wider text-white sm:text-left">
//             We’ve worked with hundreds of amazing people
//           </h2>
//           <div className="h-px flex-auto bg-neutral-800" />
//         </FadeIn>
//         <FadeInStagger faster>
//           <ul
//             role="list"
//             className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4"
//           >
//             {clients.map(([client, logo]) => (
//               <li key={client}>
//                 <FadeIn>
//                   <Image src={logo} alt={client} unoptimized />
//                 </FadeIn>
//               </li>
//             ))}
//           </ul>
//         </FadeInStagger>
//       </Container>
//     </div>
//   )
// }

function Projects({ projects }: { projects: Array<MDXEntry<Project>> }) {
  return (
    <>
      <SectionIntro
        title='Introducing Toron — A New Standard in Workout Tracking
'
        className='mt-24 sm:mt-32 lg:mt-40'
      >
        <p>
          At Snow Gale Labs, we believe tracking your workouts should be
          effortless, insightful, and free from distractions. Toron is our
          answer—a sleek, Greco-futuristic workout tracker designed for those
          who train with purpose. Focused on hypertrophy, progressive overload,
          and effective set tracking, Toron provides a clean, no-nonsense
          experience without the clutter of social feeds or gimmicks. Stay in
          control of your training, visualize your progress with smart muscle
          heatmaps, and refine your approach with clear, actionable insights.
        </p>
      </SectionIntro>
      <Container className='mt-16'>
        <FadeInStagger className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {projects.map((project) => (
            <FadeIn key={project.href} className='flex'>
              <article className='relative flex w-full flex-col rounded-3xl p-6 ring-1 ring-neutral-950/5 transition hover:bg-neutral-50 sm:p-8'>
                <h3>
                  <Link href={project.href}>
                    <span className='absolute inset-0 rounded-3xl' />
                    <Image
                      src={project.logo}
                      alt={project.client}
                      className='h-16 w-16'
                      unoptimized
                    />
                  </Link>
                </h3>
                <p className='mt-6 flex gap-x-2 text-sm text-neutral-950'>
                  <time
                    dateTime={project.date.split('-')[0]}
                    className='font-semibold'
                  >
                    {project.date.split('-')[0]}
                  </time>
                  <span className='text-neutral-300' aria-hidden='true'>
                    /
                  </span>
                  <span>Project</span>
                </p>
                <p className='mt-6 font-display text-2xl font-semibold text-neutral-950'>
                  {project.title}
                </p>
                <p className='mt-4 text-base text-neutral-600'>
                  {project.description}
                </p>
              </article>
            </FadeIn>
          ))}
        </FadeInStagger>
      </Container>
    </>
  )
}

function Services() {
  return (
    <>
      <SectionIntro
        eyebrow='Lorem Ipsum'
        title='We help you identify, explore and respond to new opportunities.'
        className='mt-24 sm:mt-32 lg:mt-40'
      >
        <p>
          Lorem ipsum odor amet, consectetuer adipiscing elit. Nunc aenean
          elementum phasellus orci volutpat eget nibh proin nunc.
        </p>
      </SectionIntro>
      <Container className='mt-16'>
        <div className='lg:flex lg:items-center lg:justify-end'>
          <div className='flex justify-center lg:w-1/2 lg:justify-end lg:pr-12'>
            <FadeIn className='w-[33.75rem] flex-none lg:w-[45rem]'>
              <StylizedImage
                src={imageLaptop}
                sizes='(min-width: 1024px) 41rem, 31rem'
                className='justify-center lg:justify-end'
              />
            </FadeIn>
          </div>
          <List className='mt-16 lg:mt-0 lg:w-1/2 lg:min-w-[33rem] lg:pl-4'>
            <ListItem title='Web development'>
              Lorem ipsum odor amet, consectetuer adipiscing elit. Nunc aenean
              elementum phasellus orci volutpat eget nibh proin nunc.
            </ListItem>
            <ListItem title='Application development'>
              Lorem ipsum odor amet, consectetuer adipiscing elit. Nunc aenean
              elementum phasellus orci volutpat eget nibh proin nunc.
            </ListItem>
            <ListItem title='E-commerce'>
              Lorem ipsum odor amet, consectetuer adipiscing elit. Nunc aenean
              elementum phasellus orci volutpat eget nibh proin nunc.
            </ListItem>
            <ListItem title='Custom content management'>
              Lorem ipsum odor amet, consectetuer adipiscing elit. Nunc aenean
              elementum phasellus orci volutpat eget nibh proin nunc.
            </ListItem>
          </List>
        </div>
      </Container>
    </>
  )
}

export const metadata: Metadata = {
  description:
    'We are a development studio working at the intersection of design and technology.',
}

export default async function Home() {
  const projects = (await loadProjects()).slice(0, 3)

  return (
    <>
      <Container className='mt-24 sm:mt-32 md:mt-56'>
        <FadeIn className='max-w-3xl'>
          <h1 className='font-display text-5xl font-medium tracking-tight [text-wrap:balance] text-neutral-950 sm:text-7xl'>
            Revealing the Signal in the Storm
          </h1>
          <p className='mt-6 text-xl text-neutral-600'>
            The world is full of noise -- numbers piling up, charts without
            meaning, data with no direction. We build tools that cut through the
            chaos, shaping raw information into something clear, sharp, and
            useful. No fluff, no wasted motion -- just the right insights, at
            the right time, in the right way.
          </p>
        </FadeIn>
      </Container>

      {/* <Clients /> */}

      <Projects projects={projects} />

      {/* <Testimonial
        className="mt-24 sm:mt-32 lg:mt-40"
        client={{ name: 'Phobia', logo: logoPhobiaDark }}
      >
        Lorem ipsum odor amet, consectetuer adipiscing elit. Nunc aenean
        elementum phasellus orci volutpat eget nibh proin nunc.
      </Testimonial> */}

      {/* <Services /> */}

      {/* <ContactSection /> */}
    </>
  )
}
