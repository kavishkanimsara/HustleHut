const { db } = require("../../../lib/db");

const getBmiByUserId = async (req, res) => {
    const userId = req.user.id;

    try {
        const bmiRecord = await db.bmiRecord.findUnique({
            where: { userId },
            select: {
                id: true,
                heightCm: true,
                weightKg: true,
                category: true,
                recordedAt: true,
                bmi: true, // array of { date, bmi }
            },
        });

        if (!bmiRecord) {
            return res.status(404).json({ message: "BMI record not found." });
        }

        return res.status(200).json(bmiRecord);
    } catch (error) {
        console.error("Error fetching BMI record:", error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { getBmiByUserId };
