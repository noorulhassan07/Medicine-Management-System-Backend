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
    
    // Log to history - FIXED: Access properties directly from medicine object
    await MedicineHistory.create({
      medicineId: medicine._id,
      medicineName: medicine.name, // Access directly from medicine
      action: 'created',
      details: `Added ${medicine.name} to inventory (Qty: ${medicine.quantity}, Price: ${medicine.price} PKR)`,
      newData: medicine.toObject() // Use toObject() to get plain JavaScript object
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
    
    // Log to history - FIXED: Access properties directly
    await MedicineHistory.create({
      medicineId: medicine._id,
      medicineName: medicine.name, // Access directly from medicine
      action: 'updated',
      details: `Updated ${medicine.name}`,
      newData: medicine.toObject() // Use toObject()
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
    
    // Log to history before deleting - FIXED: Access properties directly
    await MedicineHistory.create({
      medicineId: medicine._id,
      medicineName: medicine.name, // Access directly from medicine
      action: 'deleted',
      details: `Removed ${medicine.name} from inventory`,
      previousData: medicine.toObject() // Use toObject()
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
