import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageWrapper } from "../components/page-wrapper.jsx";
import toast from "react-hot-toast";
import { ShoppingBag, Plus, Minus, Sparkles } from "lucide-react";

// ⭐ IMPORT ALL PRODUCT IMAGES
import dishwash from "../assets/products/dishwash.png";
import multipurpose from "../assets/products/multipurpose.png";
import ovenCleaner from "../assets/products/oven-cleaner.png";
import bleach from "../assets/products/bleach.png";
import fabricSoap from "../assets/products/fabric-soap.png";
import airFreshener from "../assets/products/air-freshener.png";

import microfiber from "../assets/products/microfiber.png";
import carShampoo from "../assets/products/car-shampoo.png";
import carFreshener from "../assets/products/car-freshener.png";

import officeBundle from "../assets/products/office-bundle.png";
import tissueRolls from "../assets/products/tissue-rolls.png";

import airbnbKit from "../assets/products/airbnb-kit.png";
import miniCondiments from "../assets/products/mini-condiments.png";


export function ShopPage() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  }, []);

  const addToCart = (product, quantity = 1) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const newItems = Array(quantity).fill(product);
    const updatedCart = [...existingCart, ...newItems];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartCount(updatedCart.length);
    toast.success(`Added ${quantity}x ${product.name} to cart`, {
      icon: "🛒",
      duration: 2000,
    });
  };

  const categories = [
    {
      name: "Home Care & Essentials",
      products: [
        {
          id: 1,
          name: "Dish Wash Liquid — Citrus",
          img: dishwash,
          desc: "Concentrated grease-fighter, gentle on hands and tough on oil.",
          price: 5.99,
        },
        {
          id: 2,
          name: "Multi-purpose Cleaner",
          img: multipurpose,
          desc: "Streak-free cleaner for counters, glass, and sealed wood.",
          price: 6.49,
        },
        {
          id: 3,
          name: "Oven Cleaner Gel",
          img: ovenCleaner,
          desc: "Thick gel formula dissolves heavy baked-on grease fast.",
          price: 7.25,
        },
        {
          id: 4,
          name: "Household Bleach",
          img: bleach,
          desc: "Powerful disinfectant and stain remover.",
          price: 4.99,
        },
        {
          id: 5,
          name: "Fabric Soap (Laundry)",
          img: fabricSoap,
          desc: "Gentle high-performance laundry wash.",
          price: 8.49,
        },
        {
          id: 6,
          name: "Air Freshener Spray",
          img: airFreshener,
          desc: "Neutralizes odors with a fresh citrus scent.",
          price: 5.25,
        },
      ],
    },
    {
      name: "Automotive Cleaning",
      products: [
        {
          id: 7,
          name: "Microfiber Towels — 3 pack",
          img: microfiber,
          desc: "Ultra-soft lint-free detailing towels.",
          price: 9.99,
        },
        {
          id: 8,
          name: "Car Wash Shampoo",
          img: carShampoo,
          desc: "Foaming shampoo for a glossy finish.",
          price: 8.75,
        },
        {
          id: 9,
          name: "Car Air Freshener",
          img: carFreshener,
          desc: "Long-lasting visor & vent scent packs.",
          price: 3.99,
        },
      ],
    },
    {
      name: "Corporate Cleaning Bundles",
      products: [
        {
          id: 10,
          name: "Office Bulk Bundle",
          img: officeBundle,
          desc: "Sanitizers, wipes, sprays & tissues in one kit.",
          price: 59.99,
        },
        {
          id: 11,
          name: "Tissue Rolls — 20 pack",
          img: tissueRolls,
          desc: "High-capacity soft absorbent rolls.",
          price: 18.99,
        },
      ],
    },
    {
      name: "Airbnb Essentials",
      products: [
        {
          id: 12,
          name: "Airbnb Host Starter Kit",
          img: airbnbKit,
          desc: "Welcome essentials and mini toiletry packs.",
          price: 39.5,
        },
        {
          id: 13,
          name: "Mini Condiment Pack",
          img: miniCondiments,
          desc: "Salt, pepper, sugar & tea — guest-friendly.",
          price: 9.49,
        },
      ],
    },
  ];

  return (
    <PageWrapper>
      <div className="layout">
        <section className="section shop-page fade-in-up">

          {/* Header */}
          <div className="shop-header fade-in-up fade-in-delay-sm">
            <div className="shop-hero-badge">
              <Sparkles size={14} />
              <span>Quality products for every space</span>
            </div>
            <h1 className="shop-title">Shop Home Care & Essentials</h1>
            <p className="shop-subtitle">
              Browse eco-friendly cleaning and care products for every space —
              home, car, office, and Airbnb.
            </p>
          </div>

          {/* Categories */}
          {categories.map((cat, catIdx) => (
            <div key={cat.name} className="shop-category section fade-in-up" style={{ animationDelay: `${0.1 + catIdx * 0.05}s` }}>
              <h3 className="shop-category-title">{cat.name}</h3>

              <div className="shop-grid">
                {cat.products.map((p, idx) => (
                  <div key={p.id} className="shop-card" style={{ animationDelay: `${0.15 + idx * 0.03}s` }}>
                    <img src={p.img} alt={p.name} className="shop-img" />

                    <h4 className="shop-card-title">{p.name}</h4>

                    <p className="shop-card-desc">{p.desc}</p>

                    <div className="shop-card-footer">
                      <span className="shop-card-price">${p.price.toFixed(2)}</span>
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
          ))}

          <div className="shop-cta-section fade-in-up fade-in-delay-lg">
            <Link to="/cart" className="btn shop-cart-link">
              <ShoppingBag size={18} />
              View Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
          </div>

        </section>
      </div>
    </PageWrapper>
  );
}
