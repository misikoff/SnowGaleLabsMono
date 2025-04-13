import { Slot } from 'expo-router'

import BaseLayout from '@/components/baseLayout'

export default function PlanLayout() {
  return (
    <BaseLayout>
      <Slot />
    </BaseLayout>
  )
}
