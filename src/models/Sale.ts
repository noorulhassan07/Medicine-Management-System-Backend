import mongoose, { Document, Schema } from "mongoose";

interface ISale extends Document {
  medicineId: mongoose.Types.ObjectId;
  medicineName: string;
  quantitySold: number;
  salePrice: number;
  totalAmount: number;
  saleDate: Date;
  remainingQuantity: number;
  customerName?: string;
}

const saleSchema = new Schema<ISale>({
  medicineId: { 
    type: Schema.Types.ObjectId, 
    ref: "Medicine", 
    required: true 
  },
  medicineName: { type: String, required: true },
  quantitySold: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  saleDate: { type: Date, default: Date.now },
  remainingQuantity: { type: Number, required: true },
  customerName: { type: String }
});

export default mongoose.model<ISale>("Sale", saleSchema);
