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
import { Link, useFocusEffect } from 'expo-router'
import { Picker as SelectPicker } from '@react-native-picker/picker'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import {
  BookMarkedIcon,
  EllipsisIcon,
  PlusIcon,
  PlusSquareIcon,
  TrashIcon,
  XIcon,
} from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import AddSessionButton from '@/components/session/addSessionButton'
import DeleteSetGroupButton from '@/components/session/deleteSetGroupButton'
import { getSortedChunks } from '@/lib/calendarFunctions'
import { getQuotes, getSessions, useSupabaseUser } from '@/lib/dbFunctions'
import { invalidateSessionQueries } from '@/lib/mutations/refetcher'
import {
  useDeleteSessionMutation,
  useUpdateSessionDateMutation,
} from '@/lib/mutations/sessionMutations'

import {
  Session,
  SessionWithSetGroupWithExerciseAndSets,
} from '../../../../../packages/toron-db/schema'

const weeks = getSortedChunks()

export default function Calendar() {
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useSupabaseUser()

  // console.log({ user })

  const [curWeek, setCurWeek] = useState(4)
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
                  sessionDeleteMutation.mutateAsync({ id: session.id })
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
    isLoading: sessionsLoading,
    isError: sessionsError,
    error,
  } = useQuery({
    enabled: user !== undefined,
    queryKey: ['sessions'],
    queryFn: async () => getSessions({ userId: user!.data.user!.id }),
  })
  console.log({
    sessions,
    id: user?.data.user!.id,
    sessionsLoading,
    sessionsError,
    error,
  })

  const {
    data: realQuotes,
    isLoading: quotesLoading,
    isError: quotesError,
    // error: quotesError,
  } = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => getQuotes(),
  })

  console.log({
    sessions,
    id: user?.data.user!.id,
    sessionsLoading,
    sessionsError,
    error,
  })

  const scrollViewRef = useRef<any | null>(null)
  const subScrollViewRef = useRef<any | null>(null)
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
        // const quote = quotes[i % quotes.length]
        return {
          day,
          // text: quote.text,
          // author: quote.author,
          adding: false,
          sessions: sessions?.filter((s) => s.date === day) || [],
        }
      })
      setTrainingDays(dates)
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
            setSelectedDate(trainingDays[Math.floor(page)].day)
          }}
        >
          {trainingDays.map((date, i) => (
            <View
              key={date.day}
              className='relative w-screen items-center justify-center'
            >
              {date.sessions.length === 0 ? (
                <View className='w-64 justify-center gap-2'>
                  {/* <Text className='text-center'>{date.day}</Text> */}
                  <Text className='text-center text-lg text-white'>
                    {/* {date.text} */} {!quotesLoading && realQuotes[i].text}
                  </Text>
                  <Text className='text-center text-lg font-bold text-white'>
                    {/* {date.author} */}{' '}
                    {!quotesLoading && realQuotes[i].author}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Refresh Calendar')
                      invalidateSessionQueries(queryClient)
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
                            <View>
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
                                    <DeleteSetGroupButton setGroup={setGroup}>
                                      <TrashIcon color='lightblue' size={24} />
                                    </DeleteSetGroupButton>
                                  </View>
                                ))}
                            </View>
                          </View>
                          <View className='flex-row items-center gap-4'>
                            <Link
                              href={`/(auth)/calendar/addExercise?sessionId=${session.id}`}
                            >
                              <View className='flex-row items-center gap-4'>
                                <View className='rounded-full border-2 border-blue-400 p-1'>
                                  <PlusIcon size={20} color='lightblue' />
                                </View>
                                <Text className='text-xl font-black text-white'>
                                  Add Exercise
                                </Text>
                              </View>
                            </Link>

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
                    {user && (
                      <AddSessionButton date={date.day}>
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
                    )}
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
            onValueChange={(itemValue) => setSelectedMoveDate(itemValue)}
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
