/* eslint-disable @typescript-eslint/no-explicit-any */
// app/profile/page.tsx

import { getUser } from "@/utils/supabase/getUser"; // Ensure this gets the logged-in user's auth info
import Navbar from "../components/Navbar";
import { createClient } from "@supabase/supabase-js";
import ProfileTabs from "../components/ProfileTab";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use Service Role Key to bypass RLS securely
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function getUserFavorites(userId: string) {
  if (!userId) {
    return [];
  }

  const { data: favorites, error } = await supabaseAdmin
    .from("user_favorites")
    .select("city_name, lat, lon")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }

  return favorites;
}

// Helper Function to Format Data for the Graph
async function getTemperatureData(lat: number, lon: number, cityName: string) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`
  );
  const data = await res.json();

  const formattedData = data.list.map((item: any) => ({
    time: item.dt_txt,
    temp: item.main.temp,
    city: cityName,
  }));

  return formattedData;
}

// Function to get user details from the users table
async function getUserDetails(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("username, email") // Selecting both username and email
    .eq("id", userId)
    .single(); // Get a single row

  if (error) {
    console.error("Error fetching user details:", error);
    return null;
  }

  return data;
}

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center text-center">
        <Navbar searchParams={{
          q: undefined
        }} />
        <h1 className="text-3xl font-bold text-red-500">
          You are not logged in.
        </h1>
        <p className="text-gray-600 mt-2">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  // Get user details (username and email) from the custom users table
  const userDetails = await getUserDetails(user.id);
  
  if (!userDetails) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center text-center">
        <Navbar searchParams={{
          q: undefined
        }} />
        <h1 className="text-3xl font-bold text-red-500">Error fetching user data.</h1>
        <p className="text-gray-600 mt-2">Please try again later.</p>
      </div>
    );
  }

  const favoriteCities = await getUserFavorites(user.id);

  const graphData = await Promise.all(
    favoriteCities.map(async (city) => {
      const tempData = await getTemperatureData(city.lat, city.lon, city.city_name);
      return tempData;
    })
  );

  const flattenedGraphData = graphData.flat();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 to-blue-400">
      <Navbar searchParams={{
        q: undefined
      }} />
      <div className="flex flex-grow flex-col md:flex-row gap-6 px-6 py-10">
        <div className="w-full md:w-1/3 bg-white rounded-3xl shadow-lg p-6 border-t-4 border-blue-400">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Profile</h2>
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex justify-center items-center text-white text-4xl font-bold mb-4 shadow-md">
              {userDetails?.username?.charAt(0).toUpperCase() || "?"}
            </div>
            <p className="text-2xl font-bold text-gray-800">{userDetails?.username || "No username provided"}</p>
            <p className="text-gray-600 mt-2">Welcome back!</p>
          </div>
        </div>

        <div className="w-full md:w-2/3 bg-white rounded-3xl shadow-lg p-6">
          <ProfileTabs favoriteCities={favoriteCities} graphData={flattenedGraphData} />
        </div>
      </div>
    </div>
  );
}
