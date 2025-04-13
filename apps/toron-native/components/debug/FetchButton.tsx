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
          .then((res) => console.log('✅ Fetch working'))
          .catch((err) => console.log('❌ Fetch failed', err))
      }}
    />
  )
}
