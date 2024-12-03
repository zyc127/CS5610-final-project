const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, color, size } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (size) {
      filter.size = size;
    }

    const products = await Product.find(filter);
    res.send(products);
  } catch (error) {
    res.status(500).send("Error fetching products");
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.send(product);
  } catch (error) {
    res.status(500).send("Error fetching product details");
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).send("Query parameter is required");
    }

    // Search for products based on name, description, or other fields.
    const products = await Product.find({
      name: { $regex: query, $options: "i" }, // Case-insensitive search
    });

    res.json(products);
  } catch (error) {
    console.error("Error during search:", error.message);
    res.status(500).send("Error during search");
  }
};
