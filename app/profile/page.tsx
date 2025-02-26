// app/profile/page.tsx

import { getUser } from "@/utils/supabase/getUser";
import Navbar from "../components/Navbar";
import { createClient } from "@supabase/supabase-js";
import { Suspense } from "react";
import TemperatureGraphWrapper from "../components/TemperatureChartBox";
import CurrentWeather from "../components/CurrentWeather";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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

// Helper Function to Format Data for the Graph
async function getTemperatureData(lat: number, lon: number) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`
  );
  const data = await res.json();

  // Extract relevant data for the graph
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedData = data.list.map((item: any) => ({
    time: item.dt_txt,
    temp: item.main.temp,
  }));

  return formattedData;
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

  // Prepare data for the graph
  const graphData = await Promise.all(
    favoriteCities.map(async (city) => {
      const tempData = await getTemperatureData(city.lat, city.lon);
      return tempData;
    })
  );

  // Flatten the array of arrays
  const flattenedGraphData = graphData.flat();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex flex-grow">
        {/* Left Sidebar - User Profile */}
        <div className="w-full md:w-1/3 bg-white p-6 border-r border-gray-300">
          <h2 className="text-2xl font-semibold text-secondary mb-4">Profile</h2>
          <div className="flex flex-col items-center">
            {/* Placeholder Profile Image */}
            <div className="w-24 h-24 rounded-full bg-gray-300 mb-4"></div>
            <p className="text-lg font-semibold">{user.email}</p>
            <p className="text-gray-600">Welcome back!</p>
          </div>
        </div>

        {/* Main Content - Favorites and Graph */}
        <div className="w-full md:w-2/3 p-6 overflow-y-auto">
          <h2 className="text-2xl font-semibold text-secondary mb-4">
            Your Favorites
          </h2>
          <div className="space-y-4">
            {favoriteCities.length > 0 ? (
              favoriteCities.map((city, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-300"
                >
                  <h3 className="text-xl font-bold">{city.city_name}</h3>
                  {/* Use CurrentWeather component for each favorite city */}
                  <Suspense fallback={<p>Loading weather...</p>}>
                    <CurrentWeather lat={city.lat} lon={city.lon} />
                  </Suspense>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No favorites added yet.</p>
            )}
          </div>

          {/* Graph Section */}
          <div className="mt-8 bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Temperature Graph</h3>
            <Suspense fallback={<p>Loading graph...</p>}>
              <TemperatureGraphWrapper graphData={flattenedGraphData} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
