import Link from 'next/link'

import { Button } from '@/components/ui/button'

const links = [
  { href: '/builder/users', label: 'Users' },
  { href: '/builder/exercises', label: 'Exercises' },
  { href: '/builder/programs', label: 'Programs' },
  { href: '/builder/userExercises', label: 'User Exercises' },
]

export default function Home() {
  return (
    <div className='flex flex-col gap-4'>
      {links.map(({ href, label }) => (
        <Link key={href} href={href}>
          <Button>{label}</Button>
        </Link>
      ))}
    </div>
  )
}
