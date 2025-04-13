import { View } from 'react-native'

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <View className='h-full px-4 py-2'>{children}</View>
}
