'use client'

import {
  Chart as ChartJS,
  // CategoryScale,
  LinearScale,
  // Title,
  // Tooltip,
  // Legend,
  // PointElement,
  LineElement,
  Filler,
} from 'chart.js'
import clsx from 'clsx'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  // CategoryScale,
  LinearScale,
  // Title,
  // Tooltip,
  // Legend,
  // PointElement,
  LineElement,
  Filler,
)

export const options = {
  scales: {
    x: {
      display: false,
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

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      // label: 'D0',
      data: [5, 5, 4, 5, 3, 2, 1],
      borderColor: 'rgba(255, 99, 132, 0.2)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      // hidden: false,
      fill: true,
      tension: 0.4,
      pointStyle: false,
    },
  ],
}

export default function ReadinessChart({ className }: { className?: string }) {
  return (
    <div className={clsx('max-w-screen overflow-hidden', className)}>
      <Line options={options} data={data} className='-mx-1' />
    </div>
  )
}
