import express from 'express';
import { setupSwagger } from './swagger.js';
import prisma from './prisma/client.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Test Prisma connection
prisma.$connect()
  .then(() => console.log("✅ Connected to PostgreSQL with Prisma"))
  .catch((err) => console.error("❌ Prisma connection failed:", err));

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
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing Prisma connection and shutting down server...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server shut down successfully');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('Closing Prisma connection and shutting down server...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server shut down successfully');
    process.exit(0);
  });
});
