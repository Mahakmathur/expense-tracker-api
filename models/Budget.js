const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { 
        type: String, 
        required: true,
        enum: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Other']
    },
    limit: { type: Number, required: true },
    spent: { type: Number, default: 0 },
    month: { type: Number, required: true }, // 1-12
    year: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);