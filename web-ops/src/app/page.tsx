// app/page.tsx
import Image from "next/image"
import EmailForm from "../components/email-form"

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bottle.png"
          alt="Plastic bottles background"
          fill
          priority
          className="object-cover brightness-[0.65]"
        />
      </div>

      {/* Content */}
      <div className="z-10 flex w-full max-w-3xl flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-2">BountyHunter</h1>
        <p className="text-xl md:text-2xl font-medium text-[#a4d273] mb-10">More Bottles, More Rewards!</p>

        <EmailForm />
      </div>
    </main>
  )
}