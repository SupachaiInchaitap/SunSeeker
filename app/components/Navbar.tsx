"use client";
import { useState } from "react";
import { Search, Menu } from "lucide-react";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
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
        <div className="relative">
          <Menu
            size={28}
            className="cursor-pointer hover:text-yellow-400 transition-transform transform hover:scale-110"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
              <button className="block px-4 py-2 text-left w-full hover:bg-gray-200">Today</button>
              <button className="block px-4 py-2 text-left w-full hover:bg-gray-200">Hourly</button>
              <button className="block px-4 py-2 text-left w-full hover:bg-gray-200">Air Quality</button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}