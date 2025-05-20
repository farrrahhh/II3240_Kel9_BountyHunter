"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Gift, Home, User, Trash2 } from "lucide-react";

const DisposalsHistory = () => {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user") || localStorage.getItem("admin");
    if (!stored) {
      router.push("/login");
    } else {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/users/${parsed.user_id}/disposals`)
        .then((res) => res.json())
        .then((data) => {
          setHistory(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Gagal fetch history", err);
          setLoading(false);
        });
    }
  }, [router]);

  return (
    <div className="flex h-screen w-full max-w-[1440px] mx-auto bg-[#221E1E] font-[Inter] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] h-full flex flex-col justify-between">
        <div>
          <div className="p-6 flex items-center gap-2 border-b border-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
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
            <span className="font-bold text-xl">BountyHunter</span>
          </div>
          <nav className="p-6">
            <ul className="space-y-6">
              <li className="flex items-center gap-3 hover:text-[#8BC34A] cursor-pointer transition-colors" onClick={() => router.push("/dashboard")}>
                <Home className="w-5 h-5" /> Home
              </li>
              <li className="flex items-center gap-3 hover:text-[#8BC34A] cursor-pointer transition-colors" onClick={() => router.push("/rewards")}>
                <Gift className="w-5 h-5" /> Rewards
              </li>
              <li className="flex items-center gap-3 text-[#8BC34A] font-semibold cursor-pointer">
                <Trash2 className="w-5 h-5" /> Riwayat Pembuangan
              </li>
            </ul>
          </nav>
        </div>

        <div
          className="p-6 border-t border-gray-800 cursor-pointer hover:opacity-80 transition"
          onClick={() => router.push("/users")}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#8BC34A] flex items-center justify-center">
              <User className="w-4 h-4 text-black" />
            </div>
            <p className="text-sm font-medium truncate">{user?.email}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#1a1a1a] overflow-y-auto">
        <header className="bg-[#8BC34A] p-4 text-white text-xl font-bold flex items-center gap-2">
          <Trash2 className="w-6 h-6" /> Riwayat Pembuangan
        </header>

        <div className="p-8">
          {loading ? (
            <p className="text-gray-300">Memuat data...</p>
          ) : history.length === 0 ? (
            <p className="text-gray-400">Belum ada riwayat pembuangan botol.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm bg-[#2a2a2a] border border-gray-700 rounded">
                <thead className="bg-[#333333] text-[#A0C878]">
                  <tr>
                    <th className="p-3 border border-gray-600">Tanggal</th>
                    <th className="p-3 border border-gray-600">Trashbin ID</th>
                    <th className="p-3 border border-gray-600">Jumlah Botol</th>
                    <th className="p-3 border border-gray-600">Poin</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.disposal_id} className="hover:bg-[#3a3a3a]">
                      <td className="p-3 border border-gray-600">{new Date(item.created_at).toLocaleString("id-ID")}</td>
                      <td className="p-3 border border-gray-600">{item.trashbin_id}</td>
                      <td className="p-3 border border-gray-600">{item.bottle_count}</td>
                      <td className="p-3 border border-gray-600">{item.points_earned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DisposalsHistory;
