"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartOptions,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,

  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface LineChartProps {
  labels: string[]; // Dates or time
  dataset1: number[]; // Solid line values
  period?: string; // period: month, year, or ever
  // dataset2: number[]; // Dashed line values
}

export default function Chart({ labels, dataset1, period = "month" }: LineChartProps) {
  // Check if labels are month names (e.g., "January 2025") or dates (e.g., "2025-01-15")
  const isMonthLabels = labels.length > 0 && (labels[0].includes("January") || 
                         labels[0].includes("February") || 
                         labels[0].includes("March") || 
                         labels[0].includes("April") || 
                         labels[0].includes("May") || 
                         labels[0].includes("June") || 
                         labels[0].includes("July") || 
                         labels[0].includes("August") || 
                         labels[0].includes("September") || 
                         labels[0].includes("October") || 
                         labels[0].includes("November") || 
                         labels[0].includes("December"));

  // Prepare data points - if dates, use date strings; if month labels, use simple array
  const dataPoints = isMonthLabels 
    ? dataset1
    : labels.map((label, index) => ({ x: label, y: dataset1[index] }));

  const data = {
    labels: isMonthLabels ? labels : undefined,
    datasets: [
      {
        label: "Solid Line",
        data: dataPoints,
        borderColor: "#ffffff",
        backgroundColor: "#ffffff",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          title: (context) => {
            if (isMonthLabels) {
              // For month labels, show only the month name
              return labels[context[0].dataIndex] || "";
            }
            // For date labels, use default behavior
            return context[0].label || "";
          },
          label: (context) => {
            return `${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: isMonthLabels ? {
        type: "category",
        labels: labels,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#ffffff",
          maxRotation: 45,
          minRotation: 45,
        },
      } : {
        type: "time",
        time: {
          unit: period === "year" ? "month" : "day",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#ffffff",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#ffffff",
        },
      },
    },
  };

  return <Line data={data} options={options} width={800} height={240} />;
}
