'use client'

import { addItem } from './actions'

export default function Button() {
  return (
    <form action={addItem}>
      <input type='text' name='name' />
      <button type='submit'>Update Item</button>
    </form>
  )
}
