import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getProgressByUserId,
  updateTrainerFeedback,
} from "../../services/ProgressService";
import ProgressDetails from "../../components/client/ProgressDetails";
import ProgressHistoryList from "../../components/client/ProgressHistoryList";
import DialogBox from "../../components/client/DialogBox";
import ClientTopNavbar from "../../components/sideBars/SideBar.Client";

const styles = {
  container: { padding: "20px", fontFamily: "Arial" },
  mainContent: { display: "flex", marginTop: "20px" },
  leftPane: { flex: 1, padding: "20px", borderRight: "1px solid #ccc" },
  rightPane: { flex: 1, padding: "20px" },
};

const ProgressHistory = () => {
  const [progressList, setProgressList] = useState([]);
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState("success");

  const { userId } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role || "user";

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const data = await getProgressByUserId(userId);
        setProgressList(data);
      } catch (err) {
        setDialogMessage("Failed to fetch progress list: " + err.message);
        setDialogType("error");
        setShowDialog(true);
      }
    };
    loadProgress();
  }, [userId]);

  const handleSaveFeedback = async (schedule, comments) => {
    if (!selectedProgress) return;
    try {
      await updateTrainerFeedback(selectedProgress._id, schedule, comments);
      setDialogMessage("✅ Feedback saved successfully!");
      setDialogType("success");
      setShowDialog(true);

      const updated = await getProgressByUserId(userId);
      setProgressList(updated);
    } catch (err) {
      setDialogMessage("❌ Failed to save feedback: " + err.message);
      setDialogType("error");
      setShowDialog(true);
    }
  };

  return (
    <div style={styles.container}>
      <ClientTopNavbar />
      <h1>Trainer Progress View</h1>
      <div style={styles.mainContent}>
        <div style={styles.leftPane}>
          <ProgressDetails
            progress={selectedProgress}
            onSaveFeedback={handleSaveFeedback}
            userRole={userRole}
          />
        </div>
        <div style={styles.rightPane}>
          <ProgressHistoryList
            progressList={progressList}
            selectedProgress={selectedProgress}
            onSelectProgress={setSelectedProgress}
          />
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
