"use client"

import type React from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartCardProps {
  title: string
  children: React.ReactNode
  filterOptions?: string[]
  defaultFilter?: string
  onFilterChange?: (value: string) => void
}

export function ChartCard({
  title,
  children,
  filterOptions = ["Day", "Week", "Month", "Year"],
  defaultFilter = "Day",
  onFilterChange,
}: ChartCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Select defaultValue={defaultFilter} onValueChange={onFilterChange}>
          <SelectTrigger className="w-24 bg-[#333333] text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  )
}
