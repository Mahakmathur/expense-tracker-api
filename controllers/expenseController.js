const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

exports.addExpense = async (req, res) => {
    try {
        const { title, amount, category, description, date } = req.body;
        
        const expense = new Expense({
            user: req.user._id,
            title,
            amount,
            category,
            description,
            date: date || new Date()
        });

        await expense.save();

        // Update budget spent amount
        const expenseDate = new Date(expense.date);
        const budget = await Budget.findOne({
            user: req.user._id,
            category,
            month: expenseDate.getMonth() + 1,
            year: expenseDate.getFullYear()
        });

        if (budget) {
            budget.spent += amount;
            await budget.save();
        }

        res.status(201).json({ message: 'Expense added successfully', expense });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, startDate, endDate } = req.query;
        
        const query = { user: req.user._id };
        if (category) query.category = category;
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const expenses = await Expense.find(query)
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Expense.countDocuments(query);

        res.json({
            expenses,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        );

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.json({ message: 'Expense updated successfully', expense });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};