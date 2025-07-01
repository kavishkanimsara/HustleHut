/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import { errorToast } from "../../utils/toastify";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const CoachStatistics = () => {
  const [data, setData] = useState(null);

  const getStatistics = useCallback(async () => {
    await axios
      .get(`/coach/statistics`)
      .then(({ data }) => {
        setData(data);
      })
      .catch(() => {
        errorToast("Failed to get statistics");
      });
  }, []);

  useEffect(() => {
    getStatistics();
  }, [getStatistics]);

  return (
    <div className="w-full xl:container">
      {/* top statistics */}
      <div className="mt-8 flex w-full flex-col justify-center gap-4 sm:flex-row">
        {/* total sessions */}
        <div className="flex w-full flex-col items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-purple-800 p-4 shadow-md">
          <h3 className="text-xl font-medium">
            Total Sessions <span className="text-sm font-light">(Last 30 days)</span>
          </h3>
          <p className="text-3xl font-medium">{data?.totalSessions || 0}</p>
        </div>
        {/* total income */}
        <div className="flex w-full flex-col items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-purple-800 p-4 shadow-md">
          <h3 className="text-xl font-medium">
            Total Income <span className="text-sm font-light">(Last 30 days)</span>
          </h3>
          <p className="text-3xl font-medium">
            LKR {data?.totalIncome?._sum.remaining || 0}
          </p>
        </div>
      </div>

      {/* combined line chart */}
      {data && data.dataByDate && (
        <div className="mt-8 h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.dataByDate} margin={{ top: 20, right: 40, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" label={{ value: "Sessions", angle: -90, position: "insideLeft" }} />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: "Income (LKR)", angle: 90, position: "insideRight" }}
              />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />

              {/* Line for sessions on left Y axis */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sessions"
                stroke="hsl(127, 71.80%, 65.30%)" // purple
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name="Sessions"
              />

              {/* Line for income on right Y axis */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="income"
                stroke="hsl(189, 86.90%, 67.10%)" // orange
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name="Income"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CoachStatistics;
