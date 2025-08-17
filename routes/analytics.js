const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getMonthlyAnalytics,
    setBudget,
    getBudgetAlerts
} = require('../controllers/analyticsController');

// All routes require authentication
router.use(auth);

// GET /api/analytics/monthly - Get monthly analytics
router.get('/monthly', getMonthlyAnalytics);

// POST /api/analytics/budget - Set budget for category
router.post('/budget', setBudget);

// GET /api/analytics/alerts - Get budget alerts
router.get('/alerts', getBudgetAlerts);

module.exports = router;