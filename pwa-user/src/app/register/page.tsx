"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const Register: React.FC = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showMessage, setShowMessage] = useState(false)

  const validatePassword = (pw: string) => {
    if (pw.length < 6) return "Password minimal 6 karakter"
    if (!/[a-zA-Z]/.test(pw) || !/[0-9]/.test(pw)) return "Password harus mengandung huruf dan angka"
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setShowMessage(false)

    if (!email || !password || !confirmPassword) {
      setError("Semua field wajib diisi")
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 3000)
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 3000)
      return
    }

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi tidak sama")
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 3000)
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Registrasi gagal")
        setShowMessage(true)
        setTimeout(() => setShowMessage(false), 3000)
        return
      }

      setSuccess("Registrasi berhasil! Mengarahkan ke login...")
      setShowMessage(true)
      setTimeout(() => {
        setShowMessage(false)
        router.push("/login")
      }, 1500)
    } catch (err) {
      console.error(err)
      setError("Terjadi kesalahan koneksi")
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 3000)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#221E1E] w-full font-[Inter]">
      <Header />

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Left side - Full height image */}
        <div className="relative w-full lg:w-1/2 h-[300px] lg:h-full">
          <Image
            src="/picture/image 8.png"
            alt="Background"
            layout="fill"
            objectFit="cover"
            className="opacity-40 z-5"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          <div className="absolute bottom-8 left-0 right-0 px-6 lg:px-12 z-10">
            <p className="z-99 text-white text-lg lg:text-2xl font-semibold italic capitalize leading-relaxed">
              🌱 "Every Guardian Starts Somewhere." Create your account and join the cleanup revolution.
            </p>
          </div>
        </div>

        {/* Right side - Register Form */}
        <div className="w-full lg:w-1/2 bg-white p-6 lg:p-14 overflow-y-auto">
          <div className="max-w-[527px] mx-auto">
            <h1 className="text-2xl lg:text-3xl text-[#A0C878] font-bold capitalize mb-6">
              Welcome, new Earth Guardian!
            </h1>
            <p className="text-lg lg:text-xl font-bold text-black capitalize mb-8">
              Let's get you started! 🥳
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

              <div className="space-y-2">
                <label className="block text-[#A0C878] text-lg font-bold capitalize">Konfirmasi Password</label>
                <div className="w-full h-[56px] border-2 border-[#333] rounded-[10px] flex items-center px-4">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="flex-grow bg-transparent outline-none text-black"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {showMessage && (
                <div
                  className={`w-full py-2 px-4 rounded-md shadow transition-all duration-300 ${
                    error
                      ? "bg-red-100 text-red-700 border border-red-400"
                      : "bg-green-100 text-green-700 border border-green-400"
                  }`}
                >
                  {error || success}
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full sm:w-[288px] h-[56px] bg-[#A0C878] hover:bg-[#6fa536] rounded-[10px] text-white text-xl lg:text-2xl font-bold capitalize transition-colors mx-auto block"
                >
                  Create Account
                </button>
              </div>

              <div className="text-center pt-6">
                <p className="text-black text-base lg:text-lg font-medium capitalize">
                  Already have an account?{" "}
                  <a href="/login" className="text-green-600 hover:underline">
                    Log In
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Register
