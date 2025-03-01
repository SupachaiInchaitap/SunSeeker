// app/components/AirQualityGraph.tsx
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

interface AirQualityGraphProps {
  graphData: {
    time: string;
    aqi: number;
  }[];
}

export default function AirQualityGraph({ graphData }: AirQualityGraphProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={graphData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="aqi"
          stroke="#82ca9d"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
