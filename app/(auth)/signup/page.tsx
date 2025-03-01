"use client";

import { useState } from "react";
import { signup } from "@/app/(auth)/function/action";
import Link from "next/link"; // Import Link for navigation
import { AiOutlineArrowLeft } from "react-icons/ai"; // Importing a back arrow icon

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);
  const [showEmailReminder, setShowEmailReminder] = useState(false);

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setShowEmailReminder(false);

    // Validate password
    if (!validatePassword(password)) {
      setPasswordValid(false);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);

    const result = await signup(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setShowEmailReminder(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-green-100">
      <div className="flex flex-grow justify-center items-center px-6 py-10">
        <div className="w-full md:w-1/3 bg-white rounded-3xl shadow-lg p-6 border-t-4 border-green-400">
          <Link href="/" className="absolute top-6 left-6 text-gray-700 hover:text-green-500">
            <AiOutlineArrowLeft size={24} />
          </Link>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign Up</h2>

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
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded-xl shadow-sm"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 border rounded-xl shadow-sm ${!passwordValid ? 'border-red-500' : ''}`}
            />
            {!passwordValid && (
              <p className="text-red-500 text-sm">
                Password must be at least 8 characters long, with one uppercase letter, one lowercase letter, and one number.
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-3 rounded-xl font-semibold hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-4 text-gray-700">
            Already have an account?{" "}
            <Link href="/login" className="text-green-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Popup Modal for Email Confirmation Reminder */}
      {showEmailReminder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-96 text-center shadow-xl">
            <h3 className="text-2xl font-bold text-green-500 mb-4">Check Your Email!</h3>
            <p className="text-gray-700 mb-6">
              We have sent a confirmation email to activate your account. Please check your inbox and confirm your email to get started.
            </p>
            <button
              onClick={() => setShowEmailReminder(false)}
              className="bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
