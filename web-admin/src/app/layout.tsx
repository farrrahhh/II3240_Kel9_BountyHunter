import type React from "react"
import "@/app/globals.css"
import { Poppins } from "next/font/google"
import { ThemeProvider } from "../components/theme-provider"

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
})

export const metadata = {
  title: "Admin Login - Dashboard",
  description: "Admin login portal",
  icons: [
    {
      rel: "icon",
      url: "icons/icon-512x512.png",
    },
    {
      rel: "apple-touch-icon",
      url: "icons/icon-512x512.png",
    },
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
