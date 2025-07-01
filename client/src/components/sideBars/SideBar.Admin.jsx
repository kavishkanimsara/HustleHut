import {
  MdAccessTimeFilled,
  MdApproval,
  MdDashboard,
} from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { ImUsers } from "react-icons/im";
import { RiSecurePaymentLine } from "react-icons/ri";
import { CgLogOut } from "react-icons/cg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetUserValue } from "../../state/user-slice";
import axios from "axios";

const urls = [
  { icon: <MdDashboard />, name: "Dashboard", link: "/admin" },
  { icon: <MdApproval />, name: "Coach Verification", link: "/admin/verify-coach" },
  { icon: <MdAccessTimeFilled />, name: "Manage Appointments", link: "/admin/appointments" },
  { icon: <ImUsers />, name: "Manage Users", link: "/admin/users" },
  { icon: <RiSecurePaymentLine />, name: "Manage Payments", link: "/admin/payments" },
  { icon: <IoMdArrowRoundBack />, name: "Back To Home", link: "/" },
];

const AdminSideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = () => {
    axios.post("/common/logout").then(() => {
      dispatch(resetUserValue());
      navigate("/login");
    });
  };

  return (
    <div className="w-full h-20 bg-white text-black flex items-center justify-between px-6 shadow-md">
      {/* Left Section: Title */}
      <div className="text-xl font-bold whitespace-nowrap">Admin Panel</div>

      {/* Middle Section: Navigation Links */}
      <div className="flex items-center gap-4 overflow-x-auto">
        {urls.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm whitespace-nowrap transition ${location.pathname === item.link
              ? "bg-purple-100 text-purple-800 font-semibold"
              : "hover:bg-gray-100"
              }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </div>

      {/* Right Section: Logout Button */}
      <div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-red-600 text-white hover:bg-red-700 transition"
        >
          <CgLogOut className="text-lg" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSideBar;
