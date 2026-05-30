const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON payloads


const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes'); 
// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);



// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error(' Database connection error:', err.message);
    process.exit(1);
  });

// Base Route Test
app.get('/', (req, res) => {
  res.send('AI Recipe Generator API is running...');
});

// Port Execution
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});