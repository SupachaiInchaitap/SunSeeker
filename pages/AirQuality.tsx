"use client";
import { useEffect, useState, useMemo } from "react";

interface AirQualityData {
  components: {
    pm2_5: number;
    pm10: number;
    co: number;
  };
}

export default function AirQuality() {
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [error, setError] = useState<string | null>(null); // State for handling errors
  const API_KEY = useMemo(() => process.env.NEXT_PUBLIC_WEATHER_API_KEY, []);
  const LAT = "13.7563";
  const LON = "100.5018"; // พิกัดของกรุงเทพฯ

  useEffect(() => {
    async function fetchAirQuality() {
      try {
        // Check if API_KEY is missing
        if (!API_KEY) {
          setError("API key is missing! Please check your environment variables.");
          return;
        }

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${LAT}&lon=${LON}&appid=${API_KEY}`
        );

        if (!res.ok) {
          // Check if response status is not ok (404, 500, etc.)
          setError(`Error fetching data: ${res.statusText}`);
          return;
        }

        const data = await res.json();

        // Check if expected data is available
        if (data.list && data.list.length > 0) {
          setAirQuality(data.list[0]);
        } else {
          setError("No air quality data available.");
        }
      } catch (error) {
        console.error("Error fetching air quality data:", error);
        setError("An error occurred while fetching the air quality data.");
      }
    }

    if (API_KEY) {
      fetchAirQuality();
    }
  }, [API_KEY]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Air Quality</h2>
      {error ? (
        <p className="text-red-500">{error}</p> // Display error message
      ) : airQuality ? (
        <div className="border p-4 rounded-lg shadow-md bg-gray-100">
          <p className="text-lg">🌫 PM2.5: {airQuality.components.pm2_5} µg/m³</p>
          <p className="text-lg">🌪 PM10: {airQuality.components.pm10} µg/m³</p>
          <p className="text-lg">💨 CO: {airQuality.components.co} µg/m³</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
