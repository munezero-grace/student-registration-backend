import express from 'express';
import sequelize from './config/database.js';

const app = express();
const PORT = process.env.PORT || 4000;

sequelize.sync({ alter: true })
  .then(() => console.log("✅ DB synced with Neon"))
  .catch((err) => console.error("❌ DB connection failed:", err));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Landing route working!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
