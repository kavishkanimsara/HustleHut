/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import { errorToast } from "../../utils/toastify";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminStatistics = () => {
  const [data, setData] = useState(null);

  const getStatistics = useCallback(async () => {
    try {
      const { data } = await axios.get(`/admin/statistics`);
      setData(data);
    } catch {
      errorToast("Failed to get statistics");
    }
  }, []);

  useEffect(() => {
    getStatistics();
  }, [getStatistics]);

  return (
    <div className="w-full flex flex-col items-center px-4">
      {/* Top Statistics */}
      <div className="mt-8 w-full max-w-6xl flex flex-col justify-center items-center gap-4 sm:flex-row">
        <StatCard title="Workout Sessions" value={data?.totalSessions || 0} />
        <StatCard
          title="Income (LKR)"
          value={`LKR ${data?.totalIncome?._sum?.fee || 0}`}
        />
        <StatCard title="New Users" value={data?.newUsers || 0} />
      </div>

      {/* Individual Charts */}
      {data && (
        <div className="mt-12 w-full max-w-6xl flex flex-col gap-12">
          <ChartSection
            title="📊 Workout Sessions"
            subtitle="Total sessions per day for the last 30 days"
            color="#38bdf8"
            dataKey="sessions"
            data={data.dataByDate}
          />
          <ChartSection
            title="💰 Income (LKR)"
            subtitle="Total income per day for the last 30 days"
            color="#34d399"
            dataKey="income"
            data={data.dataByDate}
          />
          <ChartSection
            title="👥 New Users"
            subtitle="User registrations per day for the last 30 days"
            color="#60a5fa"
            dataKey="users"
            data={data.dataByDate}
          />
        </div>
      )}
    </div>
  );
};

// ChartSection component with clear titles
const ChartSection = ({ title, subtitle, data, dataKey, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-1">{title}</h2>
    <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// Top Stat Card
const StatCard = ({ title, value }) => (
  <div className="flex w-full flex-col items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-emerald-500 text-white p-4 shadow-md">
    <h3 className="text-xl font-medium">{title}</h3>
    <p className="text-3xl font-semibold">{value}</p>
  </div>
);

export default AdminStatistics;
