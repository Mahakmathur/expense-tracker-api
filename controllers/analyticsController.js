const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

exports.getMonthlyAnalytics = async (req, res) => {
    try {
        const { month, year } = req.query;
        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();

        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

        const expenses = await Expense.find({
            user: req.user._id,
            date: { $gte: startDate, $lte: endDate }
        });

        const categoryWise = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        res.json({
            month: targetMonth,
            year: targetYear,
            totalSpent,
            categoryWise,
            expenseCount: expenses.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.setBudget = async (req, res) => {
    try {
        const { category, limit, month, year } = req.body;
        const currentDate = new Date();
        const targetMonth = month || currentDate.getMonth() + 1;
        const targetYear = year || currentDate.getFullYear();

        let budget = await Budget.findOne({
            user: req.user._id,
            category,
            month: targetMonth,
            year: targetYear
        });

        if (budget) {
            budget.limit = limit;
        } else {
            budget = new Budget({
                user: req.user._id,
                category,
                limit,
                month: targetMonth,
                year: targetYear
            });
        }

        await budget.save();
        res.json({ message: 'Budget set successfully', budget });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBudgetAlerts = async (req, res) => {
    try {
        const currentDate = new Date();
        const budgets = await Budget.find({
            user: req.user._id,
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear()
        });

        const alerts = budgets.filter(budget => {
            const percentage = (budget.spent / budget.limit) * 100;
            return percentage >= 80; // Alert when 80% of budget is spent
        }).map(budget => ({
            category: budget.category,
            spent: budget.spent,
            limit: budget.limit,
            percentage: ((budget.spent / budget.limit) * 100).toFixed(2)
        }));

        res.json({ alerts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};