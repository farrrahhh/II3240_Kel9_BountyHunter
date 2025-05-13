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

interface DisposalData {
  period: string
  total_bottles: number
}

interface RewardData {
  name: string
  total_redemptions: number
}

interface DonutChartData {
  name: string
  value: number
  color: string
}

export default function DashboardPage() {
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalBottles, setTotalBottles] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [disposalTrend, setDisposalTrend] = useState<{ date: string; value: number }[]>([])
  const [rewardUsage, setRewardUsage] = useState<DonutChartData[]>([])

  const [period, setPeriod] = useState("day")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userRes, bottleRes, pointsRes] = await Promise.all([
          axios.get(`${API_BASE}/users/total`),
          axios.get(`${API_BASE}/disposal/total-bottles`),
          axios.get(`${API_BASE}/users/total-points`),
        ])

        setTotalUsers(Number(userRes.data.total_users ?? 0))
        setTotalBottles(Number(bottleRes.data.total_bottle_count ?? 0))
        setTotalPoints(Number(pointsRes.data.total_points ?? 0))
      } catch (err) {
        console.error("Error fetching stats:", err)
      }
    }

    fetchStats()
  }, [])

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const disposalRes = await axios.get<DisposalData[]>(`${API_BASE}/disposal/trend?period=${period}`)
        const rewardRes = await axios.get<RewardData[]>(`${API_BASE}/rewards/leaderboard?period=${period}`)

        const formattedDisposal = disposalRes.data.map((row) => ({
          date: row.period.split("T")[0],
          value: Number(row.total_bottles),
        }))

        const colors = [
          "#8DD3C7", "#FDB462", "#B3DE69", "#FCCDE5", "#D9D9D9", "#BC80BD", "#FFED6F",
          "#80B1D3", "#FB8072", "#CCEBC5", "#BEBADA", "#FFB3B3", "#E5D8BD", "#999999",
          "#A6D854", "#FFD92F", "#E78AC3", "#66C2A5", "#FC8D62", "#1F78B4"
        ]

        const grouped: DonutChartData[] = []
        rewardRes.data.forEach((item, idx) => {
          const existing = grouped.find((x) => x.name === item.name)
          if (existing) {
            existing.value += Number(item.total_redemptions)
          } else {
            grouped.push({
              name: item.name,
              value: Number(item.total_redemptions),
              color: colors[idx % colors.length],
            })
          }
        })

        setDisposalTrend(formattedDisposal.reverse())
        setRewardUsage(grouped)
      } catch (err) {
        console.error("Error fetching chart data:", err)
      }
    }

    fetchChartData()
  }, [period])

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-64">
        <Navbar title="Dashboard" />

        <main className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatCard value={totalUsers.toString()} label="Users" />
            <StatCard value={totalBottles.toString()} label="Bottles" />
            <StatCard value={totalPoints.toString()} label="Points" />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard title="Plastic Bottle Disposal Trend" defaultFilter={period} onFilterChange={setPeriod}>
              <LineChartComponent data={disposalTrend} />
            </ChartCard>

            <ChartCard title="Reward Usage Statistics" defaultFilter={period} onFilterChange={setPeriod}>
              <DonutChartComponent data={rewardUsage} />
            </ChartCard>
          </div>
        </main>
      </div>
    </div>
  )
}