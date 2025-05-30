"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Home, Gift, User, Trash2, Menu, X } from "lucide-react"
import { Footer } from "@/components/footer"
import Image from "next/image"

const Dashboard = () => {
  const router = useRouter()
  const [adminEmail, setAdminEmail] = useState("")
  const [points, setPoints] = useState<number | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [totalBottles, setTotalBottles] = useState<number | null>(null)

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin") || localStorage.getItem("user")
    if (!storedAdmin) {
      router.push("/login")
    } else {
      const parsed = JSON.parse(storedAdmin)
      setAdminEmail(parsed.email)

      fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/users/${parsed.user_id}/points`)
        .then((res) => {
          if (!res.ok) throw new Error("Gagal fetch points")
          return res.json()
        })
        .then((data) => setPoints(data.points))
        .catch((err) => console.error("Gagal mengambil poin:", err))

      fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/users/${parsed.user_id}/disposals`)
        .then((res) => {
          if (!res.ok) throw new Error("Gagal fetch disposals")
          return res.json()
        })
        .then((data) => {
          const total = data.reduce((acc: number, item: any) => acc + item.bottle_count, 0)
          setTotalBottles(total)
        })
        .catch((err) => console.error("Gagal mengambil botol:", err))
    }
  }, [router])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="flex flex-col h-screen w-full font-[Inter] text-white bg-[#221E1E]">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static w-64 bg-[#111111] h-full flex flex-col justify-between z-30 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div>
            {/* Logo */}
            <div className="p-6 flex items-center gap-2 border-b border-gray-800">
              <Image
                src= "/icons/icon-512x512.png"
                alt="BountyHunter Logo"
                width={32}
                height={32}
                priority
                className="rounded-full drop-shadow-lg shadow-[#a4d273]"  
              />  
              <span className="font-bold text-xl">BountyHunter</span>
              <button className="ml-auto lg:hidden" onClick={toggleSidebar}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-6 space-y-6">
              <div className="flex items-center gap-3 text-[#8BC34A] font-semibold cursor-pointer">
                <Home className="w-5 h-5" /> Home
              </div>
              <div
                className="flex items-center gap-3 cursor-pointer hover:text-[#8BC34A]"
                onClick={() => {
                  router.push("/rewards")
                  setSidebarOpen(false)
                }}
              >
                <Gift className="w-5 h-5" /> Rewards
              </div>
              <div
                className="flex items-center gap-3 cursor-pointer hover:text-[#8BC34A]"
                onClick={() => {
                  router.push("/disposals_history")
                  setSidebarOpen(false)
                }}
              >
                <Trash2 className="w-5 h-5" /> Riwayat Pembuangan
              </div>
            </nav>
          </div>

          {/* User Info */}
          <div
            className="p-6 border-t border-gray-800 cursor-pointer hover:opacity-80"
            onClick={() => {
              router.push("/users")
              setSidebarOpen(false)
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#8BC34A] flex items-center justify-center">
                <User className="w-4 h-4 text-black" />
              </div>
              <p className="text-sm font-medium truncate">{adminEmail}</p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col bg-[#1a1a1a] overflow-hidden">
          <div className="flex-grow overflow-y-auto">
            {/* Header */}
            <header className="bg-[#8BC34A] p-4 text-white text-xl font-bold flex items-center gap-2">
              <button className="lg:hidden mr-2" onClick={toggleSidebar}>
                <Menu className="w-6 h-6" />
              </button>
              <Home className="w-6 h-6" /> Home
            </header>

            {/* Hero Section */}
            <section
              className="relative bg-cover bg-center h-[250px] md:h-[300px] flex items-center justify-center"
              style={{ backgroundImage: "url(/picture/bottle.png)" }}
            >
              <div className="bg-black bg-opacity-60 p-4 md:p-6 rounded text-center w-[90%] max-w-md">
                <div className="text-3xl md:text-4xl font-bold text-[#8BC34A]">{totalBottles ?? "..."}</div>
                <p className="text-sm text-white">botol dibuang</p>
                <div className="text-3xl md:text-4xl font-bold text-[#8BC34A] mt-4">{points ?? "..."}</div>
                <p className="text-sm text-white">points</p>
                <h3 className="mt-4 font-bold text-[#8BC34A]">Scan. Drop. Earn. Repeat</h3>
                <p className="text-sm text-white">Smart Recycling Made Simple - And Rewarding.</p>
              </div>
            </section>

            {/* Testimonials */}
            <section className="py-8 md:py-16 px-4 md:px-6 bg-[#1a1a1a] text-white text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12">
                What Our <span className="text-[#8BC34A]">Users</span> Say
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
                {[
                  { id: 1, name: "J****", msg: "I Never Thought Recycling Could Be This Fun And Rewarding!" },
                  {
                    id: 2,
                    name: "N****",
                    msg: "It Feels Good To Know I'm Doing Something Meaningful, Even With Small Actions.",
                  },
                  {
                    id: 3,
                    name: "M****",
                    msg: "I Started Using It Just For Fun, But Now It's Part Of My Daily Routine.",
                  },
                ].map((user) => (
                  <div key={user.id} className="bg-[#222222] p-4 md:p-6 rounded-lg">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1a1a1a] mx-auto flex items-center justify-center mb-4">
                      <User className="text-[#8BC34A] w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <p className="text-[#8BC34A] font-bold mb-2">{user.name}</p>
                    <p className="text-white text-xs md:text-sm">"{user.msg}"</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  )
}

export default Dashboard
