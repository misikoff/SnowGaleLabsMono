import { useCallback, useRef, useState } from 'react'

import {
  Dimensions,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Button,
  ActionSheetIOS,
  Pressable,
  Alert,
} from 'react-native'
import * as Haptics from 'expo-haptics'
import { useFocusEffect } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import {
  BookMarkedIcon,
  EllipsisIcon,
  PlusIcon,
  PlusSquareIcon,
  XIcon,
} from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Session } from '@repo/db/schema'
import AddSessionButton from '@/components/session/addSessionButton'
import { deleteSession, getSessions } from '@/lib/dbFunctions'

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

// function getSurroundingDays() {
//   const today = new Date() // Get the current date
//   const currentDay = today.getDate() // Get the day of the month

//   // Create an array of the 3 days before, the current day, and 3 days after
//   const surroundingDays = []
//   for (let offset = -3; offset <= 3; offset++) {
//     const date = new Date(today) // Clone the current date
//     date.setDate(currentDay + offset) // Adjust the day
//     surroundingDays.push(date.getDate())
//   }

//   return surroundingDays
// }

const weeks = getSortedChunks()
// const days = getSurroundingDays()

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

export default function Calendar() {
  const user = useUser()
  const userId = user.user!.id

  const queryClient = useQueryClient()
  const deleteSessionMutation = useMutation({
    mutationFn: (id: Session['id']) => deleteSession(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['sessions'],
      })

      // Snapshot the previous value
      const previousSessions = queryClient.getQueryData([
        'sessions',
      ]) as Session[]

      const nextSessions = previousSessions.filter((s) => {
        console.log({ a: id, b: s.id, res: s.id !== id })
        return s.id !== id
      })

      console.log({ nextSessions })
      // Optimistically update to the new value
      queryClient.setQueryData(['sessions'], nextSessions)

      // Return a context object with the snapshotted value
      return { previousSessions }
    },
    onSuccess: () => {
      console.log('session deleted')
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })

  const onPress = (session: Session) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          'Copy and Paste Session',
          'Move Session',
          'Rename Session',
          'Delete Session',
          'Cancel',
        ],
        destructiveButtonIndex: 3,
        cancelButtonIndex: 4,
        title: new Date(session.date).toLocaleString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          // setResult(String(Math.floor(Math.random() * 100) + 1));
        } else if (buttonIndex === 2) {
          // setResult('🔮');
        } else if (buttonIndex === 3) {
          Alert.alert(
            'Delete Session?',
            'If you delete this session, any logged values will also be deleted.',
            [
              {
                text: 'No thanks',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Yes!',
                onPress: () => {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success,
                  )
                  deleteSessionMutation.mutateAsync(session.id)
                },
              },
            ],
          )
        }
      },
    )
  }

  const {
    data: sessions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => getSessions({ userId }),
  })

  const scrollViewRef = useRef(null)
  const subScrollViewRef = useRef(null)
  const DeviceSize = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
  const [curWeek, setCurWeek] = useState(4)
  // const [curDay, setCurDay] = useState(3)
  const [selectedDate, setSelectedDate] = useState(weeks[4][3])
  const [selectedWeek, setSelectedWeek] = useState(weeks[4])

  // match quotes to days
  const [trainingDays, setTrainingDays] = useState<
    {
      day: string
      quote: string
      author: string
      adding: boolean
      sessions: Session[]
    }[]
  >([])

  useFocusEffect(
    useCallback(() => {
      // get sessions for each day

      const dates = selectedWeek.map((day, i) => {
        const quote = quotes[i % quotes.length]
        return {
          day,
          quote: quote.quote,
          author: quote.author,
          adding: false,
          sessions: sessions?.filter((s) => s.date === day) || [],
        }
      })
      setTrainingDays(dates)
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      }
    }, [selectedWeek, sessions]),
  )

  return (
    <SafeAreaView className='flex-1 items-center'>
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
        contentOffset={{ x: DeviceSize.width * 4, y: 0 }}
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
                  {/* show dots for number of sessions */}
                  <Text className='text-center'>
                    {trainingDays
                      .find((d) => d.day === date)
                      ?.sessions.slice(0, 3)
                      .map(() => '•')}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      {trainingDays.length > 0 && (
        <ScrollView
          horizontal={true}
          className='-mb-8 bg-gray-500'
          pagingEnabled={true}
          ref={subScrollViewRef}
          contentOffset={{ x: DeviceSize.width * 3, y: 0 }}
          onMomentumScrollEnd={(event) => {
            console.log(
              'event.nativeEvent.contentOffset.x:',
              event.nativeEvent.contentOffset.x,
              DeviceSize.width,
            )
            const page = event.nativeEvent.contentOffset.x / DeviceSize.width
            console.log('page:', page)
            // setCurDay(days[Math.floor(page)])
            setSelectedDate(trainingDays[Math.floor(page)].day)
          }}
        >
          {trainingDays.map((date) => (
            <View
              key={date.day}
              className='relative w-screen items-center justify-center'
            >
              {date.sessions.length === 0 ? (
                <View className='w-64 justify-center gap-2'>
                  <Text className='text-center'>{date.day}</Text>
                  <Text className='text-center'>{date.quote}</Text>
                  <Text className='text-center font-bold'>{date.author}</Text>
                  <Button
                    title='Refresh Calendar'
                    onPress={() => console.log('Refresh Calendar')}
                    color='yellow'
                  />
                </View>
              ) : (
                <ScrollView className='w-full'>
                  <View className='w-full gap-2'>
                    {date.sessions.map((session) => (
                      <View
                        key={session.id}
                        className='h-64 w-full gap-4 bg-red-300'
                      >
                        <View className='w-full flex-row gap-4'>
                          <TouchableOpacity onPress={() => onPress(session)}>
                            <View className='rounded-full bg-gray-400 p-4'>
                              <EllipsisIcon color='black' size={24} />
                            </View>
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            Haptics.notificationAsync(
                              Haptics.NotificationFeedbackType.Success,
                            )
                          }}
                        >
                          <View className='mx-4 rounded-md bg-blue-400 p-4'>
                            <Text className='mx-auto text-lg font-bold text-white'>
                              Start Session
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}
              {!date.adding ? (
                <View className='absolute bottom-8 right-8 rounded-full bg-blue-500 p-4'>
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success,
                      )
                      console.log('Add Event')
                      setTrainingDays((prev) =>
                        prev.map((d) => {
                          if (d.day === date.day) {
                            return { ...d, adding: true }
                          }
                          return d
                        }),
                      )
                    }}
                  >
                    <PlusIcon color='black' size={24} />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <Pressable
                    className='absolute inset-0 bg-gray-900 opacity-80'
                    onPress={() => {
                      Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success,
                      )
                      console.log('stop adding ')
                      setTrainingDays((prev) =>
                        prev.map((d) => {
                          if (d.day === date.day) {
                            return { ...d, adding: false }
                          }
                          return d
                        }),
                      )
                    }}
                  />
                  <View className='absolute bottom-8 right-8 items-end gap-4'>
                    <AddSessionButton userId={userId} date={date.day}>
                      <View className='flex-row gap-4'>
                        <View className='items-center justify-center rounded-md bg-white px-2'>
                          <Text className='text-xl font-bold'>
                            Create Session
                          </Text>
                        </View>
                        <View className='rounded-full bg-white p-4'>
                          <PlusSquareIcon color='black' size={24} />
                        </View>
                      </View>
                    </AddSessionButton>
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          Haptics.notificationAsync(
                            Haptics.NotificationFeedbackType.Success,
                          )
                        }}
                      >
                        <View className='flex-row gap-4'>
                          <View className='items-center justify-center rounded-md bg-white px-2'>
                            <Text className='text-xl font-bold'>
                              Add From Library
                            </Text>
                          </View>
                          <View className='rounded-full bg-white p-4'>
                            <BookMarkedIcon color='black' size={24} />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.notificationAsync(
                          Haptics.NotificationFeedbackType.Success,
                        )
                        console.log('stop adding ')
                        setTrainingDays((prev) =>
                          prev.map((d) => {
                            if (d.day === date.day) {
                              return { ...d, adding: false }
                            }
                            return d
                          }),
                        )
                      }}
                    >
                      <View className='w-auto flex-grow-0'>
                        <View className='rounded-full bg-blue-500 p-4'>
                          <XIcon color='black' size={24} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}
