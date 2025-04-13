import { Slot } from 'expo-router'

import BaseLayout from '@/components/baseLayout'

export default function SessionLayout() {
  return (
    <BaseLayout>
      <Slot />
    </BaseLayout>
  )
}
