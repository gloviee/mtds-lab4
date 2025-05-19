const express = require('express');
const cors = require('cors');
const connectDB = require('./database/db');

const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const itemRoutes = require('./routes/ItemRoute');

const app = express();

app.use(cors());
app.use(express.json());
connectDB();

app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/items', itemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
