const { db } = require("../../../lib/db");

const markAttendanceIfNotExists = async (req, res) => {
  const userId = req.params.userId;

  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];
  const checkInTime = today.toTimeString().slice(0, 5);

  try {
    const existing = await db.attendance.findUnique({
      where: { userId },
    });

    if (!existing) {
      // Create new record
      const newAttendance = {
        date: todayDate,
        status: "Present",
        checkIn: checkInTime,
        checkOut: null,
      };

      const summary = {
        totalDays: 1,
        present: 1,
        late: 0,
        absent: 0,
      };

      await db.attendance.create({
        data: {
          userId,
          attendance: [newAttendance],
          summary,
          recordedAt: today,
        },
      });

      return res
        .status(201)
        .json({ message: "Attendance created and marked." });
    }

    const alreadyMarked = existing.attendance.some(
      (entry) => entry.date === todayDate
    );

    if (alreadyMarked) {
      return res
        .status(200)
        .json({ message: "Attendance already marked for today." });
    }

    // Add today's record
    const updatedAttendance = [
      ...existing.attendance,
      {
        date: todayDate,
        status: "Present",
        checkIn: checkInTime,
        checkOut: null,
      },
    ];

    const updatedSummary = {
      ...existing.summary,
      totalDays: existing.summary.totalDays + 1,
      present: existing.summary.present + 1,
    };

    await db.attendance.update({
      where: { userId },
      data: {
        attendance: updatedAttendance,
        summary: updatedSummary,
        recordedAt: today,
      },
    });

    return res.status(200).json({ message: "Attendance marked for today." });
  } catch (err) {
    console.error("Error marking attendance:", err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { markAttendanceIfNotExists };
