import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import HomePage from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Checkout from "./pages/CheckoutPage";
import ShoppingCart from "./pages/ShoppingCart";
import UserProfile from "./pages/UserProfile";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token && username) {
      setLoggedInUser(username);
    }
  }, []);

  return (
    <Router>
      <div className="app">
        <NavigationBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route
              path="/profile"
              element={<UserProfile loggedInUser={loggedInUser} />}
            />
            <Route
              path="/login"
              element={<Login setLoggedInUser={setLoggedInUser} />}
            />
            <Route
              path="/cart"
              element={<ShoppingCart loggedInUser={loggedInUser} />}
            />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
