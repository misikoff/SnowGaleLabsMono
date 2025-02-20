import {
  useState,
  useRef,
  // useEffect
} from 'react'

import {
  View,
  Text,
  TouchableOpacity,
  // Modal,
  StyleSheet,
  // SectionList,
  // PanResponder,
  // Dimensions,
  // AccessibilityInfo,
} from 'react-native'
import {
  FlashList,
  // ListRenderItemInfo
} from '@shopify/flash-list'
// import clsx from 'clsx'

interface Option {
  label: string
  value: string
}

interface ScrollableSelectProps {
  options: Option[]
  onSelect: (option: Option) => void
  initialValue?: Option
  placeholder?: string
}

// const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
// const alphabet = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export default function ScrollableSelect({
  options,
  onSelect,
  initialValue,
  placeholder = 'Select an option',
}: ScrollableSelectProps) {
  const [selectedValue, setSelectedValue] =
    useState<(typeof options)[0]>(initialValue)

  const sectionListRef = useRef<FlashList<(string | typeof options)[0]>>(null)
  // const [currentLetter, setCurrentLetter] = useState('')
  // const [isDragging, setIsDragging] = useState(false)

  const sortedOptions = options.sort((a, b) => a.label.localeCompare(b.label))
  const sectionData = [] as (string | Option)[]
  sortedOptions.forEach((option) => {
    // if the first letter of the option lable is not present already, add it and then add the option
    const firstLetter = option.label[0].toUpperCase()
    // if first char is number, add it to the # section
    if (!isNaN(parseInt(firstLetter))) {
      if (!sectionData.find((item) => item === '#')) {
        sectionData.push('#')
      }
    } else if (!sectionData.find((item) => item === firstLetter)) {
      sectionData.push(firstLetter)
    }
    sectionData.push(option)
  })

  const handleSelect = (option: Option) => {
    console.log({ option })
    onSelect(option)
    setSelectedValue(option)
  }

  // const scrollToLetter = (letter: string) => {
  //   const sectionIndex = sectionData.findIndex(
  //     (item: string | (typeof options)[0]) => item === letter,
  //   )
  //   console.log({ sectionIndex })
  //   if (sectionIndex !== -1) {
  //     sectionListRef.current?.scrollToIndex({
  //       animated: true,
  //       index: sectionIndex,
  //     })
  //   }
  // }

  // const panResponder = PanResponder.create({
  //   onStartShouldSetPanResponder: () => true,
  //   onMoveShouldSetPanResponder: () => true,
  //   onPanResponderGrant: () => {
  //     setIsDragging(true)
  //   },
  //   onPanResponderMove: (_, gestureState) => {
  //     const alphabetHeight = SCREEN_HEIGHT * 0.6 // Adjust based on your layout
  //     const letterHeight = alphabetHeight / alphabet.length
  //     const letterIndex = Math.min(
  //       Math.max(Math.floor(gestureState.moveY / letterHeight), 0),
  //       alphabet.length - 1,
  //     )
  //     const letter = alphabet[letterIndex]
  //     setCurrentLetter(letter)
  //     scrollToLetter(letter)
  //   },
  //   onPanResponderRelease: () => {
  //     setIsDragging(false)
  //   },
  // })

  // useEffect(() => {
  //   if (isDragging) {
  //     AccessibilityInfo.announceForAccessibility(
  //       `Scrolling to ${currentLetter}`,
  //     )
  //   }
  // }, [currentLetter, isDragging])

  return (
    <View style={styles.modalContent}>
      <FlashList
        ref={sectionListRef}
        // keyExtractor={(item) => item.value}
        data={sectionData}
        renderItem={({ item }) => {
          if (typeof item === 'string') {
            // Rendering header
            return <Text style={styles.sectionHeader}>{item}</Text>
          } else {
            // Render item
            return (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                accessibilityRole='button'
                accessibilityLabel={`Select ${item.label}`}
              >
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            )
          }
        }}
        getItemType={(item) => {
          // To achieve better performance, specify the type based on the item
          return typeof item === 'string' ? 'sectionHeader' : 'row'
        }}
        estimatedItemSize={100}
      />
      {/* <View
        style={styles.alphabetList}
        // {...panResponder.panHandlers}
      > */}
      {/* {['#', ...alphabet].map((letter) => (
          <TouchableOpacity
            key={letter}
            onPress={() => scrollToLetter(letter)}
            style={styles.letterButton}
            accessibilityRole='button'
            accessibilityLabel={`Scroll to ${letter}`}
            disabled={sectionData.includes(letter)}
          >
            <Text
              className={clsx(
                'text-blue-800 disabled:text-slate-500',
                isDragging && letter === currentLetter ? 'text-blue-400' : '',
              )}
              // style={styles.letterText}
            >
              {letter}
            </Text>
          </TouchableOpacity>
        ))} */}
      {/* </View> */}
      {/* {isDragging && (
        <View style={styles.currentLetterIndicator}>
          <Text style={styles.currentLetterText}>{currentLetter}</Text>
        </View>
      )} */}
    </View>
  )
}

const styles = StyleSheet.create({
  selectButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  selectButtonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    height: '80%',
    flexDirection: 'row',
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  closeButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  alphabetList: {
    position: 'absolute',
    right: 5,
    // top: 20,
    // bottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(200, 200, 200, 0.8)',
    borderRadius: 10,
    paddingVertical: 5,
  },
  letterButton: {
    padding: 2,
  },
  letterText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  currentLetterIndicator: {
    position: 'absolute',
    left: '45%',
    top: '45%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLetterText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
})
