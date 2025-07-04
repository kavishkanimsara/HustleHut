const { db } = require("../../../lib/db");

// ✅ Save new progress entry
const saveProgress = async (req, res) => {
  const userId = req.user.id;
  const { description } = req.body;

  // Extract file paths from uploaded files
  const images = req.files
    ? req.files.map((file) => `/uploads/progress/${file.filename}`)
    : [];

  try {
    const created = await db.progress.create({
      data: {
        userId,
        images,
        description,
      },
    });
    return res.status(201).json(created);
  } catch (error) {
    console.error("Error saving progress:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Update trainer's feedback (schedule + comments)
const updateTrainerFeedback = async (req, res) => {
  const { progressId } = req.params;
  const { schedule, comments } = req.body;
  try {
    const updated = await db.progress.update({
      where: { id: progressId },
      data: { schedule, comments },
    });
    return res.json(updated);
  } catch (err) {
    console.error("Error updating feedback:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Get all progress records
const getAllProgress = async (req, res) => {
  try {
    const all = await db.progress.findMany();
    return res.json(all);
  } catch (err) {
    console.error("Error fetching progress:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Get all progress with user info
const getAllProgressWithUserInfo = async (req, res) => {
  try {
    const all = await db.progress.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true,
          },
        },
      },
    });
    return res.json(all);
  } catch (err) {
    console.error("Error fetching with user info:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Get progress records for a specific user
const getProgressByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const progress = await db.progress.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return res.json(progress);
  } catch (err) {
    console.error("Error fetching user progress:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Get progress records for a specific user by query parameter
const getUserProgressByID = async (req, res) => {
  const { userId } = req.query;
  try {
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const progress = await db.progress.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return res.json(progress);
  } catch (err) {
    console.error("Error fetching user progress:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Get latest progress entry per user
const getLatestProgressPerUser = async (req, res) => {
  try {
    const users = await db.user.findMany({
      include: {
        progress: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    const result = users.map((user) => {
      const latest = user.progress[0];
      return {
        userId: user.id,
        name: user.name,
        date: latest?.createdAt,
        schedule: latest?.schedule || "",
      };
    });

    return res.json(result);
  } catch (err) {
    console.error("Error fetching latest progress:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Update user comment on their progress entry
const updateUserComment = async (req, res) => {
  const { progressId } = req.params;
  const { newComment } = req.body;
  try {
    const updated = await db.progress.update({
      where: { id: progressId },
      data: { userComment: newComment },
    });
    return res.json(updated);
  } catch (err) {
    console.error("Error updating comment:", err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  saveProgress,
  updateTrainerFeedback,
  getAllProgress,
  getAllProgressWithUserInfo,
  getProgressByUserId,
  getUserProgressByID,
  getLatestProgressPerUser,
  updateUserComment,
};
