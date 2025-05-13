"use client"

import { useEffect, useState } from "react"
import axios from "axios"

import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { StatCard } from "@/components/stat-card"
import { ChartCard } from "@/components/chart-card"
import { LineChartComponent } from "@/components/line-chart"
import { DonutChartComponent } from "@/components/donut-chart"

const API_BASE = "https://ii-3240-kel9-bounty-hunter.vercel.app/api"

export default function DashboardPage() {
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalBottles, setTotalBottles] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)

  // Dummy data (optional, replace with real chart data if available)
  const bottleData = [
    { date: "2023-03-19", value: 2.7 },
    { date: "2023-03-21", value: 4.5 },
    { date: "2023-03-23", value: 2.8 },
    { date: "2023-03-25", value: 1.2 },
    { date: "2023-03-27", value: 4.8 },
    { date: "2023-03-29", value: 2.7 },
    { date: "2023-03-31", value: 3.2 },
  ]

  const rewardData = [
    { name: "E-Wallet Credit", value: 26.1, color: "#8DD3C7" },
    { name: "Pulsa", value: 14.8, color: "#A6D854" },
    { name: "Voucher Makan", value: 34.8, color: "#FDB462" },
    { name: "Minuman Gratis", value: 8.7, color: "#BC80BD" },
    { name: "Merchandise", value: 17.4, color: "#80B1D3" },
  ]

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const [userRes, bottleRes, pointsRes] = await Promise.all([
        axios.get(`${API_BASE}/users/total`),
        axios.get(`${API_BASE}/disposal/total-weight`),
        axios.get(`${API_BASE}/users/total-points`)
      ])

      console.log("User API response:", userRes.data)         // 👈 debug log
      console.log("Bottle API response:", bottleRes.data)
      console.log("Points API response:", pointsRes.data)

      setTotalUsers(Number(userRes.data.total_users ?? 0))
      setTotalBottles(Number(bottleRes.data.total_bottle_count ?? 0))
      setTotalPoints(Number(pointsRes.data.total_points ?? 0))
    } catch (err) {
      console.error("Error fetching stats:", err)
    }
  }

  fetchStats()
}, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-64">
        <Navbar title="Dashboard" />

        <main className="p-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatCard value={totalUsers.toString()} label="Users" />
            <StatCard value={totalBottles.toString()} label="Bottles" />
            <StatCard value={totalPoints.toString()} label="Points" />
          </div>

          {/* Charts Row */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard title="Plastic Bottle Disposal Trend">
              <LineChartComponent data={bottleData} />
            </ChartCard>

            <ChartCard title="Reward Usage Statistics">
              <DonutChartComponent data={rewardData} />
            </ChartCard>
          </div>
        </main>
      </div>
    </div>
  )
}