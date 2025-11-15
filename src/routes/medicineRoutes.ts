import express from "express";
import {
  createMedicine,
  getMedicines,
  updateMedicine,
  deleteMedicine,
  getHistory
} from "../controllers/medicineController";

const router = express.Router();

// =======================
// 📦 Medicine Routes
// =======================

// Create new medicine
router.post("/", createMedicine);

// Get all medicines
router.get("/", getMedicines);

// Update existing medicine by ID
router.put("/:id", updateMedicine);

// Delete medicine by ID
router.delete("/:id", deleteMedicine);

// Get medicine history
router.get("/history", getHistory);

export default router;
