// app/components/CurrentWeather.tsx
"use client";

import { useEffect, useState } from "react";

// Define the types for Weather Data
interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
    gust: number;
  };
  airQuality: {
    aqi: number;
  };
  name: string;
}

const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const city = "Bangkok";

export default function CurrentWeather() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAirQualityMessage = (aqi: number): string => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        if (!weatherResponse.ok) {
          throw new Error("Failed to fetch weather data");
        }
        const weatherData = await weatherResponse.json();

        const airQualityResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${apiKey}`
        );
        if (!airQualityResponse.ok) {
          throw new Error("Failed to fetch air quality data");
        }
        const airQualityData = await airQualityResponse.json();

        setCurrentWeather({
          main: weatherData.main,
          wind: weatherData.wind,
          airQuality: airQualityData.list[0].main,
          name: weatherData.name,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-medium text-gray-800 mt-6">Current Weather</h2>
      {loading ? (
        <p className="text-gray-800 text-lg">Loading Current Weather...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : currentWeather ? (
        <div className="mt-4 p-6 border border-gray-200 rounded-lg bg-white shadow-md">
          <p className="text-lg text-gray-700">
            <strong>Wind Speed:</strong> {currentWeather.wind.speed} m/s
          </p>
          <p className="text-lg text-gray-700">
            <strong>Wind Gusts:</strong> {currentWeather.wind.gust} m/s
          </p>
          <p className="text-lg text-gray-700">
            <strong>Air Quality:</strong> {getAirQualityMessage(currentWeather.airQuality.aqi)}
          </p>
        </div>
      ) : (
        <p className="text-gray-700 text-lg">No data available</p>
      )}
    </div>
  );
}
