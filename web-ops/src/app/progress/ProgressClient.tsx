"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Image from "next/image"
import mqtt from "mqtt"

const API_BASE = "http://localhost:3001/api"

export default function ProgressClient() {
  const router = useRouter()
  // get email from local storage
  const email = localStorage.getItem("email")

  const [bottleCount, setBottleCount] = useState(0)
  const [isStopped, setIsStopped] = useState(false)

  // Cek jika tidak ada email di URL, kembali ke halaman utama
  useEffect(() => {
    if (!email) {
      router.push("/")
    }
  }, [email, router])

  // Setup MQTT dan terima data
  useEffect(() => {
    const mqttClient = mqtt.connect("ws://broker.hivemq.com:8000/mqtt")
    console.log("Email from search params:", email)

    mqttClient.on("connect", () => {
      console.log("MQTT connected")
      mqttClient.subscribe("bountyhunter/scale", (err) => {
        if (err) console.error("Subscribe error:", err)
        else console.log("Subscribed to bountyhunter/scale")
      })
    })

    mqttClient.on("message", (_topic, message) => {
      const value = parseInt(message.toString())
      if (!isNaN(value) && !isStopped) {
        console.log("Received bottle count:", value)
        setBottleCount(value)
      }
    })

    return () => {
      mqttClient.end()
    }
  }, [email, isStopped])

  // Handle ketika user menekan tombol stop
  const handleStop = async () => {
    setIsStopped(true)

    try {
      const res = await axios.post(`${API_BASE}/disposal`, {
        email,
        bottle_count: bottleCount,
        trashbin_id: 6,
      })

      console.log("Disposal response:", res.data)
      alert("Data saved successfully!")
      // Redirect to the main page
      router.push("/")
      // set bottleCount(0)


    } catch (err) {
      console.error("Failed to save data:", err)
      alert("Failed to save data.")
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden text-white">
      <Image
        src="/images/bottle.png"
        alt="Plastic bottles background"
        className="object-cover brightness-[0.65] w-full h-full"
        fill
        priority
      />

      <div className="z-10 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-6xl font-bold mb-4">
          {bottleCount} {bottleCount === 1 ? "bottle" : "bottles"}
        </h1>
        <p className="text-xl text-[#a4d273] mb-10">
          Keep It Up! Small Act, Big Impact.
        </p>

        <button
          onClick={handleStop}
          disabled={isStopped}
          className="h-14 bg-[#d47575] hover:bg-[#c76464] text-white font-medium text-lg rounded-xl transition-colors w-1/2"
        >
          Stop!
        </button>
      </div>
    </main>
  )
}