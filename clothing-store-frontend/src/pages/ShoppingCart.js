import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/ShoppingCart.css";

const ShoppingCart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to view your cart.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data);
      calculateTotal(response.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
      alert("Failed to load cart. Please try again.");
    }
  };

  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    setTotal(total);
  };

  const updateCartQuantity = async (productId, change) => {
    const token = localStorage.getItem("token");
    const currentItem = cart.find((item) => item.product._id === productId);
  
    if (!currentItem) return;
  
    const newQuantity = currentItem.quantity + change; 
    if (newQuantity < 1) return; 
  
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/cart`,
        { productId, quantity: newQuantity }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Failed to update quantity.");
    }
  };  

  const removeItem = async (productId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/users/cart/item/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart(); 
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Failed to remove item from cart.");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cart.length > 0 ? (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.product._id}>
                  <td>{item.product.name}</td>
                  <td>${item.product.price.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => updateCartQuantity(item.product._id, -1)}
                      disabled={item.quantity <= 1 || isUpdating}
                    >
                      -
                    </button>
                    {item.quantity}
                    <button
                      onClick={() => updateCartQuantity(item.product._id, 1)}
                      disabled={isUpdating}
                    >
                      +
                    </button>
                  </td>
                  <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button onClick={() => removeItem(item.product._id)} disabled={isUpdating}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-total">
            <h3>Total: ${total.toFixed(2)}</h3>
            <button className="checkout-button" onClick={handleCheckout} disabled={isUpdating}>
              Check Out
            </button>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default ShoppingCart;
