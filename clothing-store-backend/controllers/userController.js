const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");

exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).send("User already exists.");

    user = new User({ email, username });
    user.password = await user.hashPassword(password);
    await user.save();

    const token = user.generateAuthToken();
    res.send({ token });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).send("Error registering user");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found.");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send("Invalid password.");

    const token = user.generateAuthToken();

    res.send({
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).send("Error logging in");
  }
};

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product", "name price");
    if (!user) return res.status(404).send("User not found");

    res.send(user.cart);
  } catch (error) {
    console.error("Error fetching cart:", error.message);
    res.status(500).send("Error fetching cart");
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send("User not found");

    const cartItem = user.cart.find((item) => item.product.toString() === productId);
    if (cartItem) {
      cartItem.quantity = quantity; 
    } else {
      user.cart.push({ product: productId, quantity }); 
    }

    await user.save();

    const updatedCart = await User.findById(req.user._id).populate("cart.product", "name price");
    res.send(updatedCart.cart); 
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).send("Error updating cart");
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    await user.save();

    res.send(user.cart);
  } catch (error) {
    res.status(500).send("Error removing item from cart");
  }
};

exports.checkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress, currency, totalAmount } = req.body;

    console.log("Checkout initiated by user:", userId);
    console.log("Shipping Address:", shippingAddress);
    console.log("Selected Currency:", currency);
    console.log("Total Amount in Selected Currency:", totalAmount);

    const user = await User.findById(userId).populate("cart.product");
    if (!user) {
      console.error("User not found");
      return res.status(404).send("User not found");
    }

    if (user.cart.length === 0) {
      console.error("Cart is empty");
      return res.status(400).send("Cart is empty");
    }

    const order = new Order({
      user: userId,
      products: user.cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalAmount,
      currency, 
      shippingAddress,
      status: "Ordered",
      orderDate: Date.now(),
    });

    console.log("Order to be saved:", order);

    await order.save();

    user.cart = [];
    user.orderHistory.push(order._id);
    await user.save();

    console.log("Order saved successfully");
    res.send(order);
  } catch (error) {
    console.error("Error during checkout:", error.message);
    res.status(500).send("Error during checkout");
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("orderHistory");
    if (!user) return res.status(404).send("User not found");

    const orderHistoryWithCurrency = user.orderHistory.map(order => ({
      _id: order._id,
      user: order.user,
      products: order.products,
      totalAmount: order.totalAmount,
      currency: order.currency,
      shippingAddress: order.shippingAddress,
      status: order.status,
      orderDate: order.orderDate,
    }));

    res.send({
      username: user.username,
      email: user.email,
      orderHistory: orderHistoryWithCurrency,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
    res.status(500).send("Error fetching user profile");
  }
};