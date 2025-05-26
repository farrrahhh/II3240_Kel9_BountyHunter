"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Gift, Home, User, Trash2, Menu, X } from "lucide-react"
import Image from "next/image"

const RewardsPage = () => {
  const router = useRouter()
  const [rewards, setRewards] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [points, setPoints] = useState<number>(0)
  const [selectedReward, setSelectedReward] = useState<any>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fetchRewards = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/rewards?ts=${Date.now()}`)
      const data = await res.json()
      setRewards(data)
    } catch (err) {
      console.error("Error fetching rewards:", err)
    }
  }

  const fetchUserPoints = async (userId: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/users/${userId}/points?ts=${Date.now()}`)
      const data = await res.json()
      if (res.ok) setPoints(data.points)
    } catch (err) {
      console.error("Error fetching user points:", err)
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      setUser(parsed)
      fetchUserPoints(parsed.user_id)
    } else {
      router.push("/login")
    }
    fetchRewards()
  }, [router])

  const handleRedeem = async () => {
    if (!user || !selectedReward) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/rewards/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.user_id, reward_id: selectedReward.reward_id }),
      })
      const data = await res.json()
      if (!res.ok) return setSuccessMessage(data.error || "Gagal menukar reward")

      setSuccessMessage("Reward berhasil ditukar!")
      fetchUserPoints(user.user_id)
      fetchRewards()
    } catch (err) {
      setSuccessMessage("Terjadi kesalahan saat menukar reward")
    } finally {
      setShowConfirm(false)
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen w-full max-w-[1440px] mx-auto bg-[#221E1E] font-[Inter] text-white">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static w-64 bg-[#111111] h-full flex flex-col justify-between z-30 transition-all duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          <div className="p-6 flex items-center gap-2 border-b border-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8BC34A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-leaf"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
            <span className="font-bold text-xl">BountyHunter</span>
            <button className="ml-auto lg:hidden" onClick={toggleSidebar}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="p-6">
            <ul className="space-y-6">
              <li>
                <div
                  className="flex items-center gap-3 hover:text-[#8BC34A] cursor-pointer transition-colors"
                  onClick={() => {
                    router.push("/dashboard")
                    setSidebarOpen(false)
                  }}
                >
                  <Home className="w-5 h-5" /> Home
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3 text-[#8BC34A] font-semibold cursor-pointer">
                  <Gift className="w-5 h-5" /> Rewards
                </div>
              </li>
              <li>
                <div
                  className="flex items-center gap-3 cursor-pointer hover:text-[#8BC34A] transition-colors"
                  onClick={() => {
                    router.push("/disposals_history")
                    setSidebarOpen(false)
                  }}
                >
                  <Trash2 className="w-5 h-5" /> Riwayat Pembuangan
                </div>
              </li>
            </ul>
          </nav>
        </div>
        <div
          className="p-6 border-t border-gray-800 cursor-pointer hover:opacity-80 transition"
          onClick={() => {
            router.push("/users")
            setSidebarOpen(false)
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#8BC34A] flex items-center justify-center">
              <User className="w-4 h-4 text-black" />
            </div>
            <p className="text-sm font-medium truncate">{user?.email}</p>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 bg-[#1a1a1a] overflow-y-auto w-full">
        {/* Header */}
        <header className="bg-[#8BC34A] p-4 text-white text-xl font-bold flex items-center gap-2">
          <button className="lg:hidden mr-2" onClick={toggleSidebar}>
            <Menu className="w-6 h-6" />
          </button>
          <Gift className="w-6 h-6" /> Rewards
        </header>

        {/* Hero Section */}
        <section className="relative h-[180px] sm:h-[200px] px-4 sm:px-6 py-6 sm:py-8 text-white overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/picture/image5.png"
              alt="Reward Hero Background"
              fill
              className="object-cover"
              style={{ filter: "blur(0px)", transform: "scale(1.05)" }}
              priority
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.4))", zIndex: 1 }}
            />
          </div>
          
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Turn Trash Into Treasure!</h1>
            <p className="mt-2 font-bold text-xs sm:text-sm max-w-xl text-white">
              Earn Reward Points By Recycling At Smart Bins And Redeem Them For Exciting Discounts, Vouchers, And
              Exclusive Deals!
            </p>
              <div className="absolute top-20 right-4 sm:right-6 text-right">
                <div className="bg-[#8BC34A] bg-opacity-90 px-4 py-2 rounded-lg shadow-md inline-block">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white">{points}</h2>
                  <p className="text-xs sm:text-sm text-white">points</p>
                </div>
              </div>
            </div>
         
        </section>

        {/* Rewards Section */}
        <section className="px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Browse Available <span className="text-[#8BC34A]">Rewards</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-300">
                Explore All The Discounts And Gift Items You Can Redeem With Your Points.
              </p>
            </div>
            <button
              onClick={() => router.push("/rewards_history")}
              className="bg-[#8BC34A] hover:bg-[#7ab63e] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm font-medium transition-colors"
            >
              Lihat Riwayat Penukaran
            </button>
          </div>

          <div className="space-y-4">
            {rewards.map((reward) => {
              const disabled = reward.stock === 0 || points < reward.point_cost
              return (
                <div
                  key={reward.reward_id}
                  className="bg-[#2a2a2a] rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between"
                >
                  <div>
                    <h3 className="text-[#A0C878] font-semibold text-base sm:text-lg">{reward.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-300 mb-2">{reward.description}</p>
                    <div className="text-xs sm:text-sm text-gray-400">
                      <p>
                        🔁 <span className="text-white font-bold">{reward.point_cost}</span> poin
                      </p>
                      <p>
                        📦 <span className="text-white font-bold">{reward.stock}</span> stok
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedReward(reward)
                      setShowConfirm(true)
                    }}
                    disabled={disabled}
                    className={`mt-4 sm:mt-0 px-4 sm:px-6 py-1.5 sm:py-2 rounded font-semibold text-sm ${
                      disabled
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-[#8BC34A] text-white hover:bg-[#7ab63e]"
                    }`}
                  >
                    {disabled ? (reward.stock === 0 ? "Out of Stock" : "Not Enough Points") : "Use"}
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        {/* Custom Modal Confirm */}
        {showConfirm && selectedReward && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white text-black rounded-md shadow-md w-[90%] max-w-md p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Konfirmasi Penukaran</h3>
              <p className="mb-4 text-sm sm:text-base">
                Apakah Anda yakin ingin menukar <strong>{selectedReward.name}</strong> dengan{" "}
                <strong>{selectedReward.point_cost}</strong> poin?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-black px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm"
                  onClick={() => setShowConfirm(false)}
                >
                  Batal
                </button>
                <button
                  className="bg-[#8BC34A] hover:bg-[#7ab63e] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded font-semibold text-sm"
                  onClick={handleRedeem}
                >
                  Ya, Tukar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded shadow-lg z-50 text-sm sm:text-base">
            {successMessage}
            <button className="ml-4 font-bold" onClick={() => setSuccessMessage("")}>
              ×
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default RewardsPage
