"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Gift, Home, User, Eye, EyeOff, Trash2 } from "lucide-react";

const UserPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => setShowMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const handleResetPassword = async () => {
    setShowMessage(false);
    setMessage("");
    setIsError(false);

    if (!newPassword || !confirmPassword) {
      setIsError(true);
      setMessage("Semua field wajib diisi");
      setShowMessage(true);
      return;
    }

    if (newPassword.length < 6) {
      setIsError(true);
      setMessage("Password minimal 6 karakter");
      setShowMessage(true);
      return;
    }

    if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setIsError(true);
      setMessage("Password harus mengandung huruf dan angka");
      setShowMessage(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setIsError(true);
      setMessage("Password dan konfirmasi tidak sama");
      setShowMessage(true);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/users/${user.user_id}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setIsError(true);
        setMessage(data.error || "Gagal mengganti password");
        setShowMessage(true);
      } else {
        setMessage("Password berhasil diperbarui");
        setShowMessage(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500); // 1.5 detik delay agar user sempat melihat pesan sukses
      }
    } catch (err) {
      setIsError(true);
      setMessage("Terjadi kesalahan koneksi");
      setShowMessage(true);
    }
  };

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
              <li className="flex items-center gap-3 hover:text-[#8BC34A] cursor-pointer" onClick={() => router.push("/dashboard")}>
                <Home className="w-5 h-5" /> Home
              </li>
              <li className="flex items-center gap-3 hover:text-[#8BC34A] cursor-pointer" onClick={() => router.push("/rewards")}>
                <Gift className="w-5 h-5" /> Rewards
              </li>
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#8BC34A] transition-colors" onClick={() => router.push("/disposals_history")}>
                <Trash2 className="w-5 h-5" /> Riwayat Pembuangan
              </li>
            </ul>
          </nav>
        </div>

        <div className="p-6 border-t border-gray-800 cursor-pointer hover:opacity-80" onClick={() => router.push("/users")}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#8BC34A] flex items-center justify-center">
              <User className="w-4 h-4 text-black" />
            </div>
            <p className="text-sm font-medium truncate">{user?.email}</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-[#1a1a1a] overflow-y-auto">
        <header className="bg-[#8BC34A] p-4 text-white text-xl font-bold flex items-center gap-2">
          <User className="w-6 h-6" /> Pengaturan Akun
        </header>

        <div className="p-10 pl-16">
          {showMessage && (
            <div className={`mb-6 w-full max-w-md py-2 px-4 rounded-md shadow ${isError ? "bg-red-100 text-red-700 border border-red-400" : "bg-green-100 text-green-700 border border-green-400"}`}>
              {message}
            </div>
          )}

          {/* New Password */}
          <div className="mb-6">
            <label className="block mb-2 text-[#A0C878] font-semibold">Password Baru</label>
            <div className="relative w-[400px]">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full py-2 px-4 bg-white text-black rounded-md border border-gray-300 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block mb-2 text-[#A0C878] font-semibold">Konfirmasi Password Baru</label>
            <div className="relative w-[400px]">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-2 px-4 bg-white text-black rounded-md border border-gray-300 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleResetPassword}
            className="bg-[#8BC34A] hover:bg-[#7ab63e] text-white px-6 py-2 rounded-md font-medium transition-colors w-60"
          >
            Simpan Password
          </button>

          <div className="mt-70">
            <button
              onClick={() => {
                localStorage.removeItem("user");
                router.push("/login");
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-medium transition-colors w-40"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserPage;