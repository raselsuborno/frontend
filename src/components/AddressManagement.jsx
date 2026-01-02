import React, { useState, useEffect } from "react";
import apiClient from "../lib/api.js";
import toast from "react-hot-toast";
import { Plus, Edit, Trash2, MapPin, Star, X, Check } from "lucide-react";

export function AddressManagement({ onAddressSelect }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    fullName: "",
    phone: "",
    street: "",
    unit: "",
    city: "",
    province: "",
    postal: "",
    country: "Canada",
    isDefault: false,
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/addresses");
      setAddresses(response.data);
    } catch (error) {
      console.error("Failed to load addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.street || !formData.city || !formData.postal) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingId) {
        await apiClient.put(`/api/addresses/${editingId}`, formData);
        toast.success("Address updated successfully");
      } else {
        await apiClient.post("/api/addresses", formData);
        toast.success("Address added successfully");
      }
      setShowAddForm(false);
      setEditingId(null);
      resetForm();
      loadAddresses();
    } catch (error) {
      console.error("Failed to save address:", error);
      toast.error(error.response?.data?.message || "Failed to save address");
    }
  };

  const handleEdit = (address) => {
    setFormData({
      label: address.label || "",
      fullName: address.fullName || "",
      phone: address.phone || "",
      street: address.street || "",
      unit: address.unit || "",
      city: address.city || "",
      province: address.province || "",
      postal: address.postal || "",
      country: address.country || "Canada",
      isDefault: address.isDefault || false,
    });
    setEditingId(address.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      await apiClient.delete(`/api/addresses/${id}`);
      toast.success("Address deleted successfully");
      loadAddresses();
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await apiClient.post(`/api/addresses/${id}/set-default`);
      toast.success("Default address updated");
      loadAddresses();
    } catch (error) {
      console.error("Failed to set default address:", error);
      toast.error("Failed to set default address");
    }
  };

  const resetForm = () => {
    setFormData({
      label: "",
      fullName: "",
      phone: "",
      street: "",
      unit: "",
      city: "",
      province: "",
      postal: "",
      country: "Canada",
      isDefault: false,
    });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="dash-card">
        <p className="muted">Loading addresses...</p>
      </div>
    );
  }

  return (
    <div className="dash-main-inner fade-in-up">
      <header className="dash-page-header">
        <div>
          <h2 className="dash-title">Saved Addresses</h2>
          <p className="muted dash-subtitle">
            Manage your saved addresses for faster booking.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Plus size={18} />
          Add Address
        </button>
      </header>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="dash-card" style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 600 }}>
              {editingId ? "Edit Address" : "Add New Address"}
            </h3>
            <button
              onClick={handleCancel}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", marginBottom: "4px", fontWeight: 500 }}>
                  Label (e.g., Home, Office)
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Home"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", marginBottom: "4px", fontWeight: 500 }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "14px", marginBottom: "4px", fontWeight: 500 }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", marginBottom: "4px", fontWeight: 500 }}>
                  Street Address *
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", marginBottom: "4px", fontWeight: 500 }}>
                  Unit/Apt (optional)
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", marginBottom: "4px", fontWeight: 500 }}>
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "14px", marginBottom: "4px", fontWeight: 500 }}>
                    Province *
                  </label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "14px", marginBottom: "4px", fontWeight: 500 }}>
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={formData.postal}
                    onChange={(e) => setFormData({ ...formData, postal: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <label htmlFor="isDefault" style={{ fontSize: "14px", cursor: "pointer" }}>
                  Set as default address
                </label>
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  {editingId ? "Update Address" : "Add Address"}
                </button>
                <button type="button" className="btn-secondary" onClick={handleCancel} style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Addresses List */}
      {addresses.length === 0 && !showAddForm ? (
        <div className="dash-card">
          <div className="dash-empty-state">
            <MapPin size={48} className="dash-empty-icon" />
            <p className="dash-empty-text">No saved addresses</p>
            <p className="dash-empty-subtext muted">
              Add an address to make booking faster and easier.
            </p>
            <button
              className="btn-primary"
              onClick={() => setShowAddForm(true)}
              style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px", margin: "16px auto 0" }}
            >
              <Plus size={18} />
              Add Your First Address
            </button>
          </div>
        </div>
      ) : (
        <div className="dash-card-grid" style={{ gridTemplateColumns: "1fr" }}>
          {addresses.map((address) => (
            <div
              key={address.id}
              className="dash-card"
              style={{
                border: address.isDefault ? "2px solid var(--primary)" : "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 600 }}>{address.label || "Home"}</h3>
                    {address.isDefault && (
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "2px 8px",
                          background: "var(--primary)",
                          color: "white",
                          borderRadius: "12px",
                          fontWeight: 500,
                        }}
                      >
                        Default
                      </span>
                    )}
                  </div>
                  {address.fullName && (
                    <p style={{ fontSize: "14px", marginBottom: "4px", fontWeight: 500 }}>
                      {address.fullName}
                    </p>
                  )}
                  {address.phone && (
                    <p className="muted" style={{ fontSize: "13px", marginBottom: "8px" }}>
                      {address.phone}
                    </p>
                  )}
                  <p className="muted" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                    {address.street}
                    {address.unit && `, ${address.unit}`}
                    <br />
                    {address.city}, {address.province} {address.postal}
                    <br />
                    {address.country}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "4px", flexDirection: "column" }}>
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      style={{
                        padding: "6px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                      }}
                      title="Set as default"
                    >
                      <Star size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    style={{
                      padding: "6px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--primary)",
                    }}
                    title="Edit address"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    style={{
                      padding: "6px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--error)",
                    }}
                    title="Delete address"
                  >
                    <Trash2 size={16} />
                  </button>
                  {onAddressSelect && (
                    <button
                      onClick={() => onAddressSelect(address)}
                      className="btn-outline"
                      style={{
                        padding: "4px 12px",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      Use
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


