const { db } = require("../../../lib/db");

const addOrUpdateBmiRecord = async (req, res) => {
  const userId = req.user.id;

  const {
    heightCm,
    weightKg,
    category,
    date, // e.g., "2025-07-01"
    bmi, // e.g., 21.5
    recordedAt, // optional: ISO string
  } = req.body;

  const newBmiEntry = { date, bmi };

  try {
    const existing = await db.BmiRecord.findUnique({
      where: { userId },
    });

    if (!existing) {
      // Insert new document
      const created = await db.BmiRecord.create({
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
      const filteredBmi = existing.bmi.filter((entry) => entry.date !== date);

      // Add the new entry at the end
      const updatedBmi = [...filteredBmi, newBmiEntry];

      const updated = await db.BmiRecord.update({
        where: { userId },
        data: {
          heightCm,
          weightKg,
          category,
          recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
          bmi: updatedBmi, // append or replace entry for the date
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
