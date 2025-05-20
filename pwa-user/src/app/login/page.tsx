"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Leaf } from "lucide-react"
import Image from "next/image"

const Login: React.FC = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showMessage, setShowMessage] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Login gagal")
        setSuccess("")
        setShowMessage(true)
        setTimeout(() => setShowMessage(false), 3000)
        return
      }

      localStorage.setItem("user", JSON.stringify(data.user))
      setSuccess("Login berhasil")
      setError("")
      setShowMessage(true)

      setTimeout(() => {
        setShowMessage(false)
        router.push("/dashboard")
      }, 1000)
    } catch (err) {
      console.error(err)
      setError("Terjadi kesalahan koneksi")
      setSuccess("")
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 3000)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#221E1E] font-[Inter] text-black">
      {/* Header Branding */}
      <div className="p-6 flex items-center gap-2 text-white">
        <Leaf className="text-[#8BC34A]" size={28} />
        <span className="font-bold text-xl">BountyHunter</span>
      </div>

      <div className="flex flex-col lg:flex-row max-w-[1440px] mx-auto">
        {/* Left side - Image and quote */}
        <div className="relative w-full lg:w-1/2 h-[300px] lg:h-[750px] overflow-hidden bg-[#221E1E]">
          <div className="absolute w-full h-full">
            <Image src="/picture/image 8.png" alt="Background" layout="fill" objectFit="cover" className="opacity-40" />
            <div className="absolute bg-black bg-opacity-20"></div>
          </div>
          <div className="absolute bottom-8 left-0 right-0 px-6 lg:px-12 z-10">
            <p className="text-white text-lg lg:text-2xl font-semibold italic capitalize leading-relaxed">
              🌿 "Clean Earth, Bright Future." Join the mission. Make every login count.
            </p>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 bg-white p-6 lg:p-14">
          <div className="max-w-[527px] mx-auto">
            <h1 className="text-2xl lg:text-3xl text-[#A0C878] font-bold capitalize mb-6">
              Welcome Back, Earth Guardian!
            </h1>
            <p className="text-lg lg:text-xl font-bold text-black capitalize mb-8">
              Log in to continue your mission! 🤩
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[#A0C878] text-lg font-bold capitalize">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-[56px] border-2 border-[#333] rounded-[10px] px-4 text-black"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[#A0C878] text-lg font-bold capitalize">Password</label>
                <div className="w-full h-[56px] border-2 border-[#333] rounded-[10px] flex items-center px-4">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="flex-grow bg-transparent outline-none text-black"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {showMessage && (
                <div
                  className={`w-full py-2 px-4 rounded-md shadow transition-all duration-300
                  ${error ? "bg-red-100 text-red-700 border border-red-400" : "bg-green-100 text-green-700 border border-green-400"}`}
                >
                  {error || success}
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full sm:w-[288px] h-[56px] bg-[#A0C878] hover:bg-[#6fa536] rounded-[10px] text-white text-xl lg:text-2xl font-bold capitalize transition-colors mx-auto block"
                >
                  Log In
                </button>
              </div>

              <div className="text-center pt-6">
                <p className="text-black text-base lg:text-lg font-medium capitalize">
                  Don't have an account?{" "}
                  <a href="/register" className="text-green-600 hover:underline">
                    Sign Up
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
