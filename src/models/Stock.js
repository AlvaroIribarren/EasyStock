const mongoose = require('mongoose');
const {Schema} = mongoose;

const StockSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required:true },
    date: { type: Date, default: Date.now },
    amount: { type: Number, default: 0, required: true},
    price: { type: Number, default: 0, required: true},
    user: { type: String }
});

module.exports = mongoose.model('Stock', StockSchema);

