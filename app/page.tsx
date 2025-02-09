"use client";

import React, { useState } from "react";
import Head from "next/head";
import "./globals.css";

const WeatherSearch = () => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    alert(`Searching for weather in: ${query}`);
  };

  return (
    <>
      <Head>
        <title>Weather Search</title>
      </Head>
      <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
        <div
          className="w-full max-w-md p-6 bg-white rounded-lg shadow-md"
          style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your address"
            className="w-full px-4 py-2 mb-4 text-lg text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
};

export default WeatherSearch;
