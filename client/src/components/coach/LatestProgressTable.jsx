import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LatestProgressTable = () => {
  const [progressData, setProgressData] = useState([]);
  const [search, setSearch] = useState("");
  const [resultsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/coach/progress", {
          withCredentials: true,
        });
        setProgressData(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Failed to load progress data:", err);
      }
    };
    fetchData();
  }, []);

  const filteredData = progressData.filter((item) =>
    item?.description?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / resultsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage,
  );

  const handleRowClick = (userId) => {
    if (userId) {
      navigate(`/coach/progress/${userId}`);
    }
  };

  return (
    <div className="mt-8 flex w-full items-center justify-center px-8 py-8 text-purple-400">
      <div className="w-full rounded-lg border border-slate-700 bg-slate-900 p-8 shadow-xl shadow-slate-700/10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-bold text-purple-400">
              Progress
            </h2>
            <p className="text-gray-400">All Progress History</p>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-purple-400 focus:border-purple-400 focus:outline-none md:w-64"
          />

          <div className="flex items-center gap-2">
            <label className="text-gray-400">Show Results</label>
            {/* <select
              value={resultsPerPage}
              onChange={(e) => {
                setResultsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-purple-400 focus:border-purple-400 focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select> */}
          </div>
        </div>

        {/* Table */}
        <div className="mb-6 overflow-x-auto rounded-lg border border-slate-700 bg-slate-900">
          <table className="min-w-full divide-y divide-slate-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-purple-400">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-semibold text-purple-400">
                  Description
                </th>
                <th className="px-4 py-3 text-left font-semibold text-purple-400">
                  Schedule
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((entry, idx) => (
                <tr
                  key={idx}
                  onClick={() => handleRowClick(entry.userId)}
                  className="cursor-pointer transition-colors hover:bg-slate-800"
                >
                  <td className="border-b border-slate-800 px-4 py-2">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border-b border-slate-800 px-4 py-2">
                    {entry.description}
                  </td>
                  <td className="border-b border-slate-800 px-4 py-2">
                    {entry.schedule?.length > 20
                      ? `${entry.schedule.substring(0, 50)}...`
                      : entry.schedule}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span className="text-gray-400">
            Showing {paginatedData.length} of {filteredData.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`rounded border border-slate-700 bg-slate-800 px-3 py-1 font-semibold text-purple-400 transition-colors hover:bg-purple-700 hover:text-white ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded border border-slate-700 px-3 py-1 font-semibold ${currentPage === page ? "bg-purple-700 text-white" : "bg-slate-800 text-purple-400 hover:bg-purple-700 hover:text-white"} transition-colors`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className={`rounded border border-slate-700 bg-slate-800 px-3 py-1 font-semibold text-purple-400 transition-colors hover:bg-purple-700 hover:text-white ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestProgressTable;
