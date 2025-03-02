/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/CurrentWeather.tsx
import Image from "next/image";
import { getWeatherData } from "@/utils/Others/getWeather";

interface CurrentWeatherProps {
  lat: number;
  lon: number;
}

const getAirQualityMessage = (aqi: number): string => {
  if (aqi <= 1) return "Good";
  if (aqi <=  2) return "Fair";
  if (aqi <=  3) return "Unhealthy for Sensitive Groups";
  if (aqi <=  4) return "Unhealthy";
  if (aqi <=  5) return "Very Unhealthy";
  return "Hazardous";
};

const getAirQualityColor = (aqi: number): string => {
  if (aqi <= 1) return "text-green-600"; // Good
  if (aqi <=  2) return "text-green-600"; // Moderate
  if (aqi <=  3) return "text-orange-500"; // Unhealthy for Sensitive Groups
  if (aqi <=  4) return "text-red-500"; // Unhealthy
  if (aqi <=  5) return "text-purple-600"; // Very Unhealthy
  return "text-red-900"; // Hazardous
};


// Function to get the icon based on temperature
const getWeatherIcon = (temp: number): string => {
  if (temp >= 30) {
    return "/icons/hot.png"; // Local sun icon for hot weather
  } else if (temp < 20) {
    return "/icons/cold.png"; // Local snowflake icon for cold weather
  } else {
    return "/icons/mild.png"; // Local cloudy sun icon for mild weather
  }
};

// Function to convert Unix timestamp to readable time
const formatTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default async function CurrentWeather({ lat, lon }: CurrentWeatherProps) {
  let currentWeather: any | null = null;
  let error = null;

  try {
    currentWeather = await getWeatherData(lat, lon, "current");
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Current Weather</h2>
      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : currentWeather ? (
        <div className="relative bg-gradient-to-br from-blue-100 to-blue-300 rounded-3xl shadow-2xl p-8 overflow-hidden">
          {/* Floating Cloud Decoration */}
          <div className="absolute -top-10 -right-10 opacity-20">
            <Image
              src="/icons/mild.png"
              alt="Cloud Decoration"
              width={150}
              height={150}
              className="w-40 h-40"
            />
          </div>

          {/* Main Weather Section */}
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Weather Icon and Location */}
            <div className="text-center md:text-left">
              <Image
                src={getWeatherIcon(currentWeather.temp)}
                alt="Weather Icon"
                width={120}
                height={120}
                className="mx-auto md:mx-0"
              />
              <h3 className="text-5xl font-extrabold text-gray-900 mt-4">
                {currentWeather.name}, {currentWeather.country}
              </h3>
              <p className="text-6xl font-bold text-blue-700 mt-2">
                {currentWeather.temp}°C
              </p>
              <p className="text-xl text-gray-700 italic">
                Feels like {currentWeather.feels_like}°C
              </p>
            </div>

            {/* Weather Details */}
            <div className="mt-6 md:mt-0 md:ml-10 space-y-4">
              <p className="text-xl text-gray-800">
                <strong>Min/Max Temp:</strong> {currentWeather.temp_min}°C / {currentWeather.temp_max}°C
              </p>
              <p className="text-xl text-gray-800">
                <strong>Pressure:</strong> {currentWeather.pressure} hPa
              </p>
              <p className="text-xl text-gray-800">
                <strong>Humidity:</strong> {currentWeather.humidity}%
              </p>
              <p className="text-xl text-gray-800">
                <strong>Visibility:</strong> {currentWeather.visibility / 1000} km
              </p>
              <p className="text-xl text-gray-800">
                <strong>Wind Speed:</strong> {currentWeather.wind_speed} m/s
              </p>
              <p className="text-xl text-gray-800">
                <strong>Wind Gusts:</strong> {currentWeather.wind_gust} m/s
              </p>
              <p className="text-xl text-gray-800">
                <strong>Cloud Coverage:</strong> {currentWeather.clouds}%
              </p>
              <p className="text-xl text-gray-800">
                <strong>Sunrise:</strong> {formatTime(currentWeather.sunrise)}
              </p>
              <p className="text-xl text-gray-800">
                <strong>Sunset:</strong> {formatTime(currentWeather.sunset)}
              </p>
              <p className={`text-xl font-bold ${getAirQualityColor(currentWeather.aqi)}`}>
                <strong>Air Quality:</strong> {getAirQualityMessage(currentWeather.aqi)}
              </p>

            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 text-lg text-center">No data available</p>
      )}
    </div>
  );
}
