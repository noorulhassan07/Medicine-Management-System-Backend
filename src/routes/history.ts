import express from "express";
import MedicineHistory from "../models/MedicineHistory";

const router = express.Router();

// GET /api/medicines/history - Get all medicine history
router.get("/", async (req, res) => {
  try {
    const history = await MedicineHistory.find()
      .sort({ timestamp: -1 }) // Most recent first
      .limit(100); // Limit to 100 most recent entries

    res.json(history);
  } catch (error) {
    console.error("Error fetching medicine history:", error);
    res.status(500).json({ error: "Failed to fetch medicine history" });
  }
});

// GET /api/medicines/history/:medicineId - Get history for specific medicine
router.get("/:medicineId", async (req, res) => {
  try {
    const { medicineId } = req.params;
    const history = await MedicineHistory.find({ medicineId })
      .sort({ timestamp: -1 });

    res.json(history);
  } catch (error) {
    console.error("Error fetching medicine history:", error);
    res.status(500).json({ error: "Failed to fetch medicine history" });
  }
});

export default router;
