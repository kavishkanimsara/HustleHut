import { useEffect, useState } from "react";
import axios from "axios";
import ProgressDetails from "../../components/client/ProgressDetails";
import ProgressHistoryList from "../../components/client/ProgressHistoryList";
import DialogBox from "../../components/client/DialogBox";
import ClientTopNavbar from "../../components/sideBars/SideBar.Client";
import { useSelector } from "react-redux";

const ProgressHistory = () => {
  const [progressList, setProgressList] = useState([]);
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState("success");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const userRole = user?.role || "user";

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/client/progress", {
          withCredentials: true,
        });
        if (response && response.data) {
          setProgressList(response.data);
        }
      } catch (err) {
        setDialogMessage(
          "Failed to fetch progress list: " +
            (err.response?.data?.message || err.message),
        );
        setDialogType("error");
        setShowDialog(true);
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, []);

  const handleSaveFeedback = async (schedule, comments) => {
    if (!selectedProgress) return;
    try {
      await axios.put(
        `/client/progress/${selectedProgress.id}/feedback`,
        {
          schedule,
          comments,
        },
        {
          withCredentials: true,
        },
      );

      setDialogMessage("✅ Feedback saved successfully!");
      setDialogType("success");
      setShowDialog(true);

      // Refresh the progress list
      const response = await axios.get("/client/progress", {
        withCredentials: true,
      });
      if (response && response.data) {
        setProgressList(response.data);
      }
    } catch (err) {
      setDialogMessage(
        "❌ Failed to save feedback: " +
          (err.response?.data?.message || err.message),
      );
      setDialogType("error");
      setShowDialog(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-purple-400">
      <ClientTopNavbar />
      <div className="px-8">
        <div className="mx-auto w-full rounded-lg border border-slate-700 bg-slate-900 p-6 shadow-xl shadow-slate-700/10">
          <h2 className="mb-8 text-center text-2xl font-bold text-purple-400">
            Progress History
          </h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="text-purple-400">Loading progress history...</div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="flex-1 rounded-lg border border-slate-700 bg-slate-900 p-4">
                <ProgressHistoryList
                  progressList={progressList}
                  selectedProgress={selectedProgress}
                  onSelectProgress={setSelectedProgress}
                />
              </div>
              <div className="flex-1 rounded-lg border border-slate-700 bg-slate-900 p-4">
                <ProgressDetails
                  progress={selectedProgress}
                  onSaveFeedback={handleSaveFeedback}
                  userRole={userRole}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {showDialog && (
        <DialogBox
          message={dialogMessage}
          type={dialogType}
          onClose={() => setShowDialog(false)}
        />
      )}
    </div>
  );
};

export default ProgressHistory;
