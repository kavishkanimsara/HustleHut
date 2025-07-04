import PropTypes from "prop-types";
import { useState } from "react";

function ProgressHistoryList({ progressList, onSelectProgress }) {
  const [selectedProgress, setSelectedProgress] = useState(null);

  const handleSelect = (progress) => {
    setSelectedProgress(progress);
    onSelectProgress(progress); // Notify parent component
  };

  return (
    <div className="w-full rounded-lg border border-slate-700 bg-slate-900 p-4 md:p-6">
      <h3 className="mb-4 text-xl font-bold text-purple-400">
        Progress History
      </h3>

      {progressList.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-gray-400">
          <p className="text-center">No progress uploaded yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="p-3 text-left text-sm font-semibold text-purple-400">
                  Date
                </th>
                <th className="p-3 text-left text-sm font-semibold text-purple-400">
                  Description
                </th>
                <th className="p-3 text-left text-sm font-semibold text-purple-400">
                  Comments
                </th>
              </tr>
            </thead>
            <tbody>
              {progressList.map((progress) => (
                <tr
                  key={progress.id}
                  onClick={() => handleSelect(progress)}
                  className={`cursor-pointer border-b border-slate-800 transition-colors hover:bg-slate-800 ${
                    selectedProgress?.id === progress.id
                      ? "border-purple-500 bg-purple-900/20"
                      : ""
                  }`}
                >
                  <td className="p-3 text-sm text-purple-400">
                    {new Date(progress.createdAt).toLocaleDateString()}
                  </td>
                  <td className="max-w-xs truncate p-3 text-sm text-purple-400">
                    {progress.description}
                  </td>
                  
                  <td className="max-w-xs truncate p-3 text-sm text-purple-400">
                    {progress.comments || "No comments"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

ProgressHistoryList.propTypes = {
  progressList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(PropTypes.string).isRequired,
      description: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      schedule: PropTypes.string,
      comments: PropTypes.string,
    }),
  ).isRequired,
  onSelectProgress: PropTypes.func.isRequired,
};

export default ProgressHistoryList;
