const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true, index: true },
  description: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  sold: { type: Boolean, required: true },
  dateOfSale: { type: Date, required: true }
});

module.exports = mongoose.model('Transaction', transactionSchema);
