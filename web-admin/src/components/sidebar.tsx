"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { PieChart, BarChart3, Users, LogOut } from "lucide-react"

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: PieChart,
  },
  {
    title: "Rewards",
    href: "/rewards",
    icon: BarChart3,
  },
  {
    title: "Accounts",
    href: "/accounts",
    icon: Users,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    
    router.push("/")
  }

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-black text-white flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 p-6">
          <Image
            src= "/icons/icon-512x512.png"
            alt="BountyHunter Logo"
            width={32}
            height={32}
            priority
            className="rounded-full drop-shadow-lg shadow-[#a4d273] hover:scale-105 transition-transform duration-300 ease-in-out"  
          />
          <span className="text-xl font-bold">BountyHunter</span>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 rounded-md px-4 py-3 transition-colors",
                      isActive ? "text-white" : "text-gray-400 hover:text-white"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive && "text-[#A6CE39]")} />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 p-4 m-4 rounded-md text-red-400 hover:text-white hover:bg-red-500 transition-colors"
      >
        <LogOut className="h-5 w-5" />
        <span className="font-medium">Log out</span>
      </button>
    </div>
  )
}