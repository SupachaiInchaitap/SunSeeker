"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface AirQualityGraphProps {
  graphData: {
    time: string;
    aqi: number;
  }[];
}

export default function AirQualityGraph({ graphData }: AirQualityGraphProps) {
  // Reverse data to show earliest to latest
  const reversedData = [...graphData].reverse();

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full">
      <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
        Hourly Air Quality Index (AQI)
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={reversedData}> {/* Use reversedData */}
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis
            dataKey="time"
            stroke="#333"
            tick={{ fill: "#333", fontSize: 12 }}
          />
          <YAxis
            domain={[0, 5]}
            ticks={[1, 2, 3, 4, 5]}
            label={{
              value: "AQI (1-5)",
              angle: -90,
              position: "insideLeft",
              fill: "#4CAF50",
              fontSize: 12,
            }}
            stroke="#4CAF50"
            tick={{ fill: "#4CAF50", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }}
            labelStyle={{ fontWeight: "bold" }}
            formatter={(value) => [`AQI: ${value}`, "Air Quality"]}
          />
          <Legend />
          <Bar dataKey="aqi" fill="#4CAF50" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
