const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: String,
  chance: Number,
  rarity: String,
  description: String
});

module.exports = mongoose.model('Item', itemSchema);