// app/page.tsx
import Navbar from "./components/Navbar";
import CurrentWeather from "./components/CurrentWeather";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
      <Navbar />
      <div className="flex flex-col items-center p-6 space-y-8">
        <h1 className="text-3xl font-medium text-gray-800 mb-4">Today Weather</h1>
        <CurrentWeather />
      </div>
    </div>
  );
}
