"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Gift, Home, User } from "lucide-react";

const RewardsPage = () => {
  const router = useRouter();
  const [rewards, setRewards] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [points, setPoints] = useState<number>(0);

  const fetchRewards = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/rewards?ts=${Date.now()}`);
      const data = await res.json();
      setRewards(data);
    } catch (err) {
      console.error("Error fetching rewards:", err);
    }
  };

  const fetchUserPoints = async (userId: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/users/${userId}/points?ts=${Date.now()}`);
      const data = await res.json();
      if (res.ok) setPoints(data.points);
    } catch (err) {
      console.error("Error fetching user points:", err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      fetchUserPoints(parsed.user_id);
    } else {
      router.push("/login");
    }
    fetchRewards();
  }, [router]);

  const handleRedeem = async (reward: any) => {
    if (!user) return;
    const confirmRedeem = window.confirm(`Tukar ${reward.name}?`);
    if (!confirmRedeem) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/rewards/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.user_id, reward_id: reward.reward_id }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error || "Gagal menukar reward");

      alert("Reward berhasil ditukar!");
      fetchUserPoints(user.user_id);
      fetchRewards();
    } catch (err) {
      alert("Terjadi kesalahan saat menukar reward");
    }
  };

  return (
    <div className="flex h-screen w-full max-w-[1440px] mx-auto bg-[#221E1E] font-[Inter] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] h-full flex flex-col">
        <div className="p-6 flex items-center gap-2 border-b border-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="#8BC34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
          <span className="font-bold text-xl">BountyHunter</span>
        </div>
        <nav className="flex-1 p-6">
          <ul className="space-y-6">
            <li className="flex items-center gap-3 hover:text-[#8BC34A] cursor-pointer" onClick={() => router.push("/dashboard")}> <Home className="w-5 h-5" /> Home </li>
            <li className="flex items-center gap-3 text-[#8BC34A] font-semibold cursor-pointer"> <Gift className="w-5 h-5" /> Rewards </li>
            <li className="flex items-center gap-3 hover:text-[#8BC34A] cursor-pointer" onClick={() => router.push("/disposals_history")}> <User className="w-5 h-5" /> Accounts </li>
          </ul>
        </nav>
        <div className="p-6 border-t border-gray-800 text-sm">@2025 II3240-K2-Kel9</div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#1a1a1a] overflow-y-auto">
        <header className="bg-[#8BC34A] p-4 text-white text-xl font-bold flex items-center gap-2"> <Gift className="w-6 h-6" /> Rewards </header>

        {/* Hero */}
        <section className="relative h-[200px] bg-cover bg-center px-6 py-8 text-white" style={{ backgroundImage: "url(/picture/reward-banner.jpg)" }}>
          <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold">Turn <span className="text-[#8BC34A]">Trash</span> Into <span className="text-[#8BC34A]">Treasure!</span></h1>
            <p className="mt-2 text-sm max-w-xl">Earn Reward Points By Recycling At Smart Bins And Redeem Them For Exciting Discounts, Vouchers, And Exclusive Deals!</p>
            <div className="absolute top-6 right-6 text-right">
              <h2 className="text-4xl font-bold text-[#8BC34A]">{points}</h2>
              <p className="text-sm">points</p>
            </div>
          </div>
        </section>

        {/* Reward List */}
        <section className="px-6 py-12">
          <h2 className="text-2xl font-bold mb-2">Browse Available <span className="text-[#8BC34A]">Rewards</span></h2>
          <p className="text-sm text-gray-300 mb-8">Explore All The Discounts And Gift Items You Can Redeem With Your Points.</p>

          <div className="space-y-4">
            {rewards.map((reward) => {
              const disabled = reward.stock === 0 || points < reward.point_cost;
              return (
                <div key={reward.reward_id} className="bg-[#2a2a2a] rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <h3 className="text-[#A0C878] font-semibold text-lg">{reward.name}</h3>
                    <p className="text-sm text-gray-300 mb-2">{reward.description}</p>
                    <div className="text-sm text-gray-400">
                      <p>🔁 <span className="text-white font-bold">{reward.point_cost}</span> poin</p>
                      <p>📦 <span className="text-white font-bold">{reward.stock}</span> stok</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={disabled}
                    className={`mt-4 sm:mt-0 px-6 py-2 rounded font-semibold ${
                      disabled
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-[#8BC34A] text-white hover:bg-[#7ab63e]"
                    }`}
                  >
                    {disabled ? (reward.stock === 0 ? "Out of Stock" : "Not Enough Points") : "Use"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default RewardsPage;
