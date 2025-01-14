import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface MacroDataPoint {
  name: string;
  value: number;
  timestamp: number;
}

export default function Home() {
  const [macroData, setMacroData] = useState<MacroDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMacroData = async () => {
      try {
        const response = await fetch(
          'https://rqag27a1ah.execute-api.us-east-1.amazonaws.com/macro'
        );
        const data = await response.json();
        setMacroData(data.items || []);
      } catch (err) {
        setError('Failed to fetch macro data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMacroData();
  }, []);

  // Prepare chart data
  const chartData = {
    labels: macroData.map((d) =>
      new Date(d.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    ),
    datasets: [
      {
        label: 'Fear and Greed Index',
        data: macroData.map((d) => d.value),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Crypto Macro Economic Indicators',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}
