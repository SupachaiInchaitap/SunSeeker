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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
      <Navbar />
      {/* คอนเทนเนอร์จัดแนวในแนวตั้งแบบปกติ */}
      <div className="flex flex-col items-center p-4">
        {/* เพิ่มข้อความ "Today Weather" ขึ้นไปข้างบน */}
        <h1 className="text-3xl font-bold mb-4">Today Weather</h1>
        <WeatherCard />
        {/* เพิ่มข้อความ "Current Weather" ข้างล่าง WeatherCard */}
        <h2 className="text-2xl font-semibold mt-6">Current Weather</h2>
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
