import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import "../css/HomePage.css";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/products`);
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const toggleCategory = (category) => {
    setSelectedCategory((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const toggleSize = (size) => {
    setSelectedSize((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
  };

  const filteredProducts = products
    .filter((product) => {
      if (selectedCategory.length > 0 && !selectedCategory.includes(product.category)) {
        return false;
      }
      if (selectedSize.length > 0 && !selectedSize.includes(product.size)) {
        return false;
      }
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "featured") {
        return Math.random() - 0.5;
      }
      return sortBy === "low-to-high" ? a.price - b.price : b.price - a.price;
    });

  return (
    <div className="homepage">
      <div className="main-content">
        <aside className="sidebar">
          <div className="filter-group">
            <h3>Product Categories</h3>
            <ul>
              {["Top", "Pants", "Dress"].map((category) => (
                <li key={category}>
                  <input
                    type="checkbox"
                    checked={selectedCategory.includes(category)}
                    onChange={() => toggleCategory(category)}
                  />{" "}
                  {category}
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group">
            <h3>Filter by Size</h3>
            <ul>
              {["S", "M", "L", "XL"].map((size) => (
                <li key={size}>
                  <input
                    type="checkbox"
                    checked={selectedSize.includes(size)}
                    onChange={() => toggleSize(size)}
                  />{" "}
                  {size}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="products">
          <div className="products-header">
            <p>Shop &gt; All Products</p>
            <div className="sort-by">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Link
                  to={`/product/${product._id}`}
                  className="product-card"
                  key={product._id}
                >
                  <div className="product-image">
                    <img src={product.imageUrl} alt={product.name} />
                  </div>
                  <h3>{product.name}</h3>
                  <p>${product.price.toFixed(2)}</p>
                </Link>
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
