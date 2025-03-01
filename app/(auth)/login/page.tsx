"use client";

import { useState } from "react";
import { login } from "@/app/(auth)/function/action";
import Link from "next/link"; // Import Link for navigation
import { AiOutlineArrowLeft } from "react-icons/ai"; // Importing a back arrow icon

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="flex flex-grow justify-center items-center px-6 py-10">
        <div className="w-full md:w-1/3 bg-white rounded-3xl shadow-lg p-6 border-t-4 border-blue-400">
          <Link href="/" className="absolute top-6 left-6 text-gray-700 hover:text-blue-500">
            <AiOutlineArrowLeft size={24} />
          </Link>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-xl shadow-sm"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-xl shadow-sm"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-xl font-semibold hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-4 text-gray-700">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
