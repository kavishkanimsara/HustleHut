import LatestProgressTable from "../../components/coach/LatestProgressTable";
import CoachSideBar from "../../components/sideBars/SideBar.Coach";
const ProgressOverview = () => {
  return (
    <div className="min-h-screen">
      <CoachSideBar />
      <LatestProgressTable />
    </div>
  );
};

export default ProgressOverview;
