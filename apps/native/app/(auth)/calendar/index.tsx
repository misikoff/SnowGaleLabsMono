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
  Modal,
  StyleSheet,
} from 'react-native'
import * as Haptics from 'expo-haptics'
import { useFocusEffect } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { Picker as SelectPicker } from '@react-native-picker/picker'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { produce } from 'immer'
import {
  BookMarkedIcon,
  EllipsisIcon,
  PlusIcon,
  PlusSquareIcon,
  TrashIcon,
  XIcon,
} from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import {
  Session,
  SessionWithSetGroupWithExerciseAndSets,
} from '@repo/db/schema'
import DeleteExerciseAlert from '@/components/calendarHelpers/deleteExerciseAlert'
import AddExerciseBottomSheet from '@/components/session/addExerciseBottomSheet'
import AddSessionButton from '@/components/session/addSessionButton'
import { getSessions } from '@/lib/dbFunctions'
import {
  useDeleteSessionMutation,
  useUpdateSessionDateMutation,
} from '@/lib/mutations/sessionMutations'

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

  const [curWeek, setCurWeek] = useState(4)
  // const [curDay, setCurDay] = useState(3)
  const [selectedDate, setSelectedDate] = useState(weeks[4][3])
  const [selectedWeek, setSelectedWeek] = useState(weeks[4])
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [selectedMoveDate, setSelectedMoveDate] = useState('')
  const [currentSession, setCurrentSession] =
    useState<SessionWithSetGroupWithExerciseAndSets | null>(null)

  const queryClient = useQueryClient()
  const sessionUpdateMutation = useUpdateSessionDateMutation()
  const sessionDeleteMutation = useDeleteSessionMutation()

  const onPress = (session: Session) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    setCurrentSession(session)
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
          setShowMoveModal(true)
          console.log('Move Session')
          setSelectedMoveDate(session.date)
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
                  sessionDeleteMutation.mutateAsync(session.id)
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
  console.log({ sessions })

  const scrollViewRef = useRef(null)
  const subScrollViewRef = useRef(null)
  const DeviceSize = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }

  // match quotes to days
  const [trainingDays, setTrainingDays] = useState<
    {
      day: string
      quote: string
      author: string
      adding: boolean
      sessions: SessionWithSetGroupWithExerciseAndSets[]
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
      <View className='w-full flex-row items-center justify-between bg-slate-950 px-4'>
        <Text className='text-2xl font-bold text-white'>
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
          const page = event.nativeEvent.contentOffset.x / DeviceSize.width
          setCurWeek(Math.floor(page))
        }}
        className='flex-grow-0 bg-slate-950'
      >
        {weeks.map((week, i) => (
          <View key={i} className='w-screen flex-row justify-between pt-4'>
            {week.map((date, d) => (
              <TouchableOpacity
                key={date}
                className={clsx(
                  'flex-grow border-b-2 pb-4',
                  date === selectedDate ? 'border-white' : 'border-gray-400',
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
                      'mx-auto font-bold',
                      date === selectedDate ? 'text-white' : 'text-gray-400',
                    )}
                  >
                    {date.split('-')[2]}
                  </Text>
                  {/* show dots for number of sessions */}
                  <Text className='-mb-2 text-center text-white'>
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
          className='-mb-8 bg-zinc-900'
          pagingEnabled={true}
          ref={subScrollViewRef}
          contentOffset={{ x: DeviceSize.width * 3, y: 0 }}
          onMomentumScrollEnd={(event) => {
            const page = event.nativeEvent.contentOffset.x / DeviceSize.width
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
                  {/* <Text className='text-center'>{date.day}</Text> */}
                  <Text className='text-center text-lg text-white'>
                    {date.quote}
                  </Text>
                  <Text className='text-center text-lg font-bold text-white'>
                    {date.author}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Refresh Calendar')
                      // invalidate the query maybe for just this session
                      queryClient.invalidateQueries({ queryKey: ['sessions'] })
                    }}
                  >
                    <Text className='mx-auto mt-12 font-bold text-blue-400'>
                      Refresh Calendar
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <ScrollView className='w-full'>
                  <View className='w-full gap-2'>
                    {date.sessions.map((session, i) => (
                      <View key={session.id}>
                        {i > 0 && (
                          <View className='border-b-4 border-zinc-600' />
                        )}
                        <View className='min-h-64 w-full gap-4 p-4'>
                          <View className='w-full flex-row items-center justify-between gap-4'>
                            <Text className='text-lg font-bold text-white'>
                              {session.name || 'Untitled Session'}
                            </Text>
                            <TouchableOpacity onPress={() => onPress(session)}>
                              <View className='rounded-full bg-gray-800 p-3'>
                                <EllipsisIcon color='lightblue' size={24} />
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
                            <View className='rounded-md bg-blue-400 px-4 py-3'>
                              <Text className='mx-auto text-lg font-bold text-white'>
                                Start Session
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity className='flex-row items-center gap-4'>
                            <Text className='text-xl font-bold text-blue-400'>
                              Comment on Session
                            </Text>
                          </TouchableOpacity>
                          <View className='flex-row items-center gap-4'>
                            {/* <Text className='text-lg font-bold text-white'>
                              Exercises: {session.setGroups.length}
                            </Text> */}
                            <View className=''>
                              {session.setGroups
                                .slice()
                                .sort((s1, s2) => {
                                  if (s1.order && s2.order) {
                                    return s1.order - s2.order
                                  } else if (s1.order) {
                                    return -1
                                  }
                                  return 1
                                })
                                .map((setGroup, i) => (
                                  <View
                                    key={setGroup.id}
                                    className='w-full flex-row items-center justify-between gap-4 border-b-2 border-gray-400 py-4'
                                  >
                                    <TouchableOpacity className='flex-row items-center justify-center gap-4'>
                                      <View className='h-10 w-10 items-center justify-center rounded-full border-2 border-gray-400'>
                                        <Text className='text-center text-lg text-white'>
                                          {/* get alphabet letter for order */}
                                          {String.fromCharCode(65 + i)}
                                        </Text>
                                      </View>
                                      <View className=''>
                                        <Text
                                          key={setGroup.id}
                                          className='text-xl font-bold text-white'
                                        >
                                          {setGroup.order}{' '}
                                          {setGroup.exercise.name}
                                        </Text>
                                        <Text className='text-lg text-blue-300'>
                                          {setGroup.sets.length} set
                                          {setGroup.sets.length !== 1
                                            ? 's'
                                            : ''}
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={() => {
                                        DeleteExerciseAlert(setGroup.exercise)
                                      }}
                                    >
                                      <TrashIcon color='lightblue' size={24} />
                                    </TouchableOpacity>
                                  </View>
                                ))}
                            </View>
                          </View>

                          <View className='flex-row items-center gap-4'>
                            <AddExerciseBottomSheet session={session}>
                              <View className='flex-row items-center gap-4'>
                                <View className='rounded-full border-2 border-blue-400 p-1'>
                                  <PlusIcon size={20} color='lightblue' />
                                </View>
                                <Text className='text-xl font-black text-white'>
                                  Add Exercise
                                </Text>
                              </View>
                            </AddExerciseBottomSheet>

                            <TouchableOpacity>
                              <View className='flex-row items-center gap-4'>
                                <View className='rounded-full border-2 border-blue-400 p-1'>
                                  <PlusIcon size={20} color='lightblue' />
                                </View>
                                <Text className='text-xl font-black text-white'>
                                  Add Circuit
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
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
      <Modal
        animationType='slide'
        transparent={true}
        visible={showMoveModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
          setShowMoveModal(!showMoveModal)
        }}
      >
        <Pressable
          className='absolute inset-0 bg-gray-700 opacity-35'
          onPress={() => {
            setShowMoveModal(false)
          }}
        />
        <View className='flex-grow' />
        <View className='items-center justify-center bg-slate-700'>
          <View className='w-full flex-row justify-between border-b-2 border-gray-200 p-4'>
            <TouchableOpacity onPress={() => setShowMoveModal(!showMoveModal)}>
              <Text className='text-lg text-blue-400'>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log({ selectedMoveDate })
                const handleUpdate = () => {
                  mutation.mutate(
                    { userId: '123', data: { name: 'John Doe' } },
                    {
                      onSuccess: (data) => {
                        console.log('User updated successfully:', data)
                      },
                      onError: (error) => {
                        console.error('Error updating user:', error)
                      },
                    },
                  )
                }
                sessionUpdateMutation.mutateAsync({
                  id: currentSession!.id,
                  date: selectedMoveDate,
                })
                setShowMoveModal(false)
              }}
            >
              <Text className='text-lg font-bold text-blue-400'>Select</Text>
            </TouchableOpacity>
          </View>
          <SelectPicker
            itemStyle={pickerSelectStyles.pickerItem}
            style={pickerSelectStyles.picker}
            selectedValue={selectedMoveDate}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedMoveDate(itemValue)
            }
          >
            {weeks.flat().map((week, i) => (
              <SelectPicker.Item key={i} label={week} value={week} />
            ))}
          </SelectPicker>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const pickerSelectStyles = StyleSheet.create({
  picker: {
    width: '100%',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  pickerItem: {
    color: 'white',
    // backgroundColor: 'black',
  },
})
