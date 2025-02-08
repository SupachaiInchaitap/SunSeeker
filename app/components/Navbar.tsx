"use client";
import { useState } from "react";
import { Search, User } from "lucide-react";
import Today from "./Today";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState("today");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      <nav className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-lg rounded-b-2xl">
        {/* Logo Section */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => setCurrentPage("today")}
        >
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

        {/* Profile Icon */}
        <div className="relative">
          <User
            size={28}
            className="cursor-pointer hover:text-yellow-400 transition-transform transform hover:scale-110"
            onClick={toggleDropdown}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
              <button
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                onClick={() => {
                  setDropdownOpen(false);
                  // Add your "My favourite" logic here
                }}
              >
                My favourite
              </button>
              <button
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                onClick={() => {
                  setDropdownOpen(false);
                  // Add your "Log out" logic here
                }}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Submenu */}
      <div className="flex justify-center text-black py-2">
        <div className="flex space-x-8">
          <button
            className="hover:text-yellow-400 transition duration-300"
            onClick={() => setCurrentPage("today")}
          >
            Today
          </button>
          <button
            className="hover:text-yellow-400 transition duration-300"
            onClick={() => setCurrentPage("hourly")}
          >
            Hourly
          </button>
          <button
            className="hover:text-yellow-400 transition duration-300"
            onClick={() => setCurrentPage("airQuality")}
          >
            Air Quality
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div className="p-4">
        {currentPage === "today" && <Today />}
        {currentPage === "hourly" && <div>Hourly Forecast</div>}
        {currentPage === "airQuality" && <div>Air Quality Information</div>}
      </div>
    </>
  );
}