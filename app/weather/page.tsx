import Navbar from "../components/Navbar";
import WeatherCard from "../components/WeatherCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
      <Navbar />
      <div className="flex justify-center items-center h-[80vh]">
        <WeatherCard />
      </div>
    </div>
  );
}