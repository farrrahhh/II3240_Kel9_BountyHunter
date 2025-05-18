"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Image from "next/image"
import mqtt from "mqtt"

const API_BASE = "https://ii-3240-kel9-bounty-hunter-git-main-farahs-projects-d8079cf5.vercel.app/api"

export default function ProgressClient() {
  const router = useRouter()
  const email = typeof window !== "undefined" ? localStorage.getItem("email") : null

  const [bottleCount, setBottleCount] = useState(0)
  const [isStopped, setIsStopped] = useState(false)
  const mqttClientRef = useRef<any>(null)

  useEffect(() => {
    if (!email) router.push("/")
  }, [email, router])

  useEffect(() => {
    const clientId = "web_" + Math.random().toString(16).slice(2, 10)
    const mqttClient = mqtt.connect("ws://localhost:9001", {
      clientId,
      reconnectPeriod: 1000,
    })

    mqttClientRef.current = mqttClient

    mqttClient.on("connect", () => {
      console.log("✅ MQTT connected")
      mqttClient.subscribe("bountyhunter/scale", (err) => {
        if (err) console.error("❌ Subscribe error:", err)
        else console.log("📡 Subscribed to bountyhunter/scale")
      })
    })

    mqttClient.on("message", (_topic, message) => {
      const value = parseInt(message.toString())
      if (!isNaN(value) && !isStopped) {
        console.log("✅ Parsed bottle count:", value)
        setBottleCount(value)
      }
    })

    mqttClient.on("error", (err) => {
      console.error("💥 MQTT Error:", err)
    })

    return () => {
      mqttClient.end()
    }
  }, [isStopped])

  const handleStop = async () => {
    setIsStopped(true)

    try {
      await axios.post(`${API_BASE}/disposal`, {
        email,
        bottle_count: bottleCount,
        trashbin_id: 6,
      })

      // Kirim perintah reset via MQTT
      const mqttClient = mqttClientRef.current
      if (mqttClient && mqttClient.connected) {
        mqttClient.publish("bountyhunter/reset", "reset")
        console.log("🔁 Reset sent to ESP32")
      }

      alert("Data saved successfully!")
      router.push("/")
    } catch (err) {
      console.error("❌ Failed to save data:", err)
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