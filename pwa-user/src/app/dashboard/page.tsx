"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Home, Gift, User, Trash2 } from "lucide-react"

const Dashboard = () => {
  const router = useRouter()
  const [adminEmail, setAdminEmail] = useState("")
  const [points, setPoints] = useState<number | null>(null)

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
    }
  }, [router])

  return (
    <div className="flex h-screen w-full max-w-[1440px] mx-auto bg-[#221E1E] font-[Inter] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] h-full flex flex-col justify-between">
        <div>
          {/* Logo */}
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
          </div>

          {/* Navigation */}
          <nav className="p-6">
            <ul className="space-y-6">
              <li>
                <div className="flex items-center gap-3 text-[#8BC34A] font-semibold cursor-pointer">
                  <Home className="w-5 h-5" /> Home
                </div>
              </li>
              <li>
                <div
                  className="flex items-center gap-3 cursor-pointer hover:text-[#8BC34A] transition-colors"
                  onClick={() => router.push("/rewards")}
                >
                  <Gift className="w-5 h-5" /> Rewards
                </div>
              </li>
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#8BC34A] transition-colors"  onClick={() => router.push("/disposals_history")}>
                <Trash2 className="w-5 h-5" /> Riwayat Pembuangan
              </li>
            </ul>
          </nav>
        </div>

        {/* User Icon Only */}
        <div
          className="p-6 border-t border-gray-800 cursor-pointer hover:opacity-80 transition"
          onClick={() => router.push("/users")}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#8BC34A] flex items-center justify-center">
              <User className="w-4 h-4 text-black" />
            </div>
            <p className="text-sm font-medium truncate">{adminEmail}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#1a1a1a] overflow-y-auto">
        {/* Header */}
        <header className="bg-[#8BC34A] p-4 text-white text-xl font-bold flex items-center gap-2">
          <Home className="w-6 h-6" /> Home
        </header>

        {/* Hero Section */}
        <section
          className="relative bg-cover bg-center h-[300px] flex items-center justify-center"
          style={{ backgroundImage: "url(/picture/bottle.png)" }}
        >
          <div className="bg-black bg-opacity-60 p-6 rounded text-center">
            <div className="text-4xl font-bold text-[#8BC34A]">520</div>
            <p className="text-sm text-white">kg bottles</p>
            <div className="text-4xl font-bold text-[#8BC34A] mt-4">{points ?? "..."}</div>
            <p className="text-sm text-white">points</p>
            <h3 className="mt-4 font-bold text-[#8BC34A]">Scan. Drop. Earn. Repeat</h3>
            <p className="text-sm text-white">Smart Recycling Made Simple - And Rewarding.</p>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-6 bg-[#1a1a1a] text-white text-center">
          <h2 className="text-3xl font-bold mb-12">
            What Our <span className="text-[#8BC34A]">Users</span> Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { id: 1, name: "J****", msg: "I Never Thought Recycling Could Be This Fun And Rewarding!" },
              {
                id: 2,
                name: "N****",
                msg: "It Feels Good To Know I'm Doing Something Meaningful, Even With Small Actions.",
              },
              { id: 3, name: "M****", msg: "I Started Using It Just For Fun, But Now It's Part Of My Daily Routine." },
            ].map((user) => (
              <div key={user.id} className="bg-[#222222] p-6 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-[#1a1a1a] mx-auto flex items-center justify-center mb-4">
                  <User className="text-[#8BC34A]" />
                </div>
                <p className="text-[#8BC34A] font-bold mb-2">{user.name}</p>
                <p className="text-white text-sm">"{user.msg}"</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard;