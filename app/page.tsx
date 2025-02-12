"use client";
import axios from "axios";
import { useState } from "react";
import { BsSearch } from "react-icons/bs";

interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
  };
  weather: {
    description: string;
  }[];
}

export default function WeatherSearch() {
  const [query, setQuery] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);

    try {
      const API_KEY = process.env.NEXT_PUBLIC_WEATHERMAP_API_KEY;
      if (!API_KEY) {
        throw new Error("API key is missing! Add NEXT_PUBLIC_WEATHERMAP_API_KEY to .env.local");
      }
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric`;
      const res = await axios.get<WeatherData>(url);
      setWeather(res.data);
    } catch (error: unknown) {
      console.error("Error fetching weather data:", error);
      setWeather(null);
      setError("ไม่พบข้อมูล กรุณาลองอีกครั้ง");
    }

    setLoading(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/Designer.jpeg')" }}>
      <div className="relative w-96 z-10">
        <input
          type="text"
          placeholder="Search a city"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          className="w-full p-4 pl-5 pr-12 text-white bg-opacity-50 bg-gray-900 border border-gray-500 rounded-full backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-white"
        />
        <button
          onClick={fetchWeather}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white hover:text-yellow-300 transition-colors"
        >
          <BsSearch size={24} />
        </button>
      </div>

      {loading && <p className="text-white mt-6">Loading...</p>}
      {error && <p className="text-red-500 mt-6">{error}</p>}

      {weather && (
        <div className="mt-6 p-6 bg-white bg-opacity-20 rounded-xl text-white backdrop-blur-md shadow-lg w-96 text-center">
          <h2 className="text-2xl font-bold">
            {weather.name}, {weather.sys.country}
          </h2>
          <p className="text-6xl font-semibold mt-2">{Math.round(weather.main.temp)}°C</p>
          <p className="capitalize mt-2">{weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}
