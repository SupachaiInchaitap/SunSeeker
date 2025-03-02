"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const updatePassword = async () => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully. Redirecting...");
      setTimeout(() => router.push("/"), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 flex flex-col items-center p-6">
      <h1 className="text-3xl font-medium text-gray-800 mb-6">Update Password</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <label className="block mb-2 text-gray-700">New Password</label>
        <input
          type="password"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={updatePassword}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Update Password
        </button>
      </div>

      {message && <p className="text-center text-gray-700 mt-4">{message}</p>}
    </div>
  );
}
