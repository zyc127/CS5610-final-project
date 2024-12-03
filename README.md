# Clothing Store Web Application

A full-stack web application for an online clothing store. Users can browse products, manage a shopping cart, and place orders.

---


## Project Overview

This application allows users to:
- Browse and filter products by category and size.
- Search for products by name.
- Add products to a shopping cart.
- Manage cart items (adjust quantity, remove items).
- Securely checkout and place orders with currency conversion.
- View and manage user profiles and order history.

---

## Prerequisites

Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v14 or above)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (or use MongoDB Atlas for cloud hosting)
- A code editor like [VS Code](https://code.visualstudio.com/)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MeihaoC/5610-final-project.git
   ```

2. Install backend dependencies:
   ```bash
   cd clothing-store-backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd clothing-store
   npm install
   ```

---

## Running the Project

1. **Start the Backend Server**:
   - Navigate to the backend folder:
     ```bash
     cd clothing-store-backend
     ```
   - Start the backend server:
     ```bash
     node server.js
     ```
   - The backend server will run at `http://localhost:5002`.

2. **Start the Frontend Development Server**:
   - Navigate to the frontend folder:
     ```bash
     cd clothing-store
     ```
   - Start the React development server:
     ```bash
     npm start
     ```
   - The frontend will be accessible at `http://localhost:3000`.

---

## Database Setup

1. **Local MongoDB Setup**:
   - Ensure MongoDB is installed and running locally.
   - Run the provided `FakerSeed.js` script to populate sample data:
     ```bash
     node models/FakerSeed.js
     ```

2. **Using MongoDB Atlas**:
   - Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
   - Update the `.env` file with the MongoDB URI.

---

## Environment Variables

Create a `.env` file in the `clothing-store-backend` folder with the following contents:

```env
MONGODB_URI=mongodb+srv://meihaocheng1127:rockBILLtom91@cluster0.mmf6c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=group10project
```

---

## Dependencies

### Backend
- Express
- Mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- @faker-js/faker

Install all dependencies:
```bash
npm install express mongoose bcryptjs jsonwebtoken dotenv @faker-js/faker
```

### Frontend
- React
- React Router DOM
- Axios
- @fortawesome/react-fontawesome
- @fortawesome/free-solid-svg-icons

Install all dependencies:
```bash
npm install react react-router-dom axios @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
```

---

## Features

- **User Authentication**: Secure login and registration with JWT.
- **Product Filtering**: Users can filter products by categories and sizes.
- **Search Functionality**: Users can search for products from the navigation bar.
- **Shopping Cart**: Add, update, and remove items from the cart.
- **Currency Selection**: Users can choose a preferred currency during checkout.
- **Checkout**: Securely place orders with user-provided shipping information.
- **Order History**: View past orders and their statuses.

---

## Sample Data

Run the following command to populate the database with sample products, users, and orders:
```bash
node models/FakerSeed.js
```

This will create:
- 50 products
- 20 users
- 30 orders

---

## Sample Schema

Below is the sample schema used for the database:

### Users Schema
```js
{
  "username": "String",
  "email": "String",
  "password": "String",
  "cart": [
    {
      "product": "ObjectId",
      "quantity": "Number"
    }
  ],
  "orderHistory": ["ObjectId"]
}
```

### Product Schema
```js
{
  "name": "String",
  "category": "String",
  "price": "Number",
  "size": "String",
  "description": "String",
  "imageUrl": "String"
}
```

### Order Schema
```js
{
  "user": "ObjectId",
  "products": [
    {
      "product": "ObjectId",
      "quantity": "Number"
    }
  ],
  "totalAmount": "Number",
  "currency": "String",
  "shippingAddress": "String",
  "status": "String",
  "orderDate": "Date"
}
```
