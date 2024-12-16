// get 9 weeks centered around today
export const getSortedChunks = () => {
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

// export function getSurroundingDays() {
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
