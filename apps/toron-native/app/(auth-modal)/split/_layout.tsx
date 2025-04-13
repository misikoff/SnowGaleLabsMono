import { Slot } from 'expo-router'

import BaseLayout from '@/components/baseLayout'

export default function SplitLayout() {
  return (
    <BaseLayout>
      <Slot />
    </BaseLayout>
  )
}
