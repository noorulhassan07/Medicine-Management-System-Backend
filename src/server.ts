import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db';
import medicineRoutes from './routes/medicineRoutes';
import saleRoutes from './routes/saleRoutes';  // This import exists but not used
import historyRoutes from "./routes/history";


dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/medicines', medicineRoutes);
app.use('/api/sales', saleRoutes); // ADD THIS LINE - THIS IS MISSING!
app.use("/api/medicines/history", historyRoutes);
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Medicine Management System API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Medicine Management System Backend',
    version: '1.0.0'
  });
});

// Database connection
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
