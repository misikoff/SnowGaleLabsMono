'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
)

export const options = {
  // responsive: true,
  scales: {
    x: {
      ticks: {
        display: false,
      },
      border: {
        display: false,
      },
      grid: {
        display: false,
      },
    },
    y: {
      ticks: {
        display: false,
      },
      border: {
        display: false,
      },
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
}

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']

export const data = {
  labels,
  datasets: [
    {
      type: 'bar',
      label: 'My First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 99, 132, 0.9)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(54, 162, 235, 0.7)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 99, 132, 0.9)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(54, 162, 235, 0.7)',
      ],
      borderWidth: 1,
    },
    {
      type: 'line',
      label: 'Line Dataset',
      data: [50, 80, 20, 90, 95, 84, 40],
      tension: 0.4,
      borderColor: 'rgb(75, 192, 192)',
      borderDash: [3, 7],
      pointStyle: false,
      // segment: {
      //   // borderColor: ctx => skipped(ctx, 'rgb(0,0,0,0.2)') || down(ctx, 'rgb(192,75,75)'),
      //   borderDash: true, //ctx => skipped(ctx, [6, 6]),
      // },
    },
  ],
}

export default function ProgramChart({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Line options={options} data={data} />
    </div>
  )
}
