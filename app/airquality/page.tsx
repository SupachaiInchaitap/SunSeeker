"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface AirQualityData {
  aqi: number;
}

const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const city = "Bangkok";

export default function AirQuality() {
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAirQuality = async () => {
      try {
        // ดึงพิกัดของเมืองจาก Weather API
        const locationRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
        );
        if (!locationRes.ok) {
          throw new Error("Failed to fetch location data");
        }
        const locationData = await locationRes.json();

        // ดึงข้อมูลคุณภาพอากาศ
        const airQualityRes = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${locationData.coord.lat}&lon=${locationData.coord.lon}&appid=${apiKey}`
        );
        if (!airQualityRes.ok) {
          throw new Error("Failed to fetch air quality data");
        }
        const airQualityData = await airQualityRes.json();

        setAirQuality(airQualityData.list[0].main);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchAirQuality();
  }, []);

  const getAirQualityMessage = (aqi: number): string => {
    if (aqi === 1) return "Good (ดี)";
    if (aqi === 2) return "Fair (ปานกลาง)";
    if (aqi === 3) return "Moderate (ไม่ดีสำหรับบางกลุ่ม)";
    if (aqi === 4) return "Poor (ไม่ดี)";
    return "Very Poor (อันตราย)";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
      <Navbar />
      <div className="flex flex-col items-center p-6 space-y-8">
        <h1 className="text-3xl font-medium text-gray-800 mb-4">Air Quality Index</h1>

        {loading ? (
          <p className="text-lg text-gray-800">Loading Air Quality...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : airQuality ? (
          <div className="mt-4 p-6 border border-gray-200 rounded-lg bg-white shadow-md">
            <p className="text-lg text-gray-700">
              <strong>AQI:</strong> {airQuality.aqi}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Status:</strong> {getAirQualityMessage(airQuality.aqi)}
            </p>
          </div>
        ) : (
          <p className="text-gray-700 text-lg">No data available</p>
        )}
      </div>
    </div>
  );
}
