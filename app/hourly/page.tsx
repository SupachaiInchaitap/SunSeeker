"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

// Interface สำหรับ JSON ที่ได้จาก API
interface WeatherData {
  dt: number;
  main: {
    temp: number;
  };
  weather: { description: string; icon: string }[];
}

// Interface สำหรับข้อมูลพยากรณ์ที่ใช้ใน State
interface HourlyWeather {
  dt: number;
  temp: number;
  weather: { description: string; icon: string }[];
}

const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const city = "Bangkok";

export default function Hourly() {
  const [hourlyData, setHourlyData] = useState<HourlyWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHourlyWeather = async () => {
      if (!apiKey) {
        setError("API Key is missing. Please check your .env.local file.");
        setLoading(false);
        return;
      }

      try {
        console.log("API Key:", apiKey);

        // ดึงค่าพิกัดของเมือง
        const locationRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        if (!locationRes.ok) {
          throw new Error("Failed to fetch location data");
        }
        const locationData = await locationRes.json();

        // ดึงข้อมูลพยากรณ์อากาศรายชั่วโมง
        const hourlyRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${locationData.coord.lat}&lon=${locationData.coord.lon}&appid=${apiKey}&units=metric`
        );
        if (!hourlyRes.ok) {
          throw new Error("Failed to fetch hourly weather data");
        }
        const hourlyData = await hourlyRes.json();

        // ตรวจสอบโครงสร้างของ JSON
        console.log("Hourly Data:", hourlyData);

        // อัปเดต state โดยใช้ temp จาก main
        setHourlyData(
          hourlyData.list.slice(0, 6).map((hour: WeatherData) => ({
            dt: hour.dt,
            temp: hour.main.temp, // ✅ ใช้ข้อมูลอุณหภูมิจาก `main.temp`
            weather: hour.weather,
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchHourlyWeather();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
      <Navbar />
      <div className="flex flex-col items-center p-6">
        <h1 className="text-3xl font-medium text-gray-800 mb-6">Hourly Forecast</h1>

        {loading ? (
          <p className="text-lg text-gray-800">Loading hourly data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : hourlyData.length === 0 ? (
          <p className="text-gray-600">No weather data available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {hourlyData.map((hour) => (
              <div
                key={hour.dt}
                className="p-4 border border-gray-200 rounded-lg bg-white shadow-md flex flex-col items-center"
              >
                <p className="text-lg font-medium">
                  {new Date(hour.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                <img src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`} alt={hour.weather[0].description} />
                <p className="text-xl">{Math.round(hour.temp)}°C</p>
                <p className="text-sm text-gray-600">{hour.weather[0].description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
