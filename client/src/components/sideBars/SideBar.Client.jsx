import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
  MdDashboard,
  MdAccessTimeFilled,
  MdOutlinePostAdd,
  MdFeedback,
} from "react-icons/md";
import { FaPencilRuler, FaCircle } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoChatbox } from "react-icons/io5";
import { CgLogOut } from "react-icons/cg";
import { AiOutlineIssuesClose } from "react-icons/ai";

import { resetUserValue } from "../../state/user-slice";
import { errorToast, successToast } from "../../utils/toastify";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const urls = [
  { icon: <MdDashboard />, name: "Dashboard", link: "/client" },
  { icon: <FaPencilRuler />, name: "Measurements", link: "/client/measurements" },
  { icon: <MdAccessTimeFilled />, name: "Appointments", link: "/client/appointments" },
  // { icon: <IoChatbox />, name: "Chat", link: "/client/chat" },
  //{ icon: <MdOutlinePostAdd />, name: "My Posts", link: "/client/posts" },
  { icon: <TbListDetails />, name: "Details", link: "/client/general" },
  { icon: <IoMdArrowRoundBack />, name: "Back To Home", link: "/" },
];

const ClientTopNavbar = () => {
  const { user } = useSelector((state) => state.user);
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [unreadIssues, setUnreadIssues] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = () => {
    axios.post("/common/logout").then(() => {
      dispatch(resetUserValue());
      navigate("/login");
    });
  };

  useEffect(() => {
    axios
      .get("/common/issues/unread")
      .then(({ data }) => {
        if (data.unread > 0) setUnreadIssues(data.unread);
      })
      .catch(() => errorToast("Failed to get unread issues"));
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 shadow-md bg-white text-black">
        {/* Left: Logo/Title */}
        <div className="font-bold text-lg">Client Panel</div>

        {/* Center: Nav Links */}
        <div className="hidden md:flex space-x-6 overflow-x-auto">
          {urls.map(({ icon, name, link }, i) => (
            <Link
              key={i}
              to={link}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm whitespace-nowrap transition ${location.pathname === link
                ? "bg-gray-200 font-semibold"
                : "hover:bg-gray-100"
                }`}
            >
              {icon}
              {name}
            </Link>
          ))}
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsFeedbackOpen(true)}
            title="Submit Feedback"
            className="flex items-center gap-1 rounded bg-black text-white px-3 py-1 text-sm font-medium hover:bg-gray-800 transition"
          >
            <MdFeedback className="text-lg" />
            Feedback
          </button>

          <button
            onClick={() => setIsIssueOpen(true)}
            title="Submit Issue"
            className="flex items-center gap-1 rounded bg-black text-white px-3 py-1 text-sm font-medium hover:bg-gray-800 transition"
          >
            Issues
            <AiOutlineIssuesClose className="text-lg" />
            {unreadIssues > 0 && (
              <FaCircle className="ml-1 h-3 w-3 text-sky-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={logout}
            title="Logout"
            className="flex items-center gap-1 rounded bg-red-600 text-white px-3 py-1 text-sm font-medium hover:bg-red-700 transition"
          >
            <CgLogOut className="text-lg" />
            Logout
          </button>
        </div>
      </nav>

      <div className="h-16" />

      <SubmitIssue isOpen={isIssueOpen} setIsOpen={setIsIssueOpen} />
      <SubmitFeedback isOpen={isFeedbackOpen} setIsOpen={setIsFeedbackOpen} />
    </>
  );
};

const SubmitIssue = ({ isOpen, setIsOpen }) => {
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!issue.trim()) return errorToast("Issue is required");
    setLoading(true);
    try {
      await axios.post("/common/issues", { issue });
      successToast("Issue submitted successfully");
      setIsOpen(false);
      setIssue("");
    } catch (err) {
      errorToast(err?.response?.data.error || "Failed to submit issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit Issue</DialogTitle>
          <DialogDescription>
            Please describe your issue in detail so that we can help you better.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3">
          <Label htmlFor="issue" className="flex justify-between">
            Describe Issue
            <span className="text-sm text-gray-400">{issue.length}/1000</span>
          </Label>
          <Textarea
            id="issue"
            rows={6}
            maxLength={1000}
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            placeholder="Write your issue here"
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="bg-black hover:bg-gray-800 text-white"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Issue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SubmitFeedback = ({ isOpen, setIsOpen }) => {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) return errorToast("Feedback is required");
    setLoading(true);
    try {
      await axios.post("/common/feedback", { feedback });
      successToast("Feedback submitted successfully");
      setIsOpen(false);
      setFeedback("");
    } catch (err) {
      errorToast(err?.response?.data.error || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription>
            Please describe your feedback in detail so that we can help you better.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3">
          <Label htmlFor="feedback" className="flex justify-between">
            Feedback
            <span className="text-sm text-gray-400">{feedback.length}/1000</span>
          </Label>
          <Textarea
            id="feedback"
            rows={6}
            maxLength={1000}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback here"
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="bg-black hover:bg-gray-800 text-white"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientTopNavbar;
