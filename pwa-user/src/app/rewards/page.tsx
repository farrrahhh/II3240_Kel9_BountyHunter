"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Reward = {
  reward_id: number;
  name: string;
  description: string;
  point_cost: number;
  stock: number;
  created_at: string;
};

const RewardsPage = () => {
  const router = useRouter();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchRewards = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/rewards?ts=${Date.now()}`, {
      headers: {
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRewards(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching rewards:", err);
        setLoading(false);
      });
  };

  const fetchUserPoints = async (userId: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/users/${userId}/points?ts=${Date.now()}`
      );
      const data = await res.json();
      if (res.ok && user) {
        const updatedUser = { ...user, points: data.points };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Error fetching user points:", err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUserPoints(parsedUser.user_id); // fetch poin terbaru
    } else {
      router.push("/login");
    }

    fetchRewards();
  }, [router]);

  const handleRedeem = async (reward: Reward) => {
    if (!user) return;

    const confirm = window.confirm(`Apakah Anda yakin ingin menukar ${reward.name}?`);
    if (!confirm) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/rewards/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          reward_id: reward.reward_id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Penukaran gagal");
        return;
      }

      // ✅ Update poin user dari response
      const updatedUser = { ...user, points: data.new_points };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Reward berhasil ditukar!");

      fetchRewards(); // Refresh stok reward
    } catch (err) {
      console.error("Redeem error:", err);
      alert("Terjadi kesalahan saat menukar reward");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Daftar Reward</h1>
            {user && (
              <p className="text-gray-600 text-sm">
                Poin Anda: <strong>{user.points}</strong>
              </p>
            )}
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            ← Kembali ke Dashboard
          </button>
          <button
            onClick={() => router.push("/rewards_history")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            ← Lihat penukaran reward
          </button>
        </div>
          <button 
          onClick={() => user?.user_id && fetchUserPoints(user.user_id)}
          className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
        >
          Refresh Poin
        </button>

        {loading ? (
          <p className="text-center">Memuat rewards...</p>
        ) : rewards.length === 0 ? (
          <p className="text-center text-gray-600">Tidak ada reward tersedia saat ini.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rewards.map((reward) => {
              const disabled = reward.stock === 0 || user.points < reward.point_cost;
              return (
                <div
                  key={reward.reward_id}
                  className="bg-white shadow-md p-4 rounded border border-gray-200"
                >
                  <h2 className="text-lg font-semibold mb-1">{reward.name}</h2>
                  <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                  <p className="text-sm">🔁 Poin: <strong>{reward.point_cost}</strong></p>
                  <p className="text-sm">📦 Stok: <strong>{reward.stock}</strong></p>

                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={disabled}
                    className={`w-full mt-3 py-2 rounded ${
                      disabled
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {reward.stock === 0
                      ? "Stok Habis"
                      : user.points < reward.point_cost
                      ? "Poin Tidak Cukup"
                      : "Tukar"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsPage;