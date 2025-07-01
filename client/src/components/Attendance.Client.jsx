import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateAttendancePdf } from "../lib/attendance.js";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getUserAttendanceByUserId } from "../services/attendanceService.js";

export default function Attendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      getUserAttendanceByUserId(user._id).then((data) => {
        setAttendanceData(data.attendance || []);
      });
    }
  }, []);

  const handleGenerate = () => {
    const from = dayjs(startDate).format("YYYY-MM-DD");
    const to = dayjs(endDate).format("YYYY-MM-DD");
    generateAttendancePdf(attendanceData, from, to);
  };


  return (
    <div className="p-8 bg-slate-900 border border-slate-700 rounded-lg max-w-xl mx-auto">
      {/* Attendance PDF Export Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-purple-400">Attendance PDF Export</h2>
      </div>
      <div className="flex gap-4 items-center mb-4">
        <div>
          <label className="block font-bold mb-2 text-gray-500">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="MMM dd, yyyy"
            className="bg-slate-900 border border-slate-700 text-purple-400 px-2 py-1 rounded w-full"
            calendarClassName="!bg-slate-900 !border-slate-700 !text-purple-400"
            popperClassName="!bg-slate-900 !border-slate-700 !text-purple-400"
          />
        </div>

        <div>
          <label className="block font-bold mb-2 text-gray-500">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="MMM dd, yyyy"
            className="bg-slate-900 border border-slate-700 text-purple-400 px-2 py-1 rounded w-full"
            calendarClassName="!bg-slate-900 !border-slate-700 !text-purple-400"
            popperClassName="!bg-slate-900 !border-slate-700 !text-purple-400"
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded border border-slate-700 transition-colors"
      >
        Download PDF
      </button>

      {/* Divider line */}
      <hr className="my-8 border-t border-slate-700" />

      {/* BMI Details Section */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-purple-400 mb-2">BMI Details</h2>
        <p className="text-gray-400 mb-4">
          Track your Body Mass Index (BMI) to monitor your health and fitness progress.
        </p>
        <button
          onClick={() => {
            // Navigate to BMI Calculator page
            // You may need to adjust the route as per your app's routing
            navigate("/client/bmi");
          }}
          className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded border border-slate-700 transition-colors"
        >
          BMI Calculator
        </button>
      </div>
    </div>
  );
}
