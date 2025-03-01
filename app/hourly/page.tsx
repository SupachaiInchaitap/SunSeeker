import Navbar from "../components/Navbar";
import HourlyForecast from "../components/HourlyForecast"; // นำเข้า HourlyForecast

// ส่งออก `HourlyWeather` จาก page.tsx
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
      // Get city coordinates
      const locationRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      if (!locationRes.ok) {
        throw new Error("Failed to fetch location data");
      }
      const locationData = await locationRes.json();

      // Get hourly weather data using the coordinates
      const hourlyRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${locationData.coord.lat}&lon=${locationData.coord.lon}&appid=${apiKey}&units=metric`
      );
      if (!hourlyRes.ok) {
        throw new Error("Failed to fetch hourly weather data");
      }
      const hourlyDataResponse = await hourlyRes.json();

      // Map the data to the required structure
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

export default async function Hourly({ searchParams }: { searchParams?: { q?: string } }) {
  // Use the query parameter or default to Bangkok
  const city = searchParams?.q || "Bangkok";
  const { hourlyData, error } = await fetchHourlyWeather(city);  

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
      <Navbar searchParams={searchParams} targetPage="/hourly" />
      <div className="flex flex-col items-center p-6">
        <h1 className="text-3xl font-medium text-gray-800 mb-6">Hourly Forecast for {city}</h1>

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : hourlyData.length === 0 ? (
          <p className="text-gray-600">No weather data available</p>
        ) : (
          <HourlyForecast hourlyData={hourlyData} />
        )}
      </div>
    </div>
  );
}