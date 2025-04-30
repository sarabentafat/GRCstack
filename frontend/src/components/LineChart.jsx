import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  Filler,
} from "chart.js";

// Register required components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  Filler
);

const AreaChart = () => {
  const generateRandomValues = (numValues) => {
    return Array.from({ length: numValues }, () =>
      Math.floor(Math.random() * 100)
    );
  };

  const data = {
    labels: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    datasets: [
      {
        label: "Random Values Dataset",
        fill: true,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: generateRandomValues(7),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio to control height
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Area Chart with Random Values",
      },
    },
    scales: {
      y: {
        min: 0,
        max: 120,
      },
    },
  };

  return (
    <div className="h-96">
      {" "}
      {/* Increase the height of the chart container */}
      <Line data={data} options={options} />
    </div>
  );
};

export default AreaChart;
