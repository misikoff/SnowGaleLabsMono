export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col gap-4 m-4'>
      <span className='text-2xl font-bold'>Builder</span>
      {children}
    </div>
  )
}
