import express from "express";
import { recordSale, getSales, getSalesByMedicine } from "../controllers/saleController";

const router = express.Router();

router.post("/", recordSale);
router.get("/", getSales);
router.get("/medicine/:medicineId", getSalesByMedicine);

export default router;
