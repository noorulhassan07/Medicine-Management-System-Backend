import mongoose, { Document, Schema } from "mongoose";

// Interface for Medicine
interface IMedicine extends Document {
  name: string;
  quantity: number;
  manufacturingDate: string;
  expiryDate: string;
  dateOfEntry: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const medicineSchema = new Schema<IMedicine>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  manufacturingDate: { type: String, required: true },
  expiryDate: { type: String, required: true },
  dateOfEntry: { type: String, required: true },
  price: { type: Number, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IMedicine>("Medicine", medicineSchema);
