"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Gift, Home, User, Trash2, Menu, X } from "lucide-react"

const RedemptionHistoryPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)

    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/rewards/redemptions/${parsedUser.user_id}?ts=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching history:", err)
        setLoading(false)
      })
  }, [router])

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
                <div
                  className="flex items-center gap-3 text-[#8BC34A] font-semibold cursor-pointer"
                  onClick={() => {
                    router.push("/rewards")
                    setSidebarOpen(false)
                  }}
                >
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

        {/* User Profile */}
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
          <Gift className="w-6 h-6" /> Riwayat Penukaran Reward
        </header>

        <section className="py-6 sm:py-10 px-4 sm:px-6">
          {loading ? (
            <p className="text-center text-white">Memuat data...</p>
          ) : history.length === 0 ? (
            <p className="text-center text-gray-400">Belum ada riwayat penukaran reward.</p>
          ) : (
            <ul className="space-y-4 max-w-3xl mx-auto">
              {history.map((item, index) => {
                const date = new Date(item.created_at)
                const formattedDate = date.toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })

                return (
                  <li key={index} className="bg-[#2a2a2a] p-4 rounded shadow border border-gray-600">
                    <p className="font-semibold text-[#A0C878] text-base sm:text-lg">🎁 {item.reward_name}</p>
                    <p className="text-xs sm:text-sm text-gray-300">Ditukar pada: {formattedDate}</p>
                    <p className="text-xs sm:text-sm text-white">
                      Poin digunakan: <strong>{item.point_cost}</strong>
                    </p>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

export default RedemptionHistoryPage
