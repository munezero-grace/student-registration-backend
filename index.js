const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Landing route working!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
