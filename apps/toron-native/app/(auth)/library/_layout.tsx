import { Slot } from 'expo-router'

import BaseLayout from '@/components/baseLayout'

export default function LibraryLayout() {
  return (
    <BaseLayout>
      <Slot />
    </BaseLayout>
  )
}
