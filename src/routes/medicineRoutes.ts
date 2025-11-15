import express from "express";
import {
  createMedicine,
  getMedicines,
  updateMedicine,
  deleteMedicine,
  getHistory,
  getMedicineById
} from "../controllers/medicineController";

const router = express.Router();

// =======================
// 📦 Medicine Routes
// =======================

// Create new medicine
router.post("/", createMedicine);

// Get all medicines
router.get("/", getMedicines);

// Get single medicine by ID
router.get("/:id", getMedicineById);

// Update existing medicine by ID
router.put("/:id", updateMedicine);

// Delete medicine by ID
router.delete("/:id", deleteMedicine);

// Get medicine history - CHANGE THIS LINE
router.get("/history", getHistory); // Changed from "/history/all" to "/history"

export default router;
