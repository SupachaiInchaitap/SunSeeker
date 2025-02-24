// app/page.tsx
import Navbar from "./components/Navbar";
import CurrentWeather from "./components/CurrentWeather";
import FavoriteButton from "./components/FavoriteButton";

// app/page.tsx
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


export default async function Home() {
  const city = "Bangkok";
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;; // Replace with your OpenWeatherAPI key
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  );
  const data = await res.json();

  console.log("API Response:", data); // Add this line to log the response
  
  const weatherData: WeatherData = {
    main: {
      temp: data.main?.temp || 0,
      humidity: data.main?.humidity || 0,
    },
    wind: {
      speed: data.wind?.speed || 0,
      gust: data.wind?.gust || 0,
    },
    airQuality: {
      aqi: 50, // Placeholder, replace with actual AQI fetching logic if needed
    },
    name: data.name || "Unknown Location",
    coord: {
      lat: data.coord?.lat || 0,
      lon: data.coord?.lon || 0,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
      <Navbar />
      <div className="flex flex-col items-center p-6 space-y-8">
        <h1 className="text-3xl font-medium text-gray-800 mb-4">Today Weather</h1>
        <CurrentWeather weatherData={weatherData} />
        <FavoriteButton
          city={weatherData.name}
          lat={weatherData.coord.lat}
          lon={weatherData.coord.lon}
        />
      </div>
    </div>
  );
}
