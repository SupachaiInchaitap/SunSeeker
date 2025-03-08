"use client";

import { useSearchParams } from "next/navigation";
import AirQualityGraph from "./AirQualityGraph";
import { getAirQualityData } from "./GetAirQuality";
import { useEffect, useState } from "react";

export default function AirQualityClient() {
  const searchParams = useSearchParams();
  const city = searchParams?.get("q") || "Bangkok";
  const [airQualityData, setAirQualityData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const coords = await getCoordinates(city);
      if (coords) {
        const data = await getAirQualityData(coords.lat, coords.lon);
        setAirQualityData(data || []);
      }
    }
    fetchData();
  }, [city]);

  async function getCoordinates(city: string) {
    const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    if (!API_KEY) {
      console.error("API key is missing!");
      return null;
    }

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return { lat: data.coord.lat, lon: data.coord.lon };
  }

  return (
    <div>
      <h1>Air Quality Index for {city}</h1>
      {airQualityData.length > 0 ? (
        <AirQualityGraph graphData={airQualityData} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}
