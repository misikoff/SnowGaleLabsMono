import { Slot } from 'expo-router'

import BaseLayout from '@/components/baseLayout'

export default function ProfileLayout() {
  return (
    <BaseLayout>
      <Slot />
    </BaseLayout>
  )
}
