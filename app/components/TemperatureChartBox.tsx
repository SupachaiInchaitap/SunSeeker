// app/components/TemperatureGraphWrapper.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TemperatureGraphProps {
  graphData: {
    time: string;
    temp: number;
  }[];
}

export default function TemperatureGraphWrapper({
  graphData,
}: TemperatureGraphProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={graphData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="temp"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
