import express from 'express';
import sequelize from './config/database.js';
import adminRoutes from './routes/adminRoutes.js'; // 👈 Import admin routes

const app = express();
const PORT = process.env.PORT || 4000;

// Sync DB
sequelize.sync({ alter: true })
  .then(() => console.log("✅ DB synced with Neon"))
  .catch((err) => console.error("❌ DB connection failed:", err));

// Middleware
app.use(express.json());

// Use admin routes 
app.use('/api/admin', adminRoutes);

// Landing route
app.get('/', (req, res) => {
  res.send('Landing route working!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});