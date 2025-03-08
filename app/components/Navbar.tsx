import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { logout } from "../(auth)/function/action";

// Fetch weather data for a city
async function fetchWeather(city: string) {
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  if (!API_KEY) {
    throw new Error("API key is missing! Add NEXT_PUBLIC_WEATHER_API_KEY to .env.local");
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Default city for weather if not available
  const city = "Bangkok"; 
  const weather = await fetchWeather(city);

  // Get the first letter of the user's email or name to use as the avatar
  const avatarLetter = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <>
      <nav className="relative flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-lg rounded-b-2xl z-10">
        {/* Logo + Weather */}
        <Link href="/" className="flex items-center space-x-6 cursor-pointer">
          <div className="flex items-center space-x-3">
            <span className="text-yellow-400 text-3xl">☀️</span>
            <h1 className="text-2xl font-bold tracking-wide">SunSeeker</h1>
          </div>
          {weather ? (
            <p className="text-lg text-white/90">
              {weather.name}, {weather.sys.country} {Math.round(weather.main.temp)}°C
            </p>
          ) : (
            <p className="text-sm text-white/70">Weather data unavailable</p>
          )}
        </Link>

        {/* Authentication Section */}
        <div className="relative z-30">
          {user ? (
            <details className="dropdown dropdown-bottom dropdown-end group">
              <summary className="py-4 px-6 flex justify-between items-center bg-white text-black border-2 rounded-lg cursor-pointer">
                {/* Profile Avatar with the first letter of the email */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white">
                    {avatarLetter}
                  </div>
                  <h1 className="font-semibold text-lg">{user.email}</h1>
                </div>
                <i className="fa-solid fa-chevron-down text-xl"></i>
              </summary>

              {/* Dropdown Menu */}
              <ul className="menu dropdown-content shadow bg-white w-72 mt-3 text-secondary rounded-lg rounded-tr-none p-0 absolute top-full right-0 z-40">
                <li className="hover:bg-gray-100 duration-200 py-3 px-5 text-lg text-black">
                  <Link href="/profile" className="w-full text-left">
                    Profile
                  </Link>
                </li>
                <li className="hover:bg-gray-100 duration-200 py-3 px-5 text-lg text-black">
                  <Link href="/settings" className="w-full text-left">
                    Settings
                  </Link>
                </li>
                <li className="hover:bg-gray-100 duration-200 py-3 px-5 text-lg text-black">
                  <form action={logout} className="flex gap-5">
                    <i className="fa-solid fa-right-from-bracket text-xl"></i>
                    <button type="submit" className="w-full text-left text-black">
                      Logout
                    </button>
                  </form>
                </li>
              </ul>
            </details>
          ) : (
            <div className="flex gap-3">
              <Link href="/login" className="py-2 px-5 flex rounded-md border hover:bg-white hover:text-primary duration-300">
                Login
              </Link>
              <Link href="/signup" className="py-2 px-5 flex rounded-md border hover:bg-white hover:text-primary duration-300">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Submenu */}
      <div className="flex justify-center text-black py-2">
        <div className="flex space-x-8">
          <Link href="/" className="hover:text-yellow-400 transition duration-300">
            Today
          </Link>
          <Link href="/hourly" className="hover:text-yellow-400 transition duration-300">
            Hourly
          </Link>
          <Link href="/airquality" className="hover:text-yellow-400 transition duration-300">
            Air Quality
          </Link>
        </div>
      </div>
    </>
  );
}
