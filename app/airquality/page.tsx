import Navbar from "../components/Navbar";
import SearchBar from "../components/Searchbar";
import AirQualityClient from "../components/AirQualityClient"; // Import the new Client Component

export default function AirQualityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
      <Navbar />

      {/* Center the content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Title and Search Bar Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">Air Quality Index</h1>
          <p className="text-lg text-gray-700 mt-2">
            Current AQI for your selected city
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar targetPage="/airquality" />

        {/* Display the Air Quality Client Component */}
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mt-8">
          <AirQualityClient />
        </div>
      </div>
    </div>
  );
}
