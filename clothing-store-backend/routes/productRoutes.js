const express = require("express");
const {
  getAllProducts,
  getProductById,
  searchProducts,
} = require("../controllers/productController");

const router = express.Router();

router.get("/search", searchProducts);
router.get("/:id", getProductById); 
router.get("/", getAllProducts); 

module.exports = router;
