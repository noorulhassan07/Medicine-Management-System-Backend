import mongoose, { Document, Schema } from "mongoose";

// Interface for MedicineHistory
export interface IMedicineHistory extends Document {
  medicineId: mongoose.Types.ObjectId;
  medicineName: string;
  action: "created" | "updated" | "deleted" | "sold";
  details: string;
  previousData?: any;
  newData?: any;
  timestamp: Date;
}

const medicineHistorySchema = new Schema<IMedicineHistory>({
  medicineId: { 
    type: Schema.Types.ObjectId, 
    ref: "Medicine", 
    required: true 
  },
  medicineName: { type: String, required: true },
  action: { 
    type: String, 
    enum: ["created", "updated", "deleted", "sold"], 
    required: true 
  },
  details: { type: String, required: true },
  previousData: { type: Object },
  newData: { type: Object },
  timestamp: { type: Date, default: Date.now }
}, {
  collection: "medicinehistory"
});

// Export both the model and interface
const MedicineHistory = mongoose.model<IMedicineHistory>("MedicineHistory", medicineHistorySchema);
export default MedicineHistory;
