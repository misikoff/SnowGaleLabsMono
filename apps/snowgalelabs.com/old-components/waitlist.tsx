"use client"

import { useState } from "react"

export default function Waitlist({}) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.includes("@")) {
      setMessage("Please enter a valid email.")
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMessage("Thank you for subscribing!")
      setEmail("")
    } catch (error) {
      setMessage("Something went wrong. Try again.")
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 border rounded-lg w-full text-center focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Subscribe
        </button>
      </form>
      {message && <p className="mt-4 text-gray-700">{message}</p>}
    </>
  )
}
