import Navbar from "../components/Navbar";
import HourlyForecast from "../components/HourlyForecast"; // นำเข้า HourlyForecast
import SearchBar from "../components/Searchbar";
import { Suspense } from "react"; // Import Suspense

// Weather Data Interfaces
export interface HourlyWeather {
  dt: number;
  temp: number;
  weather: { description: string; icon: string }[];
}

const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

async function fetchHourlyWeather(city: string): Promise<{ hourlyData: HourlyWeather[]; error: string | null }> {
  const hourlyData: HourlyWeather[] = [];
  let error = null;

  if (!apiKey) {
    error = "API Key is missing. Please check your .env.local file.";
  } else {
    try {
      const locationRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      if (!locationRes.ok) {
        throw new Error("Failed to fetch location data");
      }
      const locationData = await locationRes.json();

      const hourlyRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${locationData.coord.lat}&lon=${locationData.coord.lon}&appid=${apiKey}&units=metric`
      );
      if (!hourlyRes.ok) {
        throw new Error("Failed to fetch hourly weather data");
      }
      const hourlyDataResponse = await hourlyRes.json();

      hourlyData.push(
        ...hourlyDataResponse.list.slice(0, 6).map((hour: WeatherData) => ({
          dt: hour.dt,
          temp: hour.main.temp,
          weather: hour.weather,
        }))
      );
    } catch (err) {
      error = err instanceof Error ? err.message : "Unknown error";
    }
  }

  return {
    hourlyData,
    error,
  };
}

interface WeatherData {
  dt: number;
  main: {
    temp: number;
  };
  weather: { description: string; icon: string }[];
}

export default async function Hourly(props: { searchParams?: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const city = searchParams?.q || "Bangkok";

  const { hourlyData, error } = await fetchHourlyWeather(city);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
      <Navbar />

      <div className="flex flex-col items-center px-6 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-5">Hourly Forecast</h1>
          <SearchBar targetPage="/hourly" />
          <p className="text-lg text-gray-700 mt-2">
            Weather forecast for <span className="font-semibold text-blue-600">{city}</span>
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mt-8">
            {error ? (
              <p className="text-red-500 text-center text-lg">{error}</p>
            ) : hourlyData.length === 0 ? (
              <p className="text-gray-600 text-center text-lg">No weather data available</p>
            ) : (
              <HourlyForecast hourlyData={hourlyData} />
            )}
          </div>
        </Suspense>
      </div>
    </div>
  );
}
