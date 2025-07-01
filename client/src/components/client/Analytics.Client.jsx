/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { errorToast } from "../../utils/toastify";
import { ChartContainer } from "../ui/chart";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { FaHistory, FaInfoCircle } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import AnalyticsHistoryTable from "../table/AnalyticsHistory.Common";

const keys = [
  "biceps",
  "calf",
  "chest",
  "forearm",
  "height",
  "hip",
  "neck",
  "shoulders",
  "weight",
  "waist",
  "thigh",
];

const chartConfig = {
  current: {
    label: "Current",
  },
  initial: {
    label: "Initial",
  },
};

const ClientAnalytics = () => {
  const { user } = useSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeHistory, setActiveHistory] = useState("shoulders");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    await axios
      .get(`/client/analytics/${user?.username}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          errorToast("You do not have permission to view this data.");
        } else {
          errorToast(error.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.username]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="w-full xl:container px-4 py-6">
      <h1 className="flex items-center justify-center gap-x-2 pb-6 text-center text-2xl font-extrabold text-cyan-600 sm:text-3xl lg:text-4xl xl:pb-10">
        Your Analytics{" "}
        <FaInfoCircle
          onClick={() => setIsOpen(true)}
          className="cursor-pointer text-2xl text-cyan-500 hover:text-cyan-700 transition"
          title="About this page"
        />
      </h1>

      {/* about */}
      <AboutAlert isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* dialog for individual analytics */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="max-h-[80%] w-full max-w-[95%] xl:max-w-5xl">
          <DialogHeader>
            <DialogTitle>
              Records History of{" "}
              <span className="capitalize font-semibold text-cyan-600">{activeHistory}</span>
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-gray-600">
              This is the history of the client&apos;s measurements
            </DialogDescription>
          </DialogHeader>
          <div>
            <AnalyticsHistoryTable
              role={"client"}
              type={activeHistory}
              username={user?.username}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* analytics grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* loading */}
        {loading && (
          <div className="col-span-4 flex w-full justify-center text-lg font-semibold text-cyan-600">
            Loading...
          </div>
        )}

        {data &&
          !loading &&
          keys.map((key) => (
            <div
              key={key}
              className="rounded-xl border border-cyan-300 bg-cyan-50/30 p-6 shadow-lg backdrop-blur-sm hover:shadow-xl transition-shadow"
            >
              <h2 className="mb-4 text-center text-2xl font-semibold capitalize text-cyan-700">
                {key}
              </h2>
              <div className="flex justify-center">
                <Tabs defaultValue="initial" className="w-full max-w-[400px]">
                  <TabsContent value="initial">
                    <RadialChart
                      chartData={[{ initial: Number(data[key]?.initial) || 0 }]}
                      accessKey={"initial"}
                    />
                  </TabsContent>
                  <TabsContent value="current">
                    <RadialChart
                      chartData={[{ current: Number(data[key]?.current) || 0 }]}
                      accessKey={"current"}
                    />
                  </TabsContent>
                  <TabsList className="mt-4 flex gap-x-3 bg-transparent justify-center">
                    <TabsTrigger
                      value="initial"
                      className="w-28 rounded-md bg-cyan-200 text-cyan-900 aria-selected:!bg-cyan-600 aria-selected:!text-white transition-colors"
                    >
                      Initial
                    </TabsTrigger>
                    <TabsTrigger
                      value="current"
                      className="w-28 rounded-md bg-cyan-200 text-cyan-900 aria-selected:!bg-cyan-600 aria-selected:!text-white transition-colors"
                    >
                      Current
                    </TabsTrigger>
                    <button
                      className="ml-4 rounded-md border border-cyan-500 px-3 py-1 text-cyan-600 hover:bg-cyan-600 hover:text-white transition"
                      onClick={() => {
                        setActiveHistory(key);
                        setIsHistoryOpen(true);
                      }}
                      title="View History"
                    >
                      <FaHistory className="inline" />
                    </button>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const RadialChart = ({ chartData, accessKey }) => {
  const getEndAngle = () => {
    const percentage = chartData[0][accessKey];
    if (percentage > 100) return 360;
    if (percentage < 0) return 0;
    return percentage * 3.6;
  };
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[220px]"
    >
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={90 + getEndAngle() * -1}
        innerRadius={80}
        outerRadius={110}
      >
        <PolarGrid
          gridType="circle"
          radialLines={true}
          stroke="#A0E9FF"
          strokeDasharray="4 6"
        />
        <RadialBar
          dataKey={accessKey}
          background={{ fill: "#E0F7FA" }}
          cornerRadius={12}
          className={`${chartData[0][accessKey] < 0 ? "fill-red-500" : "fill-cyan-500"
            }`}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="select-none"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className={`${chartData[0][accessKey] < 0
                        ? "fill-red-500"
                        : "fill-cyan-600"
                        } text-4xl font-extrabold`}
                    >
                      {chartData[0][accessKey].toLocaleString()}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 30}
                      className="fill-gray-600 text-lg capitalize"
                    >
                      {chartConfig[accessKey].label}
                    </tspan>
                  </text>
                );
              }
              return null;
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
};

const AboutAlert = ({ isOpen, setIsOpen }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-cyan-600">About Client Analytics</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600">
            This is the analytics page where you can see your progress in
            different measurements. The percentage is calculated by comparing
            the measurements entered at the end with the measurements entered
          </AlertDialogDescription>

          <p className="pt-4 text-sm text-gray-700">
            <span className="font-semibold text-cyan-500">Current:</span> The
            percentage given by comparing the measurements entered at the end
            with the measurements entered now.
          </p>
          <p className="pb-5 pt-2 text-sm text-gray-700">
            <span className="font-semibold text-cyan-500">Initial:</span> The
            percentage is the percentage that is given by comparing the
            measurements that are entered now with the measurements that were
            very first entered on this platform.
          </p>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-gray-400 hover:text-gray-500">
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClientAnalytics;
