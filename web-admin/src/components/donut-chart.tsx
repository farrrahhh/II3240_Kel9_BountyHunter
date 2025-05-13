"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface DonutChartProps {
  data: {
    name: string
    value: number
    color: string
  }[]
}

export function DonutChartComponent({ data }: DonutChartProps) {
  // Hanya ambil data yang bernilai > 0
  const filteredData = data.filter((entry) => entry.value > 0)

  return (
    <div className="w-full">
      {/* Donut Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
        {filteredData.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span
              className="block w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></span>
            <span className="text-gray-600">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}