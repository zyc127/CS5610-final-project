const Order = require("../models/Order");

exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("products.product", "name price");
    res.send(orders);
  } catch (error) {
    res.status(500).send("Error fetching order history");
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Ordered", "Delivered", "Cancelled"].includes(status)) {
      return res.status(400).send("Invalid status");
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send("Order not found");

    if (order.status === "Delivered") {
      return res.status(400).send("Delivered orders cannot be updated");
    }
    if (order.status === "Cancelled") {
      return res.status(400).send("Cancelled orders cannot be updated");
    }

    order.status = status;
    await order.save();

    res.send(order);
  } catch (error) {
    res.status(500).send("Error updating order status");
  }
};

