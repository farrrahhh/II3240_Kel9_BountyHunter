"use client"

import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { StatCard } from "@/components/stat-card"
import { ChartCard } from "@/components/chart-card"
import { LineChartComponent } from "@/components/line-chart"
import { DonutChartComponent } from "@/components/donut-chart"

// Sample data for charts
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



export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
      />

      <div className="ml-64">
        <Navbar title="Dashboard" />

        <main className="p-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatCard value="100" label="users" />
            <StatCard value="67,587" label="kg bottles" />
            <StatCard value="1.093" label="points" />
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