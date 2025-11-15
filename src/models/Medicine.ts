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
      newData: medicine
    });

    res.status(201).json(medicine);
  } catch (error) {
    console.error("Error creating medicine:", error);
    res.status(500).json({ error: "Failed to create medicine" });
  }
};

// Get all medicines
export const getMedicines = async (req: Request, res: Response) => {
  try {
    const medicines = await Medicine.find().sort({ dateOfEntry: -1 });
    res.json(medicines);
  } catch (error) {
    console.error("Error fetching medicines:", error);
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
    console.error("Error fetching medicine by ID:", error);
    res.status(500).json({ error: "Failed to fetch medicine" });
  }
};

// Update a medicine - FIXED VERSION
export const updateMedicine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Always update the dateOfEntry to current date
    updateData.dateOfEntry = new Date().toISOString().split('T')[0];

    // Get the original medicine first
    const originalMedicine = await Medicine.findById(id);
    if (!originalMedicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    const updatedMedicine = await Medicine.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({ error: "Medicine not found after update" });
    }

    // Log to history - FIXED: Use the actual updated medicine data
    await MedicineHistory.create({
      medicineId: updatedMedicine._id, // Use the actual ObjectId
      medicineName: updatedMedicine.name,
      action: 'updated',
      details: `Updated medicine: ${updatedMedicine.name}. Quantity: ${originalMedicine.quantity} → ${updatedMedicine.quantity}, Price: $${originalMedicine.price} → $${updatedMedicine.price}`,
      previousData: originalMedicine.toObject(), // Store the original data
      newData: updatedMedicine.toObject() // Store the updated data
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

// Delete medicine - FIXED VERSION
export const deleteMedicine = async (req: Request, res: Response) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    await Medicine.findByIdAndDelete(req.params.id);

    // Log to history - FIXED: Use the medicine data before deletion
    await MedicineHistory.create({
      medicineId: medicine._id,
      medicineName: medicine.name,
      action: 'deleted',
      details: `Deleted medicine: ${medicine.name} with ${medicine.quantity} units`,
      previousData: medicine.toObject() // Store the data before deletion
    });

    res.json({ message: "Medicine deleted successfully" });
  } catch (error) {
    console.error("Error deleting medicine:", error);
    res.status(500).json({ error: "Failed to delete medicine" });
  }
};

// Get medicine history - FIXED VERSION
export const getHistory = async (req: Request, res: Response) => {
  try {
    console.log("🔄 Attempting to fetch medicine history...");
    
    const history = await MedicineHistory.find().sort({ timestamp: -1 });
    console.log(`✅ Successfully fetched ${history.length} history records`);
    
    res.json(history);
    
  } catch (error) {
    console.error("❌ Error in getHistory:", error);
    
    // Return empty array for any error to prevent frontend crash
    console.log("⚠️ Returning empty array to prevent frontend crash");
    res.json([]);
  }
};
