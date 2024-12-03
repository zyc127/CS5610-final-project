const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
});

userSchema.methods.hashPassword = async function(password) {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = mongoose.model("User", userSchema);
