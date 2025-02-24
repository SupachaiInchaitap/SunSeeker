import { getUser } from "@/utils/supabase/getUser";
import Navbar from "../components/Navbar";
import { createClient } from "@supabase/supabase-js";
import { Suspense } from "react";
import TemperatureGraphWrapper from "../components/TemperatureChartBox";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
  }[];
}

async function getWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();
    if (data.cod === 200) {
      return data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

async function getUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from("user_favorites")
    .select("city_name, lat, lon")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }

  return data;
}

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center text-center">
        <Navbar />
        <h1 className="text-2xl font-semibold text-red-500">
          You are not logged in.
        </h1>
        <p className="text-gray-600 mt-2">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  // Get user's favorite cities with coordinates
  const favoriteCities = await getUserFavorites(user.id);

  // Get weather data for each favorite city using coordinates
  const weatherData = await Promise.all(
    favoriteCities.map((city) =>
      getWeather(city.lat, city.lon).then((data) => ({
        cityName: city.city_name,
        weather: data,
      }))
    )
  );

  // Prepare data for the graph
  const graphData = weatherData
    .filter((item) => item.weather)
    .map((item) => ({
      cityName: item.cityName,
      temp: item.weather?.main.temp ?? 0, // Default to 0 if undefined
    }));

  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-grow">
        {/* Left Sidebar - User Profile */}
        <div className="w-1/3 bg-white p-6 border-r border-gray-300">
          <h2 className="text-2xl font-semibold text-secondary mb-4">Profile</h2>
          <div className="flex flex-col items-center">
            {/* Placeholder Profile Image */}
            <div className="w-24 h-24 rounded-full bg-gray-300 mb-4"></div>
            <p className="text-lg font-semibold">{user.email}</p>
            <p className="text-gray-600">Welcome back!</p>
          </div>
        </div>

        {/* Main Content - Favorites and Graph */}
        <div className="w-2/3 bg-gray-100 p-6 overflow-y-auto">
          <h2 className="text-2xl font-semibold text-secondary mb-4">
            Your Favorites
          </h2>
          <div className="space-y-4">
            {weatherData.length > 0 ? (
              weatherData.map((item, index) =>
                item.weather ? (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-300"
                  >
                    <h3 className="text-xl font-bold">{item.cityName}</h3>
                    <p className="text-gray-600">
                      {item.weather.weather[0].description} -{" "}
                      {item.weather.main.temp}°C
                    </p>
                  </div>
                ) : (
                  <p key={index} className="text-gray-600">
                    No data available
                  </p>
                )
              )
            ) : (
              <p className="text-gray-600">No favorites added yet.</p>
            )}
          </div>

          {/* Graph Section */}
          <div className="mt-8 bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Temperature Graph</h3>
            <Suspense fallback={<p>Loading graph...</p>}>
              <TemperatureGraphWrapper graphData={graphData} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>

  );
}
