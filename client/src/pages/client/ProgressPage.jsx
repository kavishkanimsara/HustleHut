import ProgressForm from "../../components/client/ProgressForm";
import ClientTopNavbar from "../../components/sideBars/SideBar.Client";

function ProgressPage() {
  return (
    <div className="min-h-screen w-full bg-slate-900 text-purple-400">
      <ClientTopNavbar />
      <ProgressForm />
    </div>
  );
}

export default ProgressPage;
