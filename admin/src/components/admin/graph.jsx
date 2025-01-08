import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graph = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend if not needed
      },
      title: {
        display: true,
        text: "Comparison of Total Users, Total Orders, and Interested Users",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 200,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default Graph;
