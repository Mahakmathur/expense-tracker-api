const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense
} = require('../controllers/expenseController');

// All routes require authentication
router.use(auth);

// POST /api/expenses - Add new expense
router.post('/', addExpense);

// GET /api/expenses - Get all expenses
router.get('/', getExpenses);

// PUT /api/expenses/:id - Update expense
router.put('/:id', updateExpense);

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', deleteExpense);

module.exports = router;