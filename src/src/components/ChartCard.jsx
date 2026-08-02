
import React, { useEffect, useRef } from 'react';
import Card from './Card';
import Chart from 'chart.js/auto';

export default function ChartCard({ title, labels, data }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: title,
          data,
          backgroundColor: 'rgba(0, 123, 255, 0.6)',
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1
        }]
      }
    });
  }, [labels, data]);

  return (
    <Card title={title}>
      <canvas ref={canvasRef} height="120"></canvas>
    </Card>
  );
}
