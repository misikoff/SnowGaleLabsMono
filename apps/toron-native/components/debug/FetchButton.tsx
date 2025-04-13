import { Button } from 'react-native'

export default function DebugFetchButton({
  testXMLHttpRequest,
}: {
  testXMLHttpRequest?: boolean
}) {
  return (
    <Button
      title='Test Fetch'
      onPress={() => {
        if (testXMLHttpRequest) {
          const xhr = new XMLHttpRequest()
          xhr.open('GET', 'https://example.com')
          xhr.onload = () => console.log('XHR success', xhr.responseText)
          xhr.onerror = () => console.log('XHR error')
          xhr.send()
        }

        fetch('https://google.com')
          .then((res) => {
            // console.log('✅ auto Fetch working')
            // log that it's working and include a timestamp
            console.log(
              '✅ Fetch working',
              new Date().toLocaleString('en-US', {
                timeZone: 'America/Chicago',
                timeZoneName: 'short',
              }),
            )
          })
          .catch((err) => {
            // console.log('❌ auto Fetch failed', err)
            // log that it's failing and include a timestamp
            console.log(
              '❌ Fetch failed',
              new Date().toLocaleString('en-US', {
                timeZone: 'America/Chicago',
                timeZoneName: 'short',
              }),
            )
          })
      }}
    />
  )
}
