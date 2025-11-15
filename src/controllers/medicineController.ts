import { Request, Response } from "express";
import Medicine from "../models/Medicine";
import MedicineHistory from "../models/MedicineHistory";

// Get all medicines
export const getMedicines = async (req: Request, res: Response) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch medicines" });
  }
};

// Create new medicine
export const createMedicine = async (req: Request, res: Response) => {
  try {
    const medicine = new Medicine(req.body);
    await medicine.save();
    
    // Log to history
    await MedicineHistory.create({
      medicineId: medicine._id,
      medicineName: req.body.name, // Use from request body
      action: 'created',
      details: `Added ${req.body.name} to inventory (Qty: ${req.body.quantity}, Price: ${req.body.price} PKR)`,
      newData: req.body
    });
    
    res.status(201).json(medicine);
  } catch (error) {
    res.status(400).json({ error: "Failed to create medicine" });
  }
};

// Update medicine
export const updateMedicine = async (req: Request, res: Response) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    
    // Log to history
    await MedicineHistory.create({
      medicineId: medicine._id,
      medicineName: req.body.name || medicine.name, // Use from request or existing
      action: 'updated',
      details: `Updated medicine details`,
      newData: req.body
    });
    
    res.json(medicine);
  } catch (error) {
    res.status(400).json({ error: "Failed to update medicine" });
  }
};

// Delete medicine
export const deleteMedicine = async (req: Request, res: Response) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    
    // Convert to plain object to avoid TypeScript issues
    const medicineData = medicine.toObject();
    
    // Log to history before deleting
    await MedicineHistory.create({
      medicineId: medicine._id,
      medicineName: medicineData.name,
      action: 'deleted',
      details: `Removed ${medicineData.name} from inventory`,
      previousData: medicineData
    });
    
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete medicine" });
  }
};

// Get history
export const getHistory = async (req: Request, res: Response) => {
  try {
    const history = await MedicineHistory.find().sort({ timestamp: -1 }).limit(50);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

// Get single medicine by ID
export const getMedicineById = async (req: Request, res: Response) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch medicine" });
  }
};
