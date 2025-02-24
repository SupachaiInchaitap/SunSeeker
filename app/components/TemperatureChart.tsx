// app/components/TemperatureGraph.tsx (or TemperatureChart.tsx)
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
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
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="cityName" />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="temp"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
