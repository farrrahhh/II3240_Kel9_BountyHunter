"use client";

import Link from 'next/link';
import Image from 'next/image';

export function Header() {
    return (
        <header className="flex items-center justify-between p-4 md:px-10 lg:px-20 ">
            <div className="flex items-center gap-2">
            <Link href="/" className="hover:scale-105 transition-transform duration-300 ease-in-out">
                <div className="flex items-center gap-4">
                    <Image
                        src= "/icons/icon-512x512.png"
                        alt="BountyHunter Logo"
                        width={32}
                        height={32}
                        priority
                        className="rounded-full drop-shadow-lg shadow-[#a4d273]"  

                    />
                    <span className="font-bold text-white text-lg">BountyHunter</span>
                </div>  
                </Link>
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
    )
}