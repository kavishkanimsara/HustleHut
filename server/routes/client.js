const express = require("express");
const {
  createPendingSession,
  completeSessionReservation,
  updateTimeSlot,
} = require("./client/session/create-session");
const { addFigureData } = require("./client/analytics/add-figure-data");
const { getUserAnalytics } = require("./client/analytics/get-analytics");
const { getSession } = require("./client/session/get-session");
const { finishSession } = require("./client/session/finish-session");
const { getBmiByUserId } = require("./client/bmi/getBmiByUserId");
const { addOrUpdateBmiRecord } = require("./client/bmi/addOrUpdateBmiRecord");
const {
  getUserAttendanceByUserId,
} = require("./client/attendance/getUserAttendanceByUserId");
const {
  markAttendanceIfNotExists,
} = require("./client/attendance/markAttendanceIfNotExists");
const {getAllProgress, saveProgress, getAllProgressWithUserInfo, getLatestProgressPerUser, getProgressByUserId,
  updateTrainerFeedback, updateUserComment
} = require("./client/progress/progress.controller");
const router = express.Router();

router.get("/session", async (req, res) => {
  return await getSession(req, res);
});

router.post("/session", async (req, res) => {
  return await createPendingSession(req, res);
});

router.post("/session/payment", async (req, res) => {
  return await completeSessionReservation(req, res);
});

router.post("/session/finish/:id", async (req, res) => {
  return await finishSession(req, res);
});

router.put("/session/:id", async (req, res) => {
  return await updateTimeSlot(req, res);
});

router.post("/figure", async (req, res) => {
  return await addFigureData(req, res);
});
// ✅ Save a new progress entry (POST)
router.post("/progress", async (req, res) => {
  return await saveProgress(req, res);
});

// ✅ Get all progress entries (raw)
router.get("/progress", async (req, res) => {
  return await getAllProgress(req, res);
});

// ✅ Get all progress entries with user info
router.get("/progress-with-users", async (req, res) => {
  return await getAllProgressWithUserInfo(req, res);
});

// ✅ Get all latest progress (one per user)
router.get("/progress/latest-per-user", async (req, res) => {
  return await getLatestProgressPerUser(req, res);
});

// ✅ Get progress by userId (e.g. for trainer view)
router.get("/progress/user/:userId", async (req, res) => {
  return await getProgressByUserId(req, res);
});

// ✅ Update trainer feedback (schedule + comment)
router.put("/progress/:progressId/feedback", async (req, res) => {
  return await updateTrainerFeedback(req, res);
});

// ✅ Update user comment on their own progress
router.put("/:progressId/comment", async (req, res) => {
  return await updateUserComment(req, res);
});

router.get("/analytics/:username/:type?", async (req, res) => {
  return await getUserAnalytics(req, res);
});
router.get("/bmi", async (req, res) => {
  return await getBmiByUserId(req, res);
});
router.post("/bmi", async (req, res) => {
  return await addOrUpdateBmiRecord(req, res);
});
router.get("/attendance", async (req, res) => {
  return await getUserAttendanceByUserId(req, res);
});
router.post("/attendance", async (req, res) => {
  return await markAttendanceIfNotExists(req, res);
});
module.exports = router;
