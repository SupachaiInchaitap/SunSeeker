// app/components/CurrentWeather.tsx
import { getWeatherData } from "@/utils/Others/getWeather";

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
    gust: number;
  };
  airQuality: {
    aqi: number;
  };
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
}

interface CurrentWeatherProps {
  weatherData: WeatherData;
}

const getAirQualityMessage = (aqi: number): string => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
};

export default async function CurrentWeather({ weatherData }: CurrentWeatherProps) {
  const city = "Bangkok";
  let currentWeather: WeatherData | null = null;
  let error = null;

  try {
    currentWeather = await getWeatherData(city);
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  return (
    <div>
      <h2 className="text-xl font-medium text-gray-800 mt-6">Current Weather</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : currentWeather ? (
        <div className="mt-4 p-6 border border-gray-200 rounded-lg bg-white shadow-md">
          <h3 className="text-2xl font-bold">{currentWeather.name}</h3>
          <p className="text-lg text-gray-700">
            <strong>Temperature:</strong> {currentWeather.main.temp}°C
          </p>
          <p className="text-lg text-gray-700">
            <strong>Humidity:</strong> {currentWeather.main.humidity}%
          </p>
          <p className="text-lg text-gray-700">
            <strong>Wind Speed:</strong> {currentWeather.wind.speed} m/s
          </p>
          <p className="text-lg text-gray-700">
            <strong>Wind Gusts:</strong> {currentWeather.wind.gust} m/s
          </p>
          <p className="text-lg text-gray-700">
            <strong>Air Quality:</strong> {getAirQualityMessage(currentWeather.airQuality.aqi)}
          </p>
          <h2 className="text-2xl font-bold mb-2">{weatherData.name}</h2>
          <p>Latitude: {weatherData.coord.lat}</p>
          <p>Longitude: {weatherData.coord.lon}</p>
        </div>
      ) : (
        <p className="text-gray-700 text-lg">No data available</p>
      )}
    </div>
  );
}
