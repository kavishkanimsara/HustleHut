import ClientGeneralDetails from "../../components/client/GeneralDetails.Client";
import ClientSideBar from "../../components/sideBars/SideBar.Client";
import Attendance from "../../components/Attendance.Client";

const ClientDetails = () => {
  return (
    <div className="w-full">
      {/* sidebar */}
      <ClientSideBar />

      {/* main content area */}
      <div className="flex w-full justify-center px-4 py-16 lg:ms-72 lg:w-[calc(100%_-_18rem)]">
        <ClientGeneralDetails />
        <Attendance />
      </div>
    </div>
  );
};

export default ClientDetails;
