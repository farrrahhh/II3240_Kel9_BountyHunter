"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin") || localStorage.getItem("user");
    if (!storedAdmin) {
      router.push("/login"); // Redirect kalau belum login
    } else {
      const parsed = JSON.parse(storedAdmin);
      setAdminEmail(parsed.email);
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full text-center">
        <h1 className="text-2xl font-semibold text-gray-600 mb-2">Welcome to BountyHunter</h1>
        <h2 className="text-3xl font-bold mb-4">Selamat datang di Dashboard</h2>
        <p className="text-lg text-gray-700 mb-6">
          Login sebagai: <strong>{adminEmail}</strong>
        </p>

        {/* Tombol menuju riwayat pembuangan */}
        <button
          onClick={() => router.push("/disposals_history")}
          className="mb-3 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Lihat Riwayat Pembuangan
        </button>


        {/* Tombol menuju riwayat pembuangan */}
        <button
          onClick={() => router.push("/rewards")}
          className="mb-3 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Lihat Rewards yang Tersedia
        </button>

        {/* Tombol logout */}
        <button
          onClick={() => {
            localStorage.removeItem("admin");
            localStorage.removeItem("user");
            router.push("/login");
          }}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;