import express from 'express';
import { setupSwagger } from './swagger.js';
import sequelize from './config/database.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 4000;

// Sync DB
sequelize.sync({ alter: true })
  .then(() => console.log("✅ DB synced with Neon"))
  .catch((err) => console.error("❌ DB connection failed:", err));

// Middleware
const corsOpts = {
  origin: '*',
  methods: [
      'GET',
      'POST',
      'DELETE',
      'PATCH',
      'PUT'
  ],
  allowedHeaders: [
      'Content-Type',
      'Authorization',
  ],
};

app.use(cors(corsOpts));
app.use(express.json());

// Use admin routes 
app.use('/api/admin', adminRoutes);

// Use auth routes
app.use('/api', authRoutes);

// Use user routes
app.use('/api', userRoutes);

// Setup Swagger Documentation
setupSwagger(app);

// Landing route
app.get('/', (req, res) => {
  res.send('Landing route working! Visit /api-docs for API documentation');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
