import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/UserProfile.css";

const UserProfile = ({ loggedInUser }) => {
  const [profileData, setProfileData] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not logged in");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5002/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data);
        setOrderDetails(response.data.orderHistory);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load user profile.");
      }
    };

    fetchUserProfile();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!profileData) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="user-profile">
      <div className="profile-sidebar">
        <div className="profile-header">
          <div className="profile-avatar">
            <img src="https://via.placeholder.com/100" alt="User" />
          </div>
          <h3>{profileData.username}</h3>
        </div>
        <div className="personal-info">
          <h4>Personal Information</h4>
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
        </div>
      </div>
      <div className="profile-content">
        <h2>Order Details</h2>
        {orderDetails.length > 0 ? (
          orderDetails.map((order) => (
            <div key={order._id} className="order-card">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total:</strong> {order.currency} {order.totalAmount.toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p>No order details available.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

