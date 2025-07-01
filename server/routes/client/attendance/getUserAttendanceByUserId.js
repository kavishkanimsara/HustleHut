const { db } = require("../../../lib/db");

const getUserAttendanceByUserId = async (req, res) => {
    const userId = req.user.id;

    try {
        const attendance = await db.attendance.findUnique({
            where: { userId },
            select: {
                id: true,
                attendance: true,
                summary: true,
                recordedAt: true,
            },
        });

        if (!attendance) {
            return res.status(404).json({ message: "Attendance not found." });
        }

        return res.status(200).json(attendance);
    } catch (err) {
        console.error("Error fetching attendance by userId:", err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports = { getUserAttendanceByUserId };
