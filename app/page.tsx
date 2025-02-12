import Navbar from "./components/Navbar";
import WeatherCard from "./components/WeatherCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
      <Navbar />
      {/* คอนเทนเนอร์จัดแนวในแนวตั้งแบบปกติ */}
      <div className="flex flex-col items-center p-4">
        {/* เพิ่มข้อความ "Today Weather" ขึ้นไปข้างบน */}
        <h1 className="text-3xl font-bold mb-4">Today Weather</h1>
        <WeatherCard />
        {/* เพิ่มข้อความ "Current Weather" ข้างล่าง WeatherCard */}
        <h2 className="text-2xl font-semibold mt-6">Current Weather</h2>
      </div>
    </div>
  );
}
