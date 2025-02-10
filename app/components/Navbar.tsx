"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, User } from "lucide-react";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [temp, setTemp] = useState<number | null>(null);

  useEffect(() => {
    const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const CITY = "Bangkok";

    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();
        if (data.main) {
          setTemp(data.main.temp);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }

    fetchWeather();
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-lg rounded-b-2xl">
        {/* Logo + Weather */}
        <Link href="/" className="flex items-center space-x-6 cursor-pointer">
          <div className="flex items-center space-x-3">
            <span className="text-yellow-400 text-3xl">☀️</span>
            <h1 className="text-2xl font-bold tracking-wide">SunSeeker</h1>
          </div>
          {temp !== null ? (
            <p className="text-lg text-white/90">Bangkok {temp}°C</p>
          ) : (
            <p className="text-sm text-white/70">Loading...</p>
          )}
        </Link>

        {/* Search Bar */}
        <div className="relative">
          <div className="flex items-center space-x-2 bg-white text-black rounded-full px-4 py-2 shadow-inner w-60 md:w-72 lg:w-96">
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              className="outline-none bg-transparent w-full placeholder-gray-400"
              placeholder="Search city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <User
            size={28}
            className="cursor-pointer hover:text-yellow-400 transition-transform transform hover:scale-110"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
              <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">
                My favourite
              </button>
              <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">
                Log out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Submenu */}
      <div className="flex justify-center text-black py-2">
        <div className="flex space-x-8">
          <Link href="/" className="hover:text-yellow-400 transition duration-300">
            Today
          </Link>
          <Link href="/hourly" className="hover:text-yellow-400 transition duration-300">
            Hourly
          </Link>
          <Link href="/airquality" className="hover:text-yellow-400 transition duration-300">
            Air Quality
          </Link>
        </div>
      </div>
    </>
  );
}
