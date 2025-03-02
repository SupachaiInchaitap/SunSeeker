"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TemperatureGraphProps {
  graphData: {
    cityName: string;
    temp: number;
  }[];
}

export default function TemperatureGraph({ graphData }: TemperatureGraphProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={graphData}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
        <XAxis dataKey="cityName" tick={{ fontSize: 12 }} />
        <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.7)", color: "#fff" }} />
        <Legend wrapperStyle={{ fontSize: 14 }} />
        <Line
          type="monotone"
          dataKey="temp"
          stroke="#ff7300"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
