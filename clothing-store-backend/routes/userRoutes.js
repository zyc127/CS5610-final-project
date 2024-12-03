const express = require("express");
const {
  register,
  login,
  getCart,
  addToCart,
  removeFromCart,
  checkout,
  getProfile, 
} = require("../controllers/userController");
const auth = require("../middleware/user");

const router = express.Router();

router.post("/register", register); 
router.post("/login", login); 
router.get("/cart", auth, getCart); 
router.post("/cart", auth, addToCart); 
router.delete("/cart/item/:productId", auth, removeFromCart); 
router.post("/cart/checkout", auth, checkout); 
router.get("/profile", auth, getProfile); 

module.exports = router;
