import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/CheckoutPage.css";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [currency, setCurrency] = useState("CAD");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [convertedTotal, setConvertedTotal] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    userName: "",
    streetAddress: "",
    city: "",
    province: "",
    zipCode: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (currency !== "CAD") {
      fetchExchangeRate();
    } else {
      setExchangeRate(1);
    }
  }, [currency]);

  useEffect(() => {
    setConvertedTotal((total * exchangeRate).toFixed(2));
  }, [total, exchangeRate]);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to proceed with checkout.");
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
      alert("Failed to load cart for checkout.");
    }
  };

  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    setTotal(total);
  };

  const fetchExchangeRate = async () => {
    const apiKey = "96bf186256c827fbc8692cbf90b779bc";  
    const requestUrl = `https://api.exchangeratesapi.io/v1/latest?access_key=${apiKey}&symbols=USD,EUR,GBP,CAD`;
  
    try {
      console.log("Request URL:", requestUrl);
      const response = await axios.get(requestUrl);
  
      if (response.data && response.data.rates) {
        if (currency === "CAD") {
          setExchangeRate(1);
        } else if (response.data.rates["CAD"]) {
          setExchangeRate(response.data.rates[currency] / response.data.rates["CAD"]);
        } else {
          alert("Failed to load CAD exchange rate.");
        }
      } else {
        console.error("Exchange rate data format is unexpected:", response.data);
        alert("Failed to load exchange rate.");
      }
    } catch (err) {
      console.error("Error fetching exchange rates:", err.response ? err.response.data : err.message);
      alert("Failed to load exchange rate. Please check your network or API key.");
    }
  };
  
  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/cart/checkout`,
        {
          shippingAddress: shippingInfo,
          currency: currency,  
          totalAmount: convertedTotal,  
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order placed successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Checkout failed. Please try again.");
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <div className="checkout-form">
        <div>
          <h3>Shipping Address</h3>
          <form>
            <label>
              Username:
              <input
                type="text"
                name="userName"
                value={shippingInfo.userName}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Street Address:
              <input
                type="text"
                name="streetAddress"
                value={shippingInfo.streetAddress}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              City:
              <input
                type="text"
                name="city"
                value={shippingInfo.city}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Province:
              <input
                type="text"
                name="province"
                value={shippingInfo.province}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Zip Code:
              <input
                type="text"
                name="zipCode"
                value={shippingInfo.zipCode}
                onChange={handleInputChange}
                required
              />
            </label>
          </form>
        </div>
        <div className="order-summary">
          <h3>Order Summary</h3>
          {cart.map((item) => (
            <div key={item.product._id}>
              <p>
                {item.product.name} - ${item.product.price.toFixed(2)} x{" "}
                {item.quantity}
              </p>
            </div>
          ))}
          <label>
            Currency:
            <select value={currency} onChange={handleCurrencyChange}>
              <option value="CAD">CAD</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </label>
          <p>
            Total: {currency} {convertedTotal}
          </p>
          <button onClick={handleCheckout}>Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
