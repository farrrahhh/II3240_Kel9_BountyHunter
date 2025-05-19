"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Redemption = {
  reward_name: string;
  point_cost: number;
  created_at: string;
};

const RedemptionHistoryPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/rewards/redemptions/${parsedUser.user_id}?ts=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching history:", err);
        setLoading(false);
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
      <div className="max-w-3xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Riwayat Penukaran Reward</h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ← Kembali ke Dashboard
          </button>
        </div>

        {loading ? (
          <p className="text-center">Memuat data...</p>
        ) : history.length === 0 ? (
          <p className="text-center text-gray-600">Belum ada riwayat penukaran reward.</p>
        ) : (
          <ul className="space-y-4">
            {history.map((item, index) => {
              const date = new Date(item.created_at);
              const formattedDate = date.toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <li key={index} className="bg-white p-4 rounded shadow-sm border">
                  <p className="font-medium">
                    🎁 {item.reward_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Ditukar pada: {formattedDate}
                  </p>
                  <p className="text-sm text-gray-700">Poin digunakan: <strong>{item.point_cost}</strong></p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RedemptionHistoryPage;