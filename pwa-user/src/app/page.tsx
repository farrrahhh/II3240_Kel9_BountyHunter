import { Gift, Globe, Rocket } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function BountyHunterLanding() {
  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-white">
      {/* Navigation */}
      <header className="flex items-center justify-between p-4 md:px-10 lg:px-20">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8BC34A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-leaf"
          >
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
          <span className="font-bold text-lg">BountyHunter</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          {/* <Link href="#" className="text-[#8BC34A] hover:text-[#a4d967]">
            Home
          </Link>
          <Link href="#" className="text-white hover:text-[#a4d967]">
            Rewards
          </Link> */}
        </nav>
        <Link href="/login">
        <button className="bg-[#8BC34A] hover:bg-[#6fa536] text-white font-bold px-4 py-2 rounded-md transition-colors">
            Log In
        </button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="/picture/bottle.png"
            alt="Plastic bottles collection for recycling"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            Welcome To <span className="text-[#8BC34A]">BountyHunter</span> !
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Turn Your Plastic Bottles Into Points</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Recycle, Earn Rewards, And Make A Real Impact—
            <br />
            One Bottle At A Time
          </p>
        <Link href="/login">
        <button className="bg-[#8BC34A] hover:bg-[#6fa536] text-white font-bold px-4 py-2 rounded-md transition-colors">
            Join Now!
        </button>
        </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[#1a1a1a] py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How It <span className="text-[#8BC34A]">Works</span>
          </h2>

          <div className="relative">
            {/* Path Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-[#8BC34A] -translate-x-1/2 z-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-[#8BC34A] bg-[#1a1a1a]"></div>
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-[#8BC34A] bg-[#1a1a1a]"></div>
              <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-[#8BC34A] bg-[#1a1a1a]"></div>
            </div>

            {/* Steps */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-16">
              {/* Step 1 */}
              <div className="md:col-start-2 relative z-10">
                <h3 className="text-xl font-bold mb-2">
                  Step 1: <span className="text-[#8BC34A]">Scan Your Bottle</span>
                </h3>
                <p className="text-gray-300">
                  Use The App Or The Smart Bin Scanner To Scan The QR Code On Your Plastic Bottle.
                </p>
              </div>
              <div className="md:col-start-1 md:row-start-2 md:text-right relative z-10">
                <h3 className="text-xl font-bold mb-2">
                  Step 2: <span className="text-[#8BC34A]">Drop It In</span>
                </h3>
                <p className="text-gray-300">
                  Place Your Scanned Bottle Into The Smart Bin—Make Sure It's Empty And Clean!
                </p>
              </div>
              <div className="md:col-start-2 md:row-start-3 relative z-10">
                <h3 className="text-xl font-bold mb-2">
                  Step 3: <span className="text-[#8BC34A]">Earn Points Instantly</span>
                </h3>
                <p className="text-gray-300">
                  Get Points Right Away Based On The Bottle's Weight. Redeem Them For Rewards Or Discounts!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Join <span className="text-[#8BC34A]">BountyHunter?</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-[#222222] p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-[#8BC34A] w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#8BC34A] mb-2">Eco-Friendly Impact</h3>
              <p className="text-gray-300 mb-4">
                Help Reduce Plastic Waste And Protect The Environment With Every Bottle You Recycle
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#222222] p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="text-[#8BC34A] w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#8BC34A] mb-2">Earn Exciting Rewards</h3>
              <p className="text-gray-300 mb-4">
                Get Rewarded With Points You Can Exchange For Discounts, Gift Cards, And Green Products
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#222222] p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="text-[#8BC34A] w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#8BC34A] mb-2">Easy And Convenient</h3>
              <p className="text-gray-300 mb-4">Recycle In Seconds Using Smart Bins And A Simple, User-Friendly App</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            What Our <span className="text-[#8BC34A]">Users</span> Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-[#222222] p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8BC34A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-user"
                >
                  <circle cx="12" cy="8" r="5" />
                  <path d="M20 21a8 8 0 0 0-16 0" />
                </svg>
              </div>
              <p className="text-[#8BC34A] mb-4">J****</p>
              <p className="text-gray-300 mb-4">"I Never Thought Recycling Could Be This Fun And Rewarding!"</p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-[#222222] p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8BC34A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-user"
                >
                  <circle cx="12" cy="8" r="5" />
                  <path d="M20 21a8 8 0 0 0-16 0" />
                </svg>
              </div>
              <p className="text-[#8BC34A] mb-4">N****</p>
              <p className="text-gray-300 mb-4">
                "It Feels Good To Know I'm Doing Something Meaningful, Even With Small Actions."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-[#222222] p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8BC34A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-user"
                >
                  <circle cx="12" cy="8" r="5" />
                  <path d="M20 21a8 8 0 0 0-16 0" />
                </svg>
              </div>
              <p className="text-[#8BC34A] mb-4">M****</p>
              <p className="text-gray-300 mb-4">
                "I Started Using It Just For Fun, But Now It's Part Of My Daily Routine."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center md:justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8BC34A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-leaf"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
            <span className="font-bold">BountyHunter</span>
          </div>
          <div className="text-sm text-gray-400">©2025 H3240-K3-Kel9</div>
        </div>
      </footer>
    </div>
  )
}
