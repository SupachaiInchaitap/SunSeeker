"use client";

import React, { useState } from "react";
import Head from "next/head";

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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your address"
            className="w-full px-4 py-2 text-lg text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            className="mt-4 w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
};

export default WeatherSearch;
