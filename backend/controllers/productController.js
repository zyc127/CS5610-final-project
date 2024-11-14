// product modification controller
const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  const { name, category, price, description, imageUrl } = req.body;
  const newProduct = new Product({ name, category, price, description, imageUrl });
  await newProduct.save();
  res.status(201).json(newProduct);
};

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
};

exports.updateProduct = async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedProduct);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
