// app/components/HourlyForecast.tsx
import { HourlyWeather } from "../hourly/page"; // นำเข้า HourlyWeather
import Image from "next/image"; // ใช้ Image จาก next/image

interface HourlyForecastProps {
  hourlyData: HourlyWeather[];
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {hourlyData.map((hour) => (
        <div
          key={hour.dt}
          className="p-4 border border-gray-200 rounded-lg bg-white shadow-md flex flex-col items-center"
        >
          <p className="text-lg font-medium">
            {new Date(hour.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <Image
            src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
            alt={hour.weather[0].description}
            width={50}  // กำหนดความกว้างของภาพ
            height={50} // กำหนดความสูงของภาพ
          />
          <p className="text-xl">{Math.round(hour.temp)}°C</p>
          <p className="text-sm text-gray-600">{hour.weather[0].description}</p>
        </div>
      ))}
    </div>
  );
};

export default HourlyForecast;
