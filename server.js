const express = require('express');
const cors = require('cors');
const { connectDB } = require('./database/db');
const path = require('path');


const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const itemRoutes = require('./routes/ItemRoute');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
connectDB();

app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/items', itemRoutes);

module.exports = { app };

if (require.main === module) {
  // Start server only if this file is run directly
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
