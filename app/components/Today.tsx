import React from 'react';

export default function Today() {
  const today = new Date();
  const date = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tonights Weather</h2>
      <p className="text-lg">{date}</p>
      <p className="mt-2">The weather tonight is expected to be clear with a low of 15°C.</p>
    </div>
  );
}