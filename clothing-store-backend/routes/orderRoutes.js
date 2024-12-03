const express = require("express");
const { getOrderHistory, updateOrderStatus } = require("../controllers/orderController");
const auth = require("../middleware/user");

const router = express.Router();

router.get("/history", auth, getOrderHistory); 
router.patch("/:id/status", auth, updateOrderStatus); 

module.exports = router;

