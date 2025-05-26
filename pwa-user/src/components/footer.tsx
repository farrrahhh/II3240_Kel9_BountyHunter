"use client";

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
    return (
        <footer className="bg-[#111111] py-8 mt-auto md:px-10 lg:px-20">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
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
                <div className="text-sm text-gray-400">©2025 II3240-K2-Kel9</div>
            </div>
        </footer>
    );
}