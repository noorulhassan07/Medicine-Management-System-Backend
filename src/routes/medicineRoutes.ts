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

// Create new medicine
router.post("/", createMedicine);

// Get all medicines
router.get("/", getMedicines);

// ⭐ FIX: Put history BEFORE :id route
router.get("/history", getHistory);

// Get single medicine by ID
router.get("/:id", getMedicineById);

// Update existing medicine by ID
router.put("/:id", updateMedicine);

// Delete medicine by ID
router.delete("/:id", deleteMedicine);

export default router;
