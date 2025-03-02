import Link from "next/link";
import { BsSearch } from "react-icons/bs";
import { createClient } from "@/utils/supabase/server";
import { logout } from "../(auth)/function/action";

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

interface NavbarProps {
  searchParams?: { q?: string };
  targetPage?: string;
}

export default async function Navbar({ searchParams, targetPage = "/" }: NavbarProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const city = searchParams?.q || "Bangkok";
  const weather = await fetchWeather(city);

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

        {/* Search Bar */}
        <form method="get" action={targetPage} className="relative">
          <div className="flex items-center space-x-2 bg-white text-black rounded-full px-4 py-2 shadow-inner w-60 md:w-72 lg:w-96">
            <BsSearch size={20} className="text-gray-500" />
            <input
              type="text"
              name="q"
              className="outline-none bg-transparent w-full placeholder-gray-400"
              placeholder="Search city..."
              defaultValue={searchParams?.q || ""}
            />
          </div>
        </form>

        {/* Authentication Section */}
        <div className="relative z-30">
          {user ? (
            <details className="dropdown dropdown-bottom dropdown-end group">
              <summary className="py-4 px-6 flex justify-between items-center bg-white text-black border-2 border-blue-500 rounded-lg cursor-pointer">
                <span className="flex gap-3 items-center">
                  <i className="fa-solid fa-user text-xl"></i>
                  <h1 className="font-semibold">{user.email}</h1>
                </span>
                <i className="fa-solid fa-chevron-down text-xl"></i>
              </summary>

              {/* Dropdown Menu */}
              <ul className="menu dropdown-content shadow bg-white w-72 mt-3 text-secondary rounded-lg rounded-tr-none p-0 absolute top-full right-0 z-40">
                <li className="hover:bg-gray-100 duration-200 py-2 rounded-t-lg">
                  <Link href="/profile" className="text-black w-full text-left">
                    Profile
                  </Link>
                </li>
                <li className="hover:bg-gray-100 duration-200 py-2">
                  <Link href="/settings" className="text-black w-full text-left">
                    Settings
                  </Link>
                </li>
                <li>
                  <form action={logout} method="POST" className="flex gap-5 hover:bg-gray-100 duration-200 py-4 rounded-b-lg">
                    <i className="fa-solid fa-right-from-bracket text-xl"></i>
                    <button type="submit" className="text-black w-full text-left">
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
