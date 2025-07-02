import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateAttendancePdf } from "../lib/attendance.js";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getUserAttendanceByUserId } from "../services/attendanceService.js";
import { useSelector } from "react-redux";

export default function Attendance() {
  const { user } = useSelector((state) => state.user);
  const [attendanceData, setAttendanceData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      getUserAttendanceByUserId().then((data) => {
        setAttendanceData(data.attendance || []);
        console.log("Attendance response:", data);
      });
      console.log("User is:", user);
    }
  }, [user]);

  const handleGenerate = () => {
    const from = dayjs(startDate).format("YYYY-MM-DD");
    const to = dayjs(endDate).format("YYYY-MM-DD");
    generateAttendancePdf(attendanceData, from, to);
  };

  return (
    <div className="mx-auto max-w-xl rounded-lg border border-slate-700 bg-slate-900 p-8">
      {/* Attendance PDF Export Section */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-purple-400">
          Attendance PDF Export
        </h2>
      </div>
      <div className="mb-4 flex items-center gap-4">
        <div>
          <label className="mb-2 block font-bold text-gray-500">
            Start Date
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="MMM dd, yyyy"
            className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-purple-400"
            calendarClassName="!bg-slate-900 !border-slate-700 !text-purple-400"
            popperClassName="!bg-slate-900 !border-slate-700 !text-purple-400"
          />
        </div>

        <div>
          <label className="mb-2 block font-bold text-gray-500">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="MMM dd, yyyy"
            className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-purple-400"
            calendarClassName="!bg-slate-900 !border-slate-700 !text-purple-400"
            popperClassName="!bg-slate-900 !border-slate-700 !text-purple-400"
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="rounded border border-slate-700 bg-purple-700 px-4 py-2 text-white transition-colors hover:bg-purple-800"
      >
        Download PDF
      </button>

      {/* Divider line */}
      <hr className="my-8 border-t border-slate-700" />

      {/* BMI Details Section */}
      <div className="mb-4">
        <h2 className="mb-2 text-xl font-semibold text-purple-400">
          BMI Details
        </h2>
        <p className="mb-4 text-gray-400">
          Track your Body Mass Index (BMI) to monitor your health and fitness
          progress.
        </p>
        <button
          onClick={() => {
            // Navigate to BMI Calculator page
            // You may need to adjust the route as per your app's routing
            navigate("/client/bmi");
          }}
          className="rounded border border-slate-700 bg-purple-700 px-4 py-2 text-white transition-colors hover:bg-purple-800"
        >
          BMI Calculator
        </button>
      </div>
    </div>
  );
}
