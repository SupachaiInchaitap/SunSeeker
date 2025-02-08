"use client";
import { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const CITY = "Bangkok";

export default function WeatherCard() {
  interface WeatherData {
    name: string;
    main?: {
      temp: number;
    };
    weather?: {
      description: string;
    }[];
  }

  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      setWeather(data);
    }
    fetchWeather();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 text-center">
      {weather && weather.main && weather.weather ? (
        <>
          <h2 className="text-xl font-bold">{weather.name}</h2>
          <p className="text-2xl">{weather.main.temp}°C</p>
          <p>{weather.weather[0].description}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
