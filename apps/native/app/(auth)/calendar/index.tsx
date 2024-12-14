import { useState } from 'react'

import {
  Dimensions,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import clsx from 'clsx'

function getSurroundingDays() {
  const today = new Date() // Get the current date
  const currentDay = today.getDate() // Get the day of the month

  // Create an array of the 3 days before, the current day, and 3 days after
  const surroundingDays = []
  for (let offset = -3; offset <= 3; offset++) {
    const date = new Date(today) // Clone the current date
    date.setDate(currentDay + offset) // Adjust the day
    surroundingDays.push(date.getDate())
  }

  return surroundingDays
}

export default function Calendar() {
  const DeviceSize = {
    width: Dimensions.get('window'),
    height: Dimensions.get('window').height,
  }
  const [curDay, setCurDay] = useState(4)
  const days = getSurroundingDays()

  const quotes: { quote: string; author: string }[] = [
    {
      quote: 'Not all who wander are lost',
      author: 'J.R.R. Tolkien',
    },
    {
      quote:
        '[Abstract art is] a product of the untalented, sold by the unprincipled to the utterly bewildered.',
      author: 'Al Capp',
    },
    {
      quote:
        'Talking with you is sort of the conversational equivalent of an out of body experience',
      author: 'Calvin & Hobbes',
    },
    {
      quote:
        'Hanging is too good for a man who makes puns; he should be drawn and quoted.',
      author: 'Fred Allen',
    },
    {
      quote: 'The more things change, the more they remain... insane.',
      author: 'Michael Fry and T. Lewis',
    },
    {
      quote: 'By the work one knows the workmen.',
      author: 'Jean de La Fontaine',
    },
    {
      quote: 'A lie told often enough becomes the truth.',
      author: 'Vladimir Lenin',
    },
  ]

  // match quotes to days
  const dates = days.map((day) => {
    const quote = quotes[day % quotes.length]
    return {
      day,
      quote: quote.quote,
      author: quote.author,
    }
  })

  return (
    <View className='flex-1 items-center'>
      <Text className='text-2xl font-bold'>
        {new Date().toLocaleString('en-US', { month: 'short' }) +
          " '" +
          new Date().getFullYear().toString().substring(2)}
      </Text>
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        className='flex-grow-0'
      >
        <View className='w-screen flex-row justify-between pt-4'>
          {dates.map((date) => (
            <TouchableOpacity
              key={date.day}
              className={clsx(
                'flex-grow border-b-2 pb-4',
                date.day === curDay ? 'border-blue-500' : 'border-gray-400',
              )}
              onPress={() => setCurDay(date.day)}
            >
              <View className='text-center'>
                <Text
                  className={clsx(
                    'mx-auto text-lg font-bold',
                    date.day === curDay && 'text-blue-500',
                  )}
                >
                  {date.day}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView
        className='bg-gray-500'
        horizontal={true}
        pagingEnabled={true}
        onMomentumScrollEnd={(event) => {
          console.log(
            'event.nativeEvent.contentOffset.x:',
            event.nativeEvent.contentOffset.x,
            DeviceSize.width,
          )
          const page =
            event.nativeEvent.contentOffset.x / DeviceSize.width.width
          console.log('page:', page)
          setCurDay(days[Math.floor(page)])
        }}
      >
        {dates.map((date) => (
          <View
            key={date.day}
            className='w-screen items-center justify-center bg-gray-300'
          >
            <View className='w-64 gap-2'>
              <Text className='text-center'>{date.quote}</Text>
              <Text className='text-center font-bold'>{date.author}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
