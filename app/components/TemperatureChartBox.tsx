// app/components/TemperatureGraphWrapper.tsx
"use client";

import dynamic from "next/dynamic";

interface TemperatureGraphProps {
  graphData: {
    cityName: string;
    temp: number;
  }[];
}

const TemperatureGraph = dynamic(() => import("./TemperatureChart"), {
  ssr: false,
});

export default function TemperatureGraphWrapper({
  graphData,
}: TemperatureGraphProps) {
  return <TemperatureGraph graphData={graphData} />;
}
