"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    try {
      const res = await axios.post("https://ii-3240-kel9-bounty-hunter.vercel.app/api/admin/login", {
        email,
        password,
      })

      if (res.status === 200) {
        // optionally save session or token
        router.push("/dashboard")
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ error: string }>
      if (axiosError.response?.data?.error) {
        setError(axiosError.response.data.error)
      } else {
        setError("Login failed. Try again.")
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to access the admin page</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full border-gray-300 focus:border-black focus:ring-black"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-gray-300 focus:border-black focus:ring-black"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-medium text-gray-700 cursor-pointer">
                Remember me
              </Label>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>

          <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  )
}