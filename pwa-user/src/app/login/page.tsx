"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login gagal");
      setSuccess("");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    setSuccess("Login berhasil");
    setError("");
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
      router.push("/dashboard");
    }, 1000);
  } catch (err) {
    console.error(err);
    setError("Terjadi kesalahan koneksi");
    setSuccess("");
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
      }
  };

  return (
    <div className="relative w-full max-w-[1440px] min-h-screen py-10 bg-[#221E1E] font-[Inter] text-black mx-auto">
      {/* Header Branding */}
      <div className="absolute top-6 left-6 flex items-center gap-2 text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
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
        <span className="font-bold text-xl">BountyHunter</span>
      </div>

      {/* Side Image */}
      <div className="absolute w-[688px] h-[750px] top-[70px] left-0 overflow-hidden rounded-l-lg bg-[#221E1E]">
        <img
          src="/picture/image 8.png"
          alt="Background"
          className="object-cover opacity-40"
        />
        <div className="absolute w-full h-full bg-black bg-opacity-20"></div>
        <p className="absolute w-[544px] top-[615px] left-[93px] text-white text-[24px] font-semibold italic capitalize leading-[36px] z-10">
          🌿 “Clean Earth, Bright Future.” Join the mission. Make every login count.
        </p>
      </div>

      {/* Form Section */}
      <div className="absolute top-[70px] left-[688px] w-[752px] h-[750px] bg-white">
        <h1 className="absolute top-[100px] left-[56px] text-[36px] text-[#A0C878] font-bold capitalize">
          Welcome Back, Earth Guardian!
        </h1>
        <p className="absolute top-[197px] left-[56px] text-[20px] font-bold text-black capitalize">
          Log in to continue your mission! 🤩
        </p>

        <form onSubmit={handleSubmit}>
          <label className="absolute top-[268px] left-[56px] text-[#A0C878] text-[20px] font-bold capitalize">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="absolute top-[311px] left-[56px] w-[527px] h-[56px] border-2 border-[#333] rounded-[10px] px-4 text-black"
          />

          <label className="absolute top-[382px] left-[56px] text-[#A0C878] text-[20px] font-bold capitalize">
            Password
          </label>
          <div className="absolute top-[425px] left-[56px] w-[527px] h-[56px] border-2 border-[#333] rounded-[10px] flex items-center px-4">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex-grow bg-transparent outline-none text-black"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

            {showMessage && (
                <div className={`absolute top-[600px] left-[56px] w-[527px] py-2 px-4 rounded-md shadow transition-all duration-300
                  ${error ? "bg-red-100 text-red-700 border border-red-400" : "bg-green-100 text-green-700 border border-green-400"}`}>
                  {error || success}
                </div>
              )}

          <button
            type="submit"
            className="absolute top-[520px] right-[150px] transform -translate-x-1/2 w-[288px] h-[56px] bg-[#A0C878] hover:bg-[#6fa536] rounded-[10px] text-white text-[24px] font-bold capitalize transition-colors"
          >
            Log In
          </button>

          <p className="absolute top-[660px] left-[185px] text-black text-[20px] font-medium capitalize">
            Don’t have an account?{" "}
            <a href="/register" className="text-green-600 hover:underline">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;