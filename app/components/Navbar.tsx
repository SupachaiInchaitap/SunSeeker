"use client";
import { useState } from "react";
import { Search, Menu } from "lucide-react";

export default function Navbar() {
  const [query, setQuery] = useState("");

  return (
    <nav className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-lg rounded-b-2xl">
      {/* Logo Section */}
      <div className="flex items-center space-x-3">
        <span className="text-yellow-400 text-3xl">☀️</span>
        <h1 className="text-2xl font-bold tracking-wide">SunSeeker</h1>
      </div>

      {/* Search Bar */}
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

      {/* Menu Icon */}
      <Menu size={28} className="cursor-pointer hover:text-yellow-400 transition-transform transform hover:scale-110" />
    </nav>
  );
}
