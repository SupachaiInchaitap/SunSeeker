// app/page.tsx
import Navbar from "./components/Navbar";
import CurrentWeather from "./components/CurrentWeather";
import FavoriteButton from "./components/favoriteButton";
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

export default async function Home(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const params = await searchParams;
  const city = params.q || "Bangkok";

  // Fetch weather data to get latitude and longitude
  const weatherData = await fetchWeather(city);

  const lat = weatherData?.coord.lat;
  const lon = weatherData?.coord.lon;

  // Get user on the server side
  const user = await getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
      <Navbar searchParams={searchParams} targetPage="/" />
      <div className="flex flex-col items-center p-6 space-y-8">
        {/* Only show weather if lat and lon are available */}
        {lat && lon ? (
          <CurrentWeather lat={lat} lon={lon} />
        ) : (
          <p className="text-red-500">Failed to load weather data</p>
        )}

        {/* Pass user prop to FavoriteButton */}
        <FavoriteButton city={city} lat={lat || 0} lon={lon || 0} user={user} />
      </div>
    </div>
  );
}
