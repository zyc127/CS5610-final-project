import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

const Login = ({ setLoggedInUser }) => {
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/login`, registerData);
      alert("Account created successfully! Please log in.");
    } catch (err) {
      console.error("Error creating account:", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Error creating account.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/register`, loginData); 
      console.log("Login response:", response.data);

      setLoggedInUser(response.data.user.username);
      localStorage.setItem("token", response.data.token);
  
      navigate("/");
    } catch (err) {
      console.error("Error logging in:", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Error logging in.");
    }
  };
  
  return (
    <div className="login-page">
      <div className="forms-container">
        <div className="form-box">
          <h2>SIGN IN</h2>
          <p>Required fields are marked with an asterisk (*)</p>
          <form onSubmit={handleLogin}>
            <label>Email address*</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={loginData.email}
              onChange={handleLoginChange}
              required
            />

            <label>Password*</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />

            <button type="submit" className="btn-primary">
              SIGN IN
            </button>
          </form>
        </div>

        <div className="form-box">
          <h2>CREATE ACCOUNT</h2>
          <p>Required fields are marked with an asterisk (*)</p>
          <form onSubmit={handleRegister}>
            <label>Username*</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={registerData.username}
              onChange={handleRegisterChange}
              required
            />

            <label>Email*</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={registerData.email}
              onChange={handleRegisterChange}
              required
            />

            <label>Password*</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={registerData.password}
              onChange={handleRegisterChange}
              required
            />

            <button type="submit" className="btn-primary">
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
