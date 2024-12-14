import { useRef, useState } from 'react'

import {
  Dimensions,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Button,
} from 'react-native'
import clsx from 'clsx'

// get 9 weeks centered around today
const getSortedChunks = () => {
  const today = new Date()
  const days: string[] = []

  // Collect 31 days before today, today, and 31 days after today
  for (let i = -31; i <= 31; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    // Adjust the date to match the local time zone
    date.setHours(0, 0, 0, 0) // Set the time to midnight to avoid time zone issues
    days.push(date.toISOString().split('T')[0]) // Format as YYYY-MM-DD
  }

  // Sort the dates and chunk into weeks of 7 days
  return Array.from(
    { length: 9 },
    (_, i) => days.slice(i * 7, i * 7 + 7), // Slice into 7-day chunks
  )
}

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

const weeks = getSortedChunks()
const days = getSurroundingDays()

export default function Calendar() {
  const scrollViewRef = useRef(null)
  const subScrollViewRef = useRef(null)
  const DeviceSize = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
  const [curWeek, setCurWeek] = useState(4)
  const [curDay, setCurDay] = useState(3)
  const [selectedDate, setSelectedDate] = useState(weeks[4][3])
  const [selectedWeek, setSelectedWeek] = useState(weeks[4])

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
  const dates = selectedWeek.map((day, i) => {
    const quote = quotes[i % quotes.length]
    return {
      day,
      quote: quote.quote,
      author: quote.author,
    }
  })

  return (
    <View className='flex-1 items-center'>
      <View className='w-full flex-row justify-between p-4'>
        <Text className='text-2xl font-bold'>
          {new Date(weeks[curWeek][3]).toLocaleString('en-US', {
            month: 'short',
          }) +
            " '" +
            new Date(weeks[curWeek][3]).getFullYear().toString().substring(2)}
        </Text>
        <Button
          title='Today'
          onPress={() => {
            setCurWeek(3)
            scrollViewRef.current?.scrollTo({
              x: DeviceSize.width * 4,
              animated: true,
            })
          }}
        />
      </View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        ref={scrollViewRef}
        onMomentumScrollEnd={(event) => {
          console.log(
            'event.nativeEvent.contentOffset.x:',
            event.nativeEvent.contentOffset.x,
            DeviceSize.width,
          )
          const page = event.nativeEvent.contentOffset.x / DeviceSize.width
          console.log('page:', page)
          setCurWeek(Math.floor(page))
        }}
        className='flex-grow-0'
      >
        {weeks.map((week, i) => (
          <View key={i} className='w-screen flex-row justify-between pt-4'>
            {week.map((date, d) => (
              <TouchableOpacity
                key={date}
                className={clsx(
                  'flex-grow border-b-2 pb-4',
                  date === selectedDate ? 'border-blue-500' : 'border-gray-400',
                )}
                onPress={() => {
                  setSelectedDate(date)
                  setSelectedWeek(week)
                  subScrollViewRef.current?.scrollTo({
                    x: DeviceSize.width * d,
                    animated: true,
                  })
                  // setCurDay(d)
                  setCurWeek(i)
                }}
              >
                <View className='text-center'>
                  <Text
                    className={clsx(
                      'mx-auto text-lg font-bold',
                      date === selectedDate && 'text-blue-500',
                    )}
                  >
                    {date.split('-')[2]}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      <ScrollView
        ref={subScrollViewRef}
        className='bg-gray-500'
        horizontal={true}
        pagingEnabled={true}
        onMomentumScrollEnd={(event) => {
          console.log(
            'event.nativeEvent.contentOffset.x:',
            event.nativeEvent.contentOffset.x,
            DeviceSize.width,
          )
          const page = event.nativeEvent.contentOffset.x / DeviceSize.width
          console.log('page:', page)
          // setCurDay(days[Math.floor(page)])
          setSelectedDate(dates[Math.floor(page)].day)
        }}
      >
        {dates.map((date) => (
          <View
            key={date.day}
            className='w-screen items-center justify-center bg-gray-300'
          >
            <View className='w-64 gap-2'>
              <Text className='text-center'>{date.day}</Text>
              <Text className='text-center'>{date.quote}</Text>
              <Text className='text-center font-bold'>{date.author}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
