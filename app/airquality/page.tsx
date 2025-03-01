import Navbar from "../components/Navbar";
import AirQualityGraph from "../components/AirQualityGraph";
import { getAirQualityData } from "../components/GetAirQuality";
import { getWeatherData } from "@/utils/Others/getWeather"; // Import the function

interface SearchParams {
  q?: string;
}

async function getCoordinates(city: string) {
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  if (!API_KEY) {
    throw new Error("API key is missing! Add NEXT_PUBLIC_WEATHER_API_KEY to .env.local");
  }

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
  );

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return {
    lat: data.coord.lat,
    lon: data.coord.lon,
  };
}

export default async function AirQualityPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const city = searchParams?.q || "Bangkok";
  const coords = await getCoordinates(city);

  if (!coords) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
        <Navbar targetPage="/air-quality" searchParams={searchParams} />
        <div className="flex flex-col items-center p-6 space-y-8">
          <h1 className="text-3xl font-medium text-gray-800 mb-4">Air Quality Index</h1>
          <p className="text-red-500">City not found. Please try again.</p>
        </div>
      </div>
    );
  }

  // Fetch Current Air Quality Data
  const airQualityData = await getAirQualityData(coords.lat, coords.lon);

  // Fetch Historical Weather Data
  const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  const historicalData = await getWeatherData(coords.lat, coords.lon, "historical", timestamp);

  const graphData = historicalData ?? airQualityData; // Use historical if available, otherwise current AQI

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
      <Navbar targetPage="/air-quality" searchParams={searchParams} />
      <div className="flex flex-col items-center p-6 space-y-8">
        <h1 className="text-3xl font-medium text-gray-800 mb-4">Air Quality Index for {city}</h1>

        {graphData && graphData.length > 0 ? (
          <div className="w-full max-w-4xl">
            <AirQualityGraph graphData={graphData} />
          </div>
        ) : (
          <p className="text-gray-700 text-lg">No data available for this location</p>
        )}
      </div>
    </div>
  );
}
