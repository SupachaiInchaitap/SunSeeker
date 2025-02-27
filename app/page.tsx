// app/page.tsx
import Navbar from "./components/Navbar";
import CurrentWeather from "./components/CurrentWeather";
import FavoriteButton from "./components/favoriteButton";

interface WeatherData {
  coord: {
    lat: number;
    lon: number;
  };
  name: string;
}

async function fetchWeather(city: string): Promise<WeatherData | null> {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  );

  if (!res.ok) {
    console.error("Failed to fetch weather data");
    return null;
  }

  const data = await res.json();
  return data;
}

export default async function Home({ searchParams }: { searchParams: { q?: string } }) {
  const params = await searchParams;  // Await searchParams here
  const city = params.q || "Bangkok"; // Now safely access the query parameter

  // Fetch weather data to get latitude and longitude
  const weatherData = await fetchWeather(city);

  const lat = weatherData?.coord.lat;
  const lon = weatherData?.coord.lon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
      <Navbar />
      <div className="flex flex-col items-center p-6 space-y-8">
        <h1 className="text-3xl font-medium text-gray-800 mb-4">Today Weather</h1>

        {/* Only show weather if lat and lon are available */}
        {lat && lon ? (
          <CurrentWeather lat={lat} lon={lon} />
        ) : (
          <p className="text-red-500">Failed to load weather data</p>
        )}

        <FavoriteButton city={city} lat={lat || 0} lon={lon || 0} />
      </div>
    </div>
  );
}
