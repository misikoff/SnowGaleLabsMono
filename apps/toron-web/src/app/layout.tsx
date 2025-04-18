import { type Metadata } from 'next'
import clsx from 'clsx'

import { Providers } from '@/app/providers'
import '@/styles/tailwind.css'
import Footer from '@/components/Footer'
import Navbar from '@/components/Nabvar'

export const metadata: Metadata = {
  title: 'Toron - Progressive Overload for Muscle & Strength',
  description:
    'Commit is a lightweight Git client you can open from anywhere any time you’re ready to commit your work with a single keyboard shortcut. It’s fast, beautiful, and completely unnecessary.',
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang='en'
      className={clsx('h-full antialiased')}
      suppressHydrationWarning
    >
      <Providers>
        <body className='flex min-h-full flex-col bg-white'>
          <Navbar className='sticky top-0 z-50 shadow-md' />
          <main className='flex-1'>{children}</main>
          <Footer />
        </body>
      </Providers>
    </html>
  )
}
