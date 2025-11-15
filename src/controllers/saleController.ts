import { Request, Response } from "express";
import mongoose from "mongoose"; // ADD THIS IMPORT
import Sale from "../models/Sale";
import Medicine from "../models/Medicine";
import MedicineHistory from "../models/MedicineHistory";

// Record a sale
export const recordSale = async (req: Request, res: Response) => {
  try {
    const { medicineId, quantitySold, salePrice, customerName } = req.body;

    // Validate medicineId format
    if (!mongoose.Types.ObjectId.isValid(medicineId)) {
      return res.status(400).json({ error: "Invalid medicine ID format" });
    }

    // Convert medicineId string to ObjectId
    const medicineObjectId = new mongoose.Types.ObjectId(medicineId);

    // Find the medicine
    const medicine = await Medicine.findById(medicineObjectId);
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    // Check if enough stock
    if (medicine.quantity < quantitySold) {
      return res.status(400).json({ 
        error: `Insufficient stock. Available: ${medicine.quantity}, Requested: ${quantitySold}` 
      });
    }

    // Calculate remaining quantity and total amount
    const remainingQuantity = medicine.quantity - quantitySold;
    const totalAmount = quantitySold * salePrice;

    // Create sale record
    const sale = new Sale({
      medicineId: medicineObjectId, // Use ObjectId here
      medicineName: medicine.name,
      quantitySold,
      salePrice,
      totalAmount,
      remainingQuantity,
      customerName
    });
    await sale.save();

    // Update medicine quantity
    medicine.quantity = remainingQuantity;
    await medicine.save();

    // Log to history
    await MedicineHistory.create({
      medicineId: medicine._id,
      medicineName: medicine.name,
      action: 'sold',
      details: `Sold ${quantitySold} units of ${medicine.name}. Remaining: ${remainingQuantity}`,
      newData: { quantity: remainingQuantity }
    });

    res.status(201).json({
      message: "Sale recorded successfully",
      sale,
      updatedMedicine: medicine
    });
  } catch (error) {
    console.error("Error in recordSale:", error);
    res.status(500).json({ error: "Failed to record sale" });
  }
};

// Get all sales
export const getSales = async (req: Request, res: Response) => {
  try {
    const sales = await Sale.find().sort({ saleDate: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sales" });
  }
};

// Get sales by medicine ID
export const getSalesByMedicine = async (req: Request, res: Response) => {
  try {
    const { medicineId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(medicineId)) {
      return res.status(400).json({ error: "Invalid medicine ID format" });
    }

    const medicineObjectId = new mongoose.Types.ObjectId(medicineId);
    const sales = await Sale.find({ medicineId: medicineObjectId }).sort({ saleDate: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sales" });
  }
};
