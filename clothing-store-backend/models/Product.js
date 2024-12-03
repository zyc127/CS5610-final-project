const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    size: String,
    description: String,
    imageUrl: String,
  });
  
  module.exports = mongoose.model("Product", productSchema);
  