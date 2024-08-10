import TestButton from './user-tester'

export default async function Home() {
  return (
    <div className='flex flex-col w-full items-center'>
      <div>Centurion</div>
      <div>Open Source Exercise</div>
      <TestButton />
    </div>
  )
}
