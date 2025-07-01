const { db } = require("../../../lib/db");

const addOrUpdateBmiRecord = async (req, res) => {
    const userId = req.user.id;

    const {
        heightCm,
        weightKg,
        category,
        date,      // e.g., "2025-07-01"
        bmi,       // e.g., 21.5
        recordedAt // optional: ISO string
    } = req.body;

    const newBmiEntry = { date, bmi };

    try {
        const existing = await db.bmiRecord.findUnique({
            where: { userId },
        });

        if (!existing) {
            // Insert new document
            const created = await db.bmiRecord.create({
                data: {
                    userId,
                    heightCm,
                    weightKg,
                    category,
                    recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
                    bmi: [newBmiEntry],
                },
            });
            return res.status(201).json(created);
        } else {
            // Remove duplicate date if exists
            const filteredBmi = existing.bmi.filter(entry => entry.date !== date);

            const updated = await db.bmiRecord.update({
                where: { userId },
                data: {
                    heightCm,
                    weightKg,
                    category,
                    recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
                    bmi: [...filteredBmi, newBmiEntry], // updated BMI array
                },
            });

            return res.status(200).json(updated);
        }
    } catch (error) {
        console.error("Error updating/inserting BMI record:", error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { addOrUpdateBmiRecord };
