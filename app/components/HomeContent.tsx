/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import CurrentWeather from "./CurrentWeather";
import FavoriteButton from "./favoriteButton";
import { getUser } from "@/utils/supabase/getUser";

interface WeatherData {
  coord: {
    lat: number;
    lon: number;
  };
  name: string;
}

async function fetchWeather(city: string): Promise<WeatherData | null> {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  if (!apiKey) {
    console.error("API key is missing! Add NEXT_PUBLIC_WEATHER_API_KEY to .env.local");
    return null;
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!res.ok) {
      console.error("Failed to fetch weather data");
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

export default function HomeContent({ initialCity }: { initialCity: string }) {
  const [city, setCity] = useState(initialCity);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Fetch weather data
    async function fetchData() {
      const data = await fetchWeather(city);
      setWeatherData(data);
    }

    // Fetch user data
    async function fetchUser() {
      const userData = await getUser();
      setUser(userData);
    }

    fetchData();
    fetchUser();
  }, [city]);

  const lat = weatherData?.coord.lat;
  const lon = weatherData?.coord.lon;

  return (
    <div className="flex flex-col items-center p-6 space-y-8">
      {/* Only show weather if lat and lon are available */}
      {lat && lon ? (
        <CurrentWeather lat={lat} lon={lon} />
      ) : (
        <p className="text-red-500">Failed to load weather data</p>
      )}

      {/* Pass user prop to FavoriteButton */}
      {lat && lon && <FavoriteButton city={city} lat={lat} lon={lon} user={user} />}
    </div>
  );
}