const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  isVeg: { type: Boolean, required: true },
  cuisine: { type: String },
  description: { type: String },
  spicinessLevel: { type: Number, min: 1, max: 3 },
  preparationTime: { type: Number, required: true },
  calories: { type: Number },
  sumOfRatings: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  reviews: [{ type: String, required: true }],
  availability: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const MenuItem = mongoose.model("MenuItem", menuSchema);
module.exports = MenuItem;
