// app/hourly/page.tsx
import Navbar from "../components/Navbar";
import HourlyForecast from "../components/HourlyForecast"; // นำเข้า HourlyForecast

// ส่งออก `HourlyWeather` จาก page.tsx
export interface HourlyWeather {
  dt: number;
  temp: number;
  weather: { description: string; icon: string }[];
}

const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const city = "Bangkok";

// ฟังก์ชัน getServerSideProps ใช้ดึงข้อมูลจาก API
export async function getServerSideProps() {
  const hourlyData: HourlyWeather[] = [];
  let error = null;

  if (!apiKey) {
    error = "API Key is missing. Please check your .env.local file.";
  } else {
    try {
      // ดึงค่าพิกัดของเมือง
      const locationRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      if (!locationRes.ok) {
        throw new Error("Failed to fetch location data");
      }
      const locationData = await locationRes.json();

      // ดึงข้อมูลพยากรณ์อากาศรายชั่วโมง
      const hourlyRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${locationData.coord.lat}&lon=${locationData.coord.lon}&appid=${apiKey}&units=metric`
      );
      if (!hourlyRes.ok) {
        throw new Error("Failed to fetch hourly weather data");
      }
      const hourlyDataResponse = await hourlyRes.json();

      // อัปเดต hourlyData จากข้อมูลที่ดึงมา
      hourlyData.push(
        ...hourlyDataResponse.list.slice(0, 6).map((hour: WeatherData) => ({
          dt: hour.dt,
          temp: hour.main.temp,
          weather: hour.weather,
        }))
      );
    } catch (err) {
      error = err instanceof Error ? err.message : "Unknown error";
    }
  }

  return {
    props: {
      hourlyData,  // ส่งข้อมูลนี้ใน props
      error,       // ส่งข้อมูล error ถ้ามี
    },
  };
}

interface WeatherData {
  dt: number;
  main: {
    temp: number;
  };
  weather: { description: string; icon: string }[];
}

interface HourlyProps {
  hourlyData: HourlyWeather[];
  error: string | null;
}

const Hourly: React.FC<HourlyProps> = ({ hourlyData, error }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
      <Navbar />
      <div className="flex flex-col items-center p-6">
        <h1 className="text-3xl font-medium text-gray-800 mb-6">Hourly Forecast</h1>

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : hourlyData.length === 0 ? (
          <p className="text-gray-600">No weather data available</p>
        ) : (
          <HourlyForecast hourlyData={hourlyData} /> // ใช้คอมโพเนนต์ HourlyForecast
        )}
      </div>
    </div>
  );
};

export default Hourly;
