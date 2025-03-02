"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [newUsername, setNewUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const updateUsername = async () => {
    const res = await fetch("/auth/update-username", {
      method: "POST",
      body: JSON.stringify({ newUsername }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setMessage(data.error || "Username updated successfully!");
  };

  const requestPasswordReset = async () => {
    const res = await fetch("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setMessage(data.error || "Password reset email sent!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 flex flex-col items-center p-6 space-y-6">
      <h1 className="text-3xl font-medium text-gray-800">Settings</h1>

      <div className="flex flex-col space-y-4 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium text-gray-700">Update Username</h2>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="New username"
          className="border p-2 rounded-md"
        />
        <button onClick={updateUsername} className="bg-blue-500 text-white p-2 rounded-md">
          Update Username
        </button>
      </div>

      <div className="flex flex-col space-y-4 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium text-gray-700">Reset Password</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="border p-2 rounded-md"
        />
        <button onClick={requestPasswordReset} className="bg-red-500 text-white p-2 rounded-md">
          Send Reset Email
        </button>
      </div>

      {message && <p className="text-gray-800">{message}</p>}
    </div>
  );
}
