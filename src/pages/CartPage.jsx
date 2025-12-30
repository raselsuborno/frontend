import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PageWrapper } from "../components/page-wrapper.jsx";
import toast from "react-hot-toast";
import { Trash2, ShoppingBag, Plus, Minus, ArrowLeft } from "lucide-react";

export function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setItems(stored);
  }, []);

  // Group items by product ID and count quantities
  const groupedItems = items.reduce((acc, item) => {
    const key = item.id || item.name;
    if (acc[key]) {
      acc[key].quantity += 1;
    } else {
      acc[key] = { ...item, quantity: 1 };
    }
    return acc;
  }, {});

  const cartItems = Object.values(groupedItems);
  const subtotal = items.reduce((sum, i) => sum + i.price, 0);
  const tax = subtotal * 0.13; // 13% tax (Saskatchewan)
  const total = subtotal + tax;

  const updateQuantity = (itemId, change) => {
    const item = cartItems.find(i => (i.id || i.name) === itemId);
    if (!item) return;

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    let newCart = [...existingCart];

    if (change > 0) {
      // Add one
      newCart.push(item);
    } else {
      // Remove one
      const index = newCart.findIndex(i => (i.id || i.name) === itemId);
      if (index > -1) {
        newCart.splice(index, 1);
      }
    }

    setItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeItem = (itemId) => {
    const newItems = items.filter(i => (i.id || i.name) !== itemId);
    setItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
    toast.success("Item removed from cart");
  };

  const clearCart = () => {
    setItems([]);
    localStorage.setItem("cart", JSON.stringify([]));
    toast.success("Cart cleared");
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to checkout");
      navigate("/auth");
      return;
    }

    try {
      // Convert cart items to order format
      const orderItems = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      await axios.post(
        `${API_BASE}/api/shop/orders`,
        { items: orderItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Clear cart after successful order
      setItems([]);
      localStorage.setItem("cart", JSON.stringify([]));
      
      toast.success("Order placed successfully! 🎉");
      navigate("/dashboard");
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error(err.response?.data?.message || "Failed to place order. Please try again.");
    }
  };

  return (
    <PageWrapper>
      <div className="layout">
        <section className="section cart-page fade-in-up">
          <div className="cart-header fade-in-up fade-in-delay-sm">
            <Link to="/shop" className="cart-back-link">
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>
            <h2 className="cart-title">Your Cart</h2>
            <p className="muted">
              Review your selected items before checkout.
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="cart-empty fade-in-up fade-in-delay-md">
              <div className="cart-empty-icon">
                <ShoppingBag size={96} strokeWidth={1.5} />
              </div>
              <h3 className="cart-empty-title">Your cart is empty</h3>
              <p className="cart-empty-subtitle">Start adding products to see them here.</p>
              <Link to="/shop" className="btn cart-empty-btn">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="cart-content fade-in-up fade-in-delay-md">
              <div className="cart-items">
                {cartItems.map((item, idx) => (
                  <div key={item.id || item.name || idx} className="cart-item fade-in-up" style={{ animationDelay: `${0.1 + idx * 0.05}s` }}>
                    <div className="cart-item-image">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="cart-item-details">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <p className="cart-item-desc">{item.desc}</p>
                      <div className="cart-item-price">${item.price.toFixed(2)}</div>
                    </div>
                    <div className="cart-item-controls">
                      <div className="cart-quantity">
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.id || item.name, -1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="cart-qty-value">{item.quantity}</span>
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.id || item.name, 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        className="cart-remove-btn"
                        onClick={() => removeItem(item.id || item.name)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary fade-in-up fade-in-delay-lg">
                <div className="cart-summary-card">
                  <h3 className="cart-summary-title">Order Summary</h3>
                  
                  <div className="cart-summary-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="cart-summary-row">
                    <span>Tax (13%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="cart-summary-divider"></div>
                  <div className="cart-summary-row cart-summary-total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <button
                    className="btn cart-checkout-btn"
                    onClick={handleCheckout}
                    disabled={!cartItems.length}
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    className="cart-clear-btn"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </PageWrapper>
  );
}
