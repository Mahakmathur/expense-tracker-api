const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/expenses', require('../routes/expenses'));
app.use('/api/analytics', require('../routes/analytics'));

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Expense Tracker API is running!' });
});
app.get('/api', (req, res) => {
    res.json({ message: 'Expense Tracker API is running!' });
});

// Database connection
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.log('MongoDB Error:', err));
} else {
    console.log('API running without database - add MONGODB_URI to connect');
}

module.exports = app;