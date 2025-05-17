// components/email-form.tsx
"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function EmailForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return

    try {
      const res = await axios.post("https://ii-3240-kel9-bounty-hunter-git-main-farahs-projects-d8079cf5.vercel.app/api/checkuser", {
        email,
      })

      if ((res.data as { exists: boolean }).exists) {
        // save into local storage
        localStorage.setItem("email", email)
        router.push(`/progress?email=${encodeURIComponent(email)}`)
      } else {
        setError("Email not found. Please register first.")
      }
    } catch (err) {
      console.error(err)
      setError("Server error. Please try again later.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto px-4">
      <div className="flex flex-col gap-4 items-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Insert Your Email"
          required
          className="h-14 px-4 bg-white/95 text-gray-800 border-0 rounded-md text-lg w-full"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="mt-4 h-14 bg-[#a4d273] hover:bg-[#8abb5e] text-white font-medium text-lg rounded-xl transition-colors w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
        >
          Start Contributing!
        </button>
      </div>
    </form>
  )
}