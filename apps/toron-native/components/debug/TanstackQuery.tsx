import { Button } from 'react-native'

import queryClient from '@/lib/queryClient'

export default function DebugTanstackQueryButton() {
  return (
    <Button
      title='Check Tanstack Query'
      onPress={() => {
        const queries = queryClient.getQueryCache().getAll()
        console.log('Queries:', queries)
        queries.forEach((query) => {
          console.log('Query Key:', query.queryKey)
          console.log('Status:', query.state.status)
          // console.log('Is fetching:', query.isFetching())
          // console.log('Is paused:', query.state.isPaused)
          console.log('Failure count:', query.state.fetchFailureCount)
          console.log('Stale time:', query.state.dataUpdatedAt)
          console.log('Last fetch:', query.state.fetchMeta)
          console.log('-------------------------')
        })
      }}
    />
  )
}
