"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DisposalsHistory = () => {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user") || localStorage.getItem("admin");
    if (!stored) {
      router.push("/login");
    } else {
      const user = JSON.parse(stored);
      fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/users/${user.user_id}/disposals`)
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
    <div className="min-h-screen px-4 py-8 bg-gray-50 flex justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl w-full">
        <h1 className="text-2xl font-bold mb-4">Riwayat Pembuangan Botol</h1>
        <button
          className="mb-4 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
          onClick={() => router.push("/dashboard")}
        >
          ← Kembali ke Dashboard
        </button>

        {loading ? (
          <p>Memuat data...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-500">Belum ada riwayat pembuangan botol.</p>
        ) : (
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Tanggal</th>
                <th className="p-2 border">Trashbin ID</th>
                <th className="p-2 border">Jumlah Botol</th>
                <th className="p-2 border">Poin</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.disposal_id}>
                  <td className="p-2 border">{new Date(item.created_at).toLocaleString("id-ID")}</td>
                  <td className="p-2 border">{item.trashbin_id}</td>
                  <td className="p-2 border">{item.bottle_count}</td>
                  <td className="p-2 border">{item.points_earned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DisposalsHistory;