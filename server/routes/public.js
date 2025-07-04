const express = require("express");
const router = express.Router();
const { filterCoaches } = require("./public/filter-coach");
const { getPosts } = require("./public/get-posts");
const { getUsersByUsername } = require("./public/get-users");
const { contactUs } = require("./public/contact-us");
const {
  markAttendanceIfNotExists,
} = require("./client/attendance/markAttendanceIfNotExists");

// get user by username route
router.get("/user/:username", async (req, res) => {
  return await getUsersByUsername(req, res);
});

// filter coaches route
router.get("/coaches", async (req, res) => {
  return await filterCoaches(req, res);
});

// get posts route
router.get("/post", async (req, res) => {
  return await getPosts(req, res);
});

// contact us route
router.post("/contact-us", async (req, res) => {
  return await contactUs(req, res);
});

router.post("/attendance/:userId", async (req, res) => {
  return await markAttendanceIfNotExists(req, res);
});

module.exports = router;
