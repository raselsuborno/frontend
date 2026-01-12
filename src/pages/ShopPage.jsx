import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { PageWrapper } from "../components/page-wrapper.jsx";
import toast from "react-hot-toast";
import { ShoppingBag, Plus, Minus, Sparkles } from "lucide-react";
import apiClient from "../lib/api.js";
import { extractArrayData } from "../utils/apiHelpers.js";
import "../styles/unified-page-layout.css";

export function ShopPage() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        apiClient.get("/api/shop/products"),
        apiClient.get("/api/shop/categories").catch(() => ({ data: [] })), // Fallback if not available
      ]);
      const productsData = extractArrayData(productsRes.data);
      const categoriesData = extractArrayData(categoriesRes.data);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Load products error:", err);
      toast.error("Failed to load products");
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product, quantity = 1) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    // Store product with minimal info needed for cart
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      slug: product.slug,
    };
    const newItems = Array(quantity).fill(cartProduct);
    const updatedCart = [...existingCart, ...newItems];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartCount(updatedCart.length);
    toast.success(`Added ${quantity}x ${product.name} to cart`, {
      icon: "🛒",
      duration: 2000,
    });
  };

  // Group products by category
  const groupedProducts = categories
    .filter((cat) => cat.isActive)
    .map((category) => ({
      ...category,
      products: products.filter((p) => p.categoryId === category.id && p.isActive),
    }))
    .filter((cat) => cat.products.length > 0);

  // Add uncategorized products
  const uncategorizedProducts = products.filter((p) => !p.categoryId && p.isActive);
  if (uncategorizedProducts.length > 0) {
    groupedProducts.push({
      id: "uncategorized",
      name: "Other Products",
      products: uncategorizedProducts,
    });
  }

  return (
    <PageWrapper>
      <div className="unified-page">
        <motion.header 
          className="unified-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="unified-hero-content">
            <motion.div 
              className="unified-hero-badge"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Sparkles size={14} />
              <span>Quality products for every space</span>
            </motion.div>
            <motion.h1 
              className="unified-hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Shop Home Care & Essentials
            </motion.h1>
            <motion.p 
              className="unified-hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Browse eco-friendly cleaning and care products for every space —
              home, car, office, and Airbnb.
            </motion.p>
          </div>
        </motion.header>
        
        <div className="unified-section">
          <div className="page-content-container">

          {loading ? (
            <div style={{ textAlign: "center", padding: "48px" }}>
              <p className="muted">Loading products...</p>
            </div>
          ) : groupedProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px" }}>
              <ShoppingBag size={48} style={{ color: "#9ca3af", marginBottom: "16px" }} />
              <p className="muted">No products available at the moment</p>
            </div>
          ) : (
            /* Categories */
            groupedProducts.map((cat, catIdx) => (
              <div key={cat.id || cat.name} className="shop-category section fade-in-up" style={{ animationDelay: `${0.1 + catIdx * 0.05}s` }}>
                <h3 className="shop-category-title">{cat.name}</h3>

                <div className="shop-grid">
                  {cat.products.map((p, idx) => (
                    <div key={p.id} className="shop-card" style={{ animationDelay: `${0.15 + idx * 0.03}s` }}>
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="shop-img" onError={(e) => {
                          e.target.style.display = "none";
                        }} />
                      ) : (
                        <div className="shop-img" style={{ 
                          background: "#f3f4f6", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          color: "#9ca3af"
                        }}>
                          <ShoppingBag size={32} />
                        </div>
                      )}

                      <h4 className="shop-card-title">{p.name}</h4>

                      <p className="shop-card-desc">{p.description || "—"}</p>

                      <div className="shop-card-footer">
                        <span className="shop-card-price">${parseFloat(p.price).toFixed(2)}</span>
                        <button 
                          className="btn shop-add-btn" 
                          onClick={() => addToCart(p, 1)}
                          aria-label={`Add ${p.name} to cart`}
                        >
                          <ShoppingBag size={16} />
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          <div className="shop-cta-section fade-in-up fade-in-delay-lg">
            <Link to="/cart" className="btn shop-cart-link">
              <ShoppingBag size={18} />
              View Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
          </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
