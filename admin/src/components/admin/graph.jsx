import React from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Graph = ({ data, type, title }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: type !== "Bar", // Show legend only for non-Bar charts
      },
      title: {
        display: !!title,
        text: title || "",
      },
    },
    scales: type === "Bar" || type === "Line" ? {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 200,
        },
      },
    } : undefined,
  };

  const ChartComponent = {
    Bar: Bar,
    Line: Line,
    Pie: Pie,
    Doughnut: Doughnut,
  }[type || "Bar"];

  return <ChartComponent data={data} options={options} />;
};

export default Graph;
