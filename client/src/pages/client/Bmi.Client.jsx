import { useState, useEffect } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import ClientTopNavbar from "../../components/sideBars/SideBar.Client";
import { useSelector } from "react-redux";

export default function BmiPage() {
  const [bmiData, setBmiData] = useState(null);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("us");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [cm, setCm] = useState("");
  const [weight, setWeight] = useState("");
  const [bmiResult, setBmiResult] = useState(null);
  const [loading, setLoading] = useState(false); // loading state for add
  const { user } = useSelector((state) => state.user);

  // Load BMI data on mount if user exists
  useEffect(() => {
    const fetchBmiData = async () => {
      if (!user) return;
      try {
        const response = await axios.get("/client/bmi", {
          withCredentials: true,
        });
        if (response && response.data) {
          setBmiData(response.data);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch BMI data",
        );
      }
    };
    fetchBmiData();
  }, [user]);

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
    setFeet("");
    setInches("");
    setCm("");
    setWeight("");
    setBmiResult(null);
  };

  const handleAddRecord = async () => {
    if (!user || !bmiResult) {
      return;
    }
    setLoading(true);
    setError(null);
    const today = new Date().toISOString().split("T")[0];
    const newRecord = {
      heightCm: unit === "metric" ? cm : undefined,
      weightKg: unit === "metric" ? weight : undefined,
      category:
        bmiResult < 18.5
          ? "Underweight"
          : bmiResult < 25
            ? "Normal"
            : bmiResult < 30
              ? "Overweight"
              : "Obese",
      date: today,
      bmi: parseFloat(bmiResult),
      recordedAt: new Date().toISOString(),
    };

    try {
      const postResponse = await axios.post("/client/bmi", newRecord, {
        withCredentials: true,
      });
      if (postResponse && postResponse.data) {
        // Optionally handle postResponse.data.message or insertedId
      }
      const getResponse = await axios.get("/client/bmi", {
        withCredentials: true,
      });
      if (getResponse && getResponse.data) {
        setBmiData(getResponse.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to add or fetch BMI record",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = () => {
    let bmi;
    if (unit === "us") {
      const heightInInches = parseFloat(feet) * 12 + parseFloat(inches || 0);
      if (heightInInches && weight) {
        bmi = (703 * parseFloat(weight)) / (heightInInches * heightInInches);
      }
    } else {
      const heightInMeters = parseFloat(cm) / 100;
      if (heightInMeters && weight) {
        bmi = parseFloat(weight) / (heightInMeters * heightInMeters);
      }
    }
    if (bmi) setBmiResult(bmi.toFixed(2));
  };

  const handleReset = () => {
    setFeet("");
    setInches("");
    setCm("");
    setWeight("");
    setBmiResult(null);
  };

  const plotDates = bmiData?.bmi.map((entry) => entry.date);
  const plotValues = bmiData?.bmi.map((entry) => entry.bmi);

  return (
    <div className="min-h-screen w-full bg-slate-900 text-purple-400">
      {/* sidebar */}
      <ClientTopNavbar />

      {/* main content */}
      <div className="flex w-full justify-center px-4 py-16 lg:ms-72 lg:w-[calc(100%_-_18rem)]">
        <div className="w-full max-w-3xl rounded-lg border border-slate-700 bg-slate-900 p-6 shadow-xl shadow-slate-700/10">
          <h2 className="mb-8 text-center text-2xl font-bold text-purple-400">
            BMI Tracker
          </h2>

          <div className="rounded-lg border border-slate-700 bg-slate-900 p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-purple-400">
                Adult BMI Calculator
              </h3>
              <button
                onClick={handleReset}
                className="text-sm font-medium text-purple-400 hover:underline"
              >
                RESET
              </button>
            </div>

            {/* Unit Selection */}
            <div className="mb-4 flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="unit"
                  value="us"
                  checked={unit === "us"}
                  onChange={handleUnitChange}
                  className="accent-purple-400"
                />
                <span className="text-gray-400">US Customary Units</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="unit"
                  value="metric"
                  checked={unit === "metric"}
                  onChange={handleUnitChange}
                  className="accent-purple-400"
                />
                <span className="text-gray-400">Metric Units</span>
              </label>
            </div>

            {/* Input Fields */}
            {unit === "us" ? (
              <>
                <div className="mb-2 flex items-center gap-2">
                  <label className="mr-2 text-purple-400">Height:</label>
                  <input
                    type="number"
                    placeholder="feet"
                    value={feet}
                    onChange={(e) => setFeet(e.target.value)}
                    className="w-16 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-purple-400 focus:border-purple-400 focus:outline-none"
                  />
                  <span className="text-purple-400">ft</span>
                  <input
                    type="number"
                    placeholder="inches"
                    value={inches}
                    onChange={(e) => setInches(e.target.value)}
                    className="ml-2 w-16 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-purple-400 focus:border-purple-400 focus:outline-none"
                  />
                  <span className="text-purple-400">in</span>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <label className="mr-2 text-purple-400">Weight:</label>
                  <input
                    type="number"
                    placeholder="pounds"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-24 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-purple-400 focus:border-purple-400 focus:outline-none"
                  />
                  <span className="text-purple-400">lbs</span>
                </div>
              </>
            ) : (
              <>
                <div className="mb-2 flex items-center gap-2">
                  <label className="mr-2 text-purple-400">Height:</label>
                  <input
                    type="number"
                    placeholder="centimeters"
                    value={cm}
                    onChange={(e) => setCm(e.target.value)}
                    className="w-24 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-purple-400 focus:border-purple-400 focus:outline-none"
                  />
                  <span className="text-purple-400">cm</span>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <label className="mr-2 text-purple-400">Weight:</label>
                  <input
                    type="number"
                    placeholder="kilograms"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-24 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-purple-400 focus:border-purple-400 focus:outline-none"
                  />
                  <span className="text-purple-400">kg</span>
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleCalculate}
                className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
              >
                Calculate
              </button>
              <button
                onClick={handleAddRecord}
                className={`flex items-center justify-center rounded bg-purple-700 px-4 py-2 text-white hover:bg-purple-800 ${loading ? "cursor-not-allowed opacity-60" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="mr-2 h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  "ADD"
                )}
              </button>
            </div>

            {/* BMI Result */}
            {bmiResult && (
              <p className="mt-4 text-center font-bold text-purple-400">
                Your BMI: {bmiResult}
              </p>
            )}
          </div>

          {/* Chart + History Section */}
          {bmiData && (
            <div className="mt-8 flex flex-wrap items-start justify-between gap-8">
              {/* Chart Column */}
              <div className="min-w-[350px] max-w-full flex-1">
                <h3 className="mb-4 font-semibold text-purple-400">
                  BMI Chart
                </h3>
                <div className="overflow-x-auto rounded-lg border border-slate-700 bg-slate-900 p-2">
                  <Plot
                    data={[
                      {
                        x: plotDates,
                        y: plotValues,
                        type: "scatter",
                        mode: "lines+markers",
                        marker: { color: "#a78bfa" },
                        name: "Your BMI",
                        line: { color: "#a78bfa" },
                      },
                    ]}
                    layout={{
                      paper_bgcolor: "#1e293b",
                      plot_bgcolor: "#1e293b",
                      font: { color: "#a78bfa" },
                      title: "BMI Over Time",
                      xaxis: { title: "Date", color: "#a78bfa" },
                      yaxis: {
                        title: "BMI",
                        range: [10, 40],
                        color: "#a78bfa",
                      },
                      shapes: [
                        {
                          type: "rect",
                          xref: "paper",
                          x0: 0,
                          x1: 1,
                          y0: 0,
                          y1: 18.5,
                          fillcolor: "#312e81",
                          opacity: 0.2,
                          line: { width: 0 },
                        },
                        {
                          type: "rect",
                          xref: "paper",
                          x0: 0,
                          x1: 1,
                          y0: 18.5,
                          y1: 25,
                          fillcolor: "#4f46e5",
                          opacity: 0.2,
                          line: { width: 0 },
                        },
                        {
                          type: "rect",
                          xref: "paper",
                          x0: 0,
                          x1: 1,
                          y0: 25,
                          y1: 30,
                          fillcolor: "#a78bfa",
                          opacity: 0.15,
                          line: { width: 0 },
                        },
                        {
                          type: "rect",
                          xref: "paper",
                          x0: 0,
                          x1: 1,
                          y0: 30,
                          y1: 40,
                          fillcolor: "#f43f5e",
                          opacity: 0.12,
                          line: { width: 0 },
                        },
                      ],
                      height: 400,
                      margin: { t: 40, l: 40, r: 20, b: 40 },
                      autosize: true,
                    }}
                    style={{ width: "100%", height: "100%" }}
                    useResizeHandler={true}
                  />
                </div>
              </div>

              {/* History Column */}
              <div className="min-w-[250px] flex-1 rounded-lg border border-slate-700 bg-slate-900 p-4">
                <h3 className="mb-4 font-semibold text-purple-400">
                  BMI History
                </h3>
                <p>
                  <strong className="text-purple-400">Category:</strong>{" "}
                  {bmiData.category}
                </p>
                <ul className="list-none p-0">
                  {bmiData.bmi.map((entry, idx) => (
                    <li key={idx} className="mb-2">
                      <span className="font-medium text-purple-400">
                        {entry.date}:
                      </span>{" "}
                      <span className="text-purple-400">{entry.bmi}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
