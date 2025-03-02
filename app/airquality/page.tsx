import Navbar from "../components/Navbar";
import AirQualityGraph from "../components/AirQualityGraph";
import { getAirQualityData } from "../components/GetAirQuality";

export default async function AirQualityPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Ensure searchParams.q is a string or fallback to "Bangkok"
  const city = typeof searchParams?.q === "string" ? searchParams.q : "Bangkok";

  // Function to get the coordinates of the city
  async function getCoordinates(city: string) {
    const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    if (!API_KEY) {
      throw new Error("API key is missing! Add NEXT_PUBLIC_WEATHER_API_KEY to .env.local");
    }

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return {
      lat: data.coord.lat,
      lon: data.coord.lon,
    };
  }

  const coords = await getCoordinates(city);

  // If city is not found, show an error message
  if (!coords) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
        <Navbar targetPage="/airquality" searchParams={{ q: city }} />
        <div className="flex flex-col items-center justify-center min-h-screen px-6">
          <div className="bg-white shadow-md rounded-lg p-6 text-center max-w-lg">
            <h1 className="text-3xl font-semibold text-gray-800">Air Quality Index</h1>
            <p className="text-red-500 mt-4">City not found. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  // Fetch Air Quality Data
  const airQualityData = await getAirQualityData(coords.lat, coords.lon);
  const graphData = Array.isArray(airQualityData) ? airQualityData : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
      <Navbar targetPage="/airquality" searchParams={{ q: city }} />

      <div className="flex flex-col items-center px-6 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">Air Quality Index</h1>
          <p className="text-lg text-gray-700 mt-2">
            Current AQI for <span className="font-semibold text-blue-600">{city}</span>
          </p>
        </div>

        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mt-8">
          {graphData.length > 0 ? (
            <AirQualityGraph graphData={graphData} />
          ) : (
            <p className="text-gray-600 text-lg text-center">No data available for this location</p>
          )}
        </div>
      </div>
    </div>
  );
}

