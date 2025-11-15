import { Request, Response } from "express";
import Medicine from "../models/Medicine";
import MedicineHistory from "../models/MedicineHistory";

// Create new medicine
export const createMedicine = async (req: Request, res: Response) => {
  try {
    const medicine = new Medicine(req.body);
    await medicine.save();
    
    // Log to history
    await MedicineHistory.create({
      medicineId: medicine._id,
      medicineName: medicine.name,
      action: 'created',
      details: `Added new medicine: ${medicine.name} with ${medicine.quantity} units`,
      newData: req.body
    });

    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ error: "Failed to create medicine" });
  }
};

// Get all medicines
export const getMedicines = async (req: Request, res: Response) => {
  try {
    const medicines = await Medicine.find().sort({ dateOfEntry: -1 });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch medicines" });
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

// Update a medicine
export const updateMedicine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Always update the dateOfEntry to current date
    updateData.dateOfEntry = new Date().toISOString().split('T')[0];

    const updatedMedicine = await Medicine.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    // Log to history
    await MedicineHistory.create({
      medicineId: id,
      medicineName: updatedMedicine.name,
      action: 'updated',
      details: `Updated medicine: ${updatedMedicine.name}`,
      newData: updateData
    });

    res.json({
      message: "Medicine updated successfully",
      medicine: updatedMedicine
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update medicine" });
  }
};

// Delete medicine
export const deleteMedicine = async (req: Request, res: Response) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    // Log to history
    await MedicineHistory.create({
      medicineId: req.params.id,
      medicineName: medicine.name,
      action: 'deleted',
      details: `Deleted medicine: ${medicine.name}`,
      newData: {}
    });

    res.json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete medicine" });
  }
};

// Get medicine history
export const getHistory = async (req: Request, res: Response) => {
  try {
    const history = await MedicineHistory.find().sort({ timestamp: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
};
