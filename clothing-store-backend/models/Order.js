const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  totalAmount: { type: Number, required: true }, // Store the total amount in the selected currency
  currency: { type: String, required: true }, // Store the selected currency (e.g., "CAD", "USD", etc.)
  shippingAddress: {
    userName: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  status: { type: String, enum: ["Ordered", "Delivered", "Cancelled"], default: "Ordered" },
  orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
