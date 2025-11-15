import mongoose from "mongoose";

const medicineHistorySchema = new mongoose.Schema({
  medicineId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Medicine", 
    required: true 
  },
  action: { 
    type: String, 
    enum: ["created", "updated", "deleted", "sold"], 
    required: true 
  },
  details: { type: String, required: true },
  previousData: { type: Object },
  newData: { type: Object },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("MedicineHistory", medicineHistorySchema);
