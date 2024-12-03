import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize navigate
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("S");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };

    fetchProduct();
  }, [id]);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const addToCart = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:5002/api/users/cart",
        { productId: id, quantity, size: selectedSize },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      alert("Product added to cart!");
      console.log("Cart updated:", response.data);
      navigate("/cart"); // Navigate to the shopping cart page
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add product to cart.");
    }
  };  

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="product-detail">
      <nav className="breadcrumb">
        Shop &gt; {product.category} &gt; {product.name}
      </nav>
      <div className="product-container">
        <div className="product-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="product-info">
          <h2>{product.brand || "Brand"}</h2>
          <h1>{product.name}</h1>
          <p className="price">${product.price.toFixed(2)}</p>
          <p className="description">{product.description}</p>
        </div>
        <div className="size-options">
          <p>Size:</p>
          <div className="size-buttons">
            {["S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                className={selectedSize === size ? "selected" : ""}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <div className="quantity-selector">
          <button onClick={decreaseQuantity}>-</button>
          <span>{quantity}</span>
          <button onClick={increaseQuantity}>+</button>
        </div>
        <p className="total-price">${(product.price * quantity).toFixed(2)}</p>
        <button onClick={addToCart} className="add-to-cart">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;


