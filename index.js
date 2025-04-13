import express from 'express';
import sequelize from './config/database.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';


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

// Use auth routes
app.use('/api', authRoutes);

// Landing route
app.get('/', (req, res) => {
  res.send('Landing route working!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
