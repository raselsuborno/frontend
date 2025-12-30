// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config.js";
import { PageWrapper } from "../components/page-wrapper.jsx";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Calendar,
  CheckCircle2,
  Clock,
  Timer,
  Inbox,
  ShoppingBag,
  CreditCard,
  MapPin,
  Settings,
  LogOut,
  User,
  Mail,
  Phone,
  Upload,
  Eye,
  EyeOff,
  Plus,
} from "lucide-react";

export function DashboardPage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profilePicUrl: "",
    street: "",
    unit: "",
    city: "",
    province: "",
    postal: "",
    country: "",
    newPassword: "",
    confirmPassword: "",
  });

  const token = localStorage.getItem("token");

  // ========== LOAD PROFILE + BOOKINGS ==========
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        const [userRes, bookingRes] = await Promise.all([
          axios.get(`${API_BASE}/api/profile/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE}/api/bookings/mine`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const u = userRes.data;
        setUser(u);

        setForm((prev) => ({
          ...prev,
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          address: u.address || "",
          profilePicUrl: u.profilePicUrl || "",
          street: u.street || "",
          unit: u.unit || "",
          city: u.city || "",
          province: u.province || "",
          postal: u.postal || "",
          country: u.country || "",
          newPassword: "",
          confirmPassword: "",
        }));

        setBookings(bookingRes.data || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };

    fetchData();
  }, [token]);

  // ========== STATS ==========
  const totalBookings = bookings.length;
  const completed = bookings.filter((b) => b.status === "DONE").length;
  const upcomingList = bookings.filter((b) => new Date(b.date) > new Date());
  const upcoming = upcomingList.length;
  const totalHours = totalBookings * 2;

  const nextBooking =
    upcomingList.length > 0
      ? [...upcomingList].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        )[0]
      : null;

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Combine all unique addresses
  const uniqueAddresses = Array.from(
    new Set(
      [
        ...(user?.address ? [user.address] : []),
        ...bookings.map((b) => b.addressLine).filter(Boolean),
      ].filter(Boolean)
    )
  );

  const firstName = user?.name?.split(" ")[0] || "there";

  // Pretty primary address
  const primaryAddress = [
    form.unit,
    form.street,
    form.city,
    form.province,
    form.postal,
    form.country,
  ]
    .filter(Boolean)
    .join(", ");

  // ========== HANDLERS ==========
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        profilePicUrl: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        profilePicUrl: form.profilePicUrl,
        street: form.street,
        unit: form.unit,
        city: form.city,
        province: form.province,
        postal: form.postal,
        country: form.country,
      };

      if (form.newPassword) payload.newPassword = form.newPassword;

      const { data: updated } = await axios.put(
        `${API_BASE}/api/profile`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser((prev) => ({ ...(prev || {}), ...updated }));

      toast.success("Profile updated successfully!");

      setForm((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Could not update profile. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth";
  };

  // ========== LOADING ==========
  if (!user) {
    return (
      <PageWrapper>
        <section className="section" style={{ textAlign: "center" }}>
          <h2>Loading Dashboard...</h2>
          <p className="muted">
            If this never loads, check that backend is running.
          </p>
        </section>
      </PageWrapper>
    );
  }

  // ============================
  // RENDER
  // ============================
  return (
    <PageWrapper>
      <section className="section dash-shell">
        <div className="dash-layout">
          {/* ========== SIDEBAR ========== */}
          <aside className="dash-sidebar">
            <div className="dash-profile">
              <img
                src={
                  form.profilePicUrl ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(user.name || "User")
                }
                alt="avatar"
                className="dash-avatar"
              />
              <div>
                <p className="dash-name">{user.name}</p>
                <p className="dash-email">{user.email}</p>
              </div>
            </div>

            <nav className="dash-nav">
              <button
                className={`dash-nav-item ${
                  activeTab === "overview" ? "is-active" : ""
                }`}
                onClick={() => setActiveTab("overview")}
              >
                <LayoutDashboard size={20} />
                <span>Overview</span>
              </button>

              <button
                className={`dash-nav-item ${
                  activeTab === "inbox" ? "is-active" : ""
                }`}
                onClick={() => setActiveTab("inbox")}
              >
                <Inbox size={20} />
                <span>Inbox</span>
              </button>

              <button
                className={`dash-nav-item ${
                  activeTab === "orders" ? "is-active" : ""
                }`}
                onClick={() => setActiveTab("orders")}
              >
                <ShoppingBag size={20} />
                <span>Bookings & Orders</span>
              </button>

              <button
                className={`dash-nav-item ${
                  activeTab === "billing" ? "is-active" : ""
                }`}
                onClick={() => setActiveTab("billing")}
              >
                <CreditCard size={20} />
                <span>Billing</span>
              </button>

              <button
                className={`dash-nav-item ${
                  activeTab === "addresses" ? "is-active" : ""
                }`}
                onClick={() => setActiveTab("addresses")}
              >
                <MapPin size={20} />
                <span>Addresses</span>
              </button>

              <button
                className={`dash-nav-item ${
                  activeTab === "profile" ? "is-active" : ""
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <Settings size={20} />
                <span>Profile & Settings</span>
              </button>
            </nav>

            <button
              className="dash-nav-item dash-logout"
              onClick={handleLogout}
              type="button"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </aside>

          {/* ========== MAIN CONTENT ========== */}
          <main className="dash-main">
            {activeTab === "overview" && (
              <DashboardOverview
                firstName={firstName}
                stats={{ totalBookings, completed, upcoming, totalHours }}
                nextBooking={nextBooking}
                recent={recentBookings}
              />
            )}

            {activeTab === "inbox" && (
              <DashboardInbox recent={recentBookings} />
            )}

            {activeTab === "orders" && (
              <DashboardOrders bookings={bookings} />
            )}

            {activeTab === "billing" && (
              <DashboardBilling bookings={bookings} />
            )}

            {activeTab === "addresses" && (
              <DashboardAddresses
                addresses={uniqueAddresses}
                primaryAddress={primaryAddress}
              />
            )}

            {activeTab === "profile" && (
              <DashboardProfile
                form={form}
                onChange={handleChange}
                onSave={handleSave}
                onAvatarChange={handleAvatarChange}
              />
            )}
          </main>
        </div>
      </section>
    </PageWrapper>
  );
}

/* ================== OVERVIEW ================== */
function DashboardOverview({ firstName, stats, nextBooking, recent }) {
  return (
    <div className="dash-main-inner">
      <header className="dash-hero-row fade-in-up">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="muted dash-subtitle">
            Overview of your bookings and activity.
          </p>
        </div>

        <div className="dash-chip">
          <span className="dash-chip-dot" />
          <span>New: Bundle home + auto for 10% off</span>
        </div>
      </header>

      <div className="dash-stat-grid fade-in-up fade-in-delay-sm">
        <StatCard
          label="Total bookings"
          value={stats.totalBookings}
          icon={Calendar}
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckCircle2}
        />
        <StatCard
          label="Upcoming"
          value={stats.upcoming}
          icon={Clock}
        />
        <StatCard
          label="Hours booked"
          value={stats.totalHours}
          icon={Timer}
        />
      </div>

      <div className="dash-two-col fade-in-up fade-in-delay-md">
        <div className="dash-card">
          <h3 className="dash-card-title">Next booking</h3>
          {!nextBooking && (
            <p className="muted">No upcoming bookings yet.</p>
          )}
          {nextBooking && (
            <div className="next-block">
              <p className="next-date">
                {new Date(nextBooking.date).toLocaleString()}
              </p>
              <p className="next-service">
                {nextBooking.service?.name ||
                  nextBooking.serviceType ||
                  "Service"}
              </p>
              <p className="next-address muted">
                {nextBooking.addressLine}
              </p>
              <p className="next-status-chip">
                {nextBooking.status || "NEW"}
              </p>
            </div>
          )}
        </div>

        <div className="dash-card">
          <h3 className="dash-card-title">Recent activity</h3>
          {recent.length === 0 ? (
            <p className="muted">No recent bookings yet.</p>
          ) : (
            <ul className="dash-list">
              {recent.map((b) => (
                <li key={b.id}>
                  <div className="dash-list-main">
                    <span className="dash-list-title">
                      {b.service?.name ||
                        b.serviceType ||
                        "Service"}
                    </span>
                    <span className="dash-list-meta">
                      {new Date(b.date).toLocaleString()}
                    </span>
                  </div>
                  <p className="dash-list-sub muted">{b.addressLine}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================== INBOX ================== */
function DashboardInbox({ recent }) {
  const messages =
    recent.length === 0
      ? []
      : recent.map((b) => ({
          id: b.id,
          title: "Booking update",
          body:
            (b.service?.name || b.serviceType || "Service") +
            " • " +
            new Date(b.date).toLocaleString(),
        }));

  return (
    <div className="dash-main-inner fade-in-up">
      <header className="dash-page-header">
        <div>
          <h2 className="dash-title">Inbox</h2>
          <p className="muted dash-subtitle">
            Messages about your bookings and updates.
          </p>
        </div>
      </header>

      <div className="dash-card fade-in-up fade-in-delay-sm">
        {messages.length === 0 ? (
          <div className="dash-empty-state">
            <Inbox size={48} className="dash-empty-icon" />
            <p className="dash-empty-text">No messages yet</p>
            <p className="dash-empty-subtext muted">
              You'll see booking updates and notifications here.
            </p>
          </div>
        ) : (
          <ul className="dash-list">
            {messages.map((m, idx) => (
              <li key={m.id} style={{ animationDelay: `${0.1 + idx * 0.05}s` }}>
                <div className="dash-list-main">
                  <div className="dash-list-content">
                    <span className="dash-list-title">{m.title}</span>
                    <p className="dash-list-sub muted">{m.body}</p>
                  </div>
                  <span className="dash-list-meta">Just now</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ================== ORDERS ================== */
function DashboardOrders({ bookings }) {
  return (
    <div className="dash-main-inner fade-in-up">
      <header className="dash-page-header">
        <div>
          <h2 className="dash-title">Bookings & Orders</h2>
          <p className="muted dash-subtitle">
            All your scheduled and completed bookings.
          </p>
        </div>
      </header>

      <div className="dash-card fade-in-up fade-in-delay-sm">
        {bookings.length === 0 ? (
          <div className="dash-empty-state">
            <ShoppingBag size={48} className="dash-empty-icon" />
            <p className="dash-empty-text">No bookings yet</p>
            <p className="dash-empty-subtext muted">
              Start booking services to see them here.
            </p>
          </div>
        ) : (
          <div className="dash-table-wrapper">
            <div className="dash-table">
              <div className="dash-table-head">
                <span>Service</span>
                <span>Date</span>
                <span>Status</span>
                <span>Payment</span>
              </div>
              {bookings.map((b, idx) => (
                <div 
                  className="dash-table-row fade-in-up" 
                  key={b.id}
                  style={{ animationDelay: `${0.15 + idx * 0.05}s` }}
                >
                  <span className="dash-table-cell-main">
                    {b.service?.name || b.serviceType || "Service"}
                  </span>
                  <span className="dash-table-cell">
                    {b.date ? new Date(b.date).toLocaleDateString() : "—"}
                  </span>
                  <span className={`dash-status-pill dash-status-pill-${(b.status || "NEW").toLowerCase()}`}>
                    {b.status || "NEW"}
                  </span>
                  <span className="dash-table-cell muted">
                    {b.paymentMethod === "card" ? (
                      <span className="dash-payment-badge">
                        <CreditCard size={14} />
                        Card
                      </span>
                    ) : (
                      "Pay later"
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================== BILLING ================== */
function DashboardBilling({ bookings }) {
  const cardCount = bookings.filter(
    (b) => b.paymentMethod === "card"
  ).length;

  return (
    <div className="dash-main-inner fade-in-up">
      <header className="dash-page-header">
        <div>
          <h2 className="dash-title">Billing</h2>
          <p className="muted dash-subtitle">
            Recent payments and card usage.
          </p>
        </div>
      </header>

      <div className="dash-card-grid fade-in-up fade-in-delay-sm">
        <div className="dash-card">
          <div className="dash-card-header">
            <CreditCard size={20} className="dash-card-icon" />
            <h3 className="dash-card-title">Payment methods</h3>
          </div>
          <div className="dash-card-content">
            <div className="dash-info-row">
              <span className="dash-info-label">Default</span>
              <span className="dash-info-value">Pay later</span>
            </div>
            <div className="dash-info-row">
              <span className="dash-info-label">Card bookings</span>
              <span className="dash-info-value">{cardCount}</span>
            </div>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-header">
            <div className="dash-card-icon-placeholder" />
            <h3 className="dash-card-title">Billing notes</h3>
          </div>
          <div className="dash-card-content">
            <p className="muted dash-card-text">
              You'll only be charged after your booking is confirmed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================== ADDRESSES ================== */
function DashboardAddresses({ addresses, primaryAddress }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    unit: "",
    city: "",
    province: "",
    postal: "",
    country: "",
    label: "",
  });

  const otherAddresses = addresses || [];

  const handleAddAddress = () => {
    setShowAddForm(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      const payload = {
        street: newAddress.street,
        unit: newAddress.unit,
        city: newAddress.city,
        province: newAddress.province,
        postal: newAddress.postal,
        country: newAddress.country || "Canada",
      };

      await axios.put(
        `${API_BASE}/api/profile`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Address added successfully!");
      setShowAddForm(false);
      setNewAddress({
        street: "",
        unit: "",
        city: "",
        province: "",
        postal: "",
        country: "",
        label: "",
      });
      // Reload page to show new address
      window.location.reload();
    } catch (err) {
      console.error("Address save error:", err);
      toast.error("Could not save address. Please try again.");
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setNewAddress({
      street: "",
      unit: "",
      city: "",
      province: "",
      postal: "",
      country: "",
      label: "",
    });
  };

  return (
    <div className="dash-main-inner fade-in-up">
      <header className="dash-page-header">
        <div>
          <h2 className="dash-title">Saved addresses</h2>
          <p className="muted dash-subtitle">
            Locations you use most often.
          </p>
        </div>
        <button
          className="dash-add-address-btn"
          onClick={handleAddAddress}
          aria-label="Add new address"
        >
          <Plus size={18} />
          <span>Add Address</span>
        </button>
      </header>

      {showAddForm ? (
        <div className="dash-card fade-in-up fade-in-delay-sm">
          <div className="dash-card-header">
            <MapPin size={20} className="dash-card-icon" />
            <h3 className="dash-card-title">Add New Address</h3>
          </div>
          <form onSubmit={handleSaveAddress} className="dash-form">
            <div className="dash-form-grid">
              <div>
                <label className="dash-label">Street Address</label>
                <input
                  type="text"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="dash-input"
                  required
                  placeholder="123 Main Street"
                />
              </div>
              <div>
                <label className="dash-label">Unit / Apt</label>
                <input
                  type="text"
                  value={newAddress.unit}
                  onChange={(e) => setNewAddress({ ...newAddress, unit: e.target.value })}
                  className="dash-input"
                  placeholder="Apt 4B (optional)"
                />
              </div>
              <div>
                <label className="dash-label">City</label>
                <input
                  type="text"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="dash-input"
                  required
                  placeholder="Saskatoon"
                />
              </div>
              <div>
                <label className="dash-label">Province</label>
                <input
                  type="text"
                  value={newAddress.province}
                  onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                  className="dash-input"
                  required
                  placeholder="Saskatchewan"
                />
              </div>
              <div>
                <label className="dash-label">Postal Code</label>
                <input
                  type="text"
                  value={newAddress.postal}
                  onChange={(e) => setNewAddress({ ...newAddress, postal: e.target.value })}
                  className="dash-input"
                  required
                  placeholder="S7K 0A1"
                />
              </div>
              <div>
                <label className="dash-label">Country</label>
                <input
                  type="text"
                  value={newAddress.country || "Canada"}
                  onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                  className="dash-input"
                  placeholder="Canada"
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <button type="submit" className="btn">
                Save Address
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="dash-card-grid fade-in-up fade-in-delay-sm">
          {primaryAddress && (
            <div className="dash-card dash-card-primary">
              <div className="dash-card-header">
                <MapPin size={20} className="dash-card-icon" />
                <h3 className="dash-card-title">Primary address</h3>
              </div>
              <p className="dash-card-text muted">{primaryAddress}</p>
            </div>
          )}

          {otherAddresses.length === 0 && !primaryAddress && (
            <div className="dash-card">
              <div className="dash-empty-state">
                <MapPin size={48} className="dash-empty-icon" />
                <p className="dash-empty-text">No saved addresses</p>
                <p className="dash-empty-subtext muted">
                  Add addresses to make booking faster.
                </p>
              </div>
            </div>
          )}

          {otherAddresses.map((addr, i) => (
            <div className="dash-card fade-in-up" key={i} style={{ animationDelay: `${0.2 + i * 0.05}s` }}>
              <div className="dash-card-header">
                <MapPin size={20} className="dash-card-icon" />
                <h3 className="dash-card-title">Address {i + 1}</h3>
              </div>
              <p className="dash-card-text muted">{addr}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================== PROFILE ================== */
function DashboardProfile({ form, onChange, onSave, onAvatarChange }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const avatarSrc =
    form.profilePicUrl ||
    "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(form.name || "User");

  return (
    <div className="dash-main-inner fade-in-up">
      <header className="dash-page-header">
        <div>
          <h2 className="dash-title">Profile & Settings</h2>
          <p className="muted dash-subtitle">
            Update your profile picture, address & password.
          </p>
        </div>
      </header>

      <div className="dash-card fade-in-up fade-in-delay-sm">
        {/* Avatar */}
        <div className="dash-profile-section">
          <div className="dash-avatar-wrapper">
            <img
              src={avatarSrc}
              alt="Profile avatar"
              className="dash-profile-avatar"
            />
            <div className="dash-avatar-overlay">
              <Upload size={20} />
            </div>
          </div>

          <div className="dash-profile-info">
            <h3 className="dash-profile-name">Profile picture</h3>
            <p className="muted dash-profile-desc">
              This is how you appear across the platform.
            </p>
            <label className="dash-upload-label">
              <Upload size={16} />
              <span>Upload new photo</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onAvatarChange(file);
                }}
              />
            </label>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSave} className="dash-form">
          <div className="dash-form-grid">
            <div>
              <label className="dash-label">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                className="dash-input"
                required
              />
            </div>

            <div>
              <label className="dash-label">
                <Mail size={14} />
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                className="dash-input"
                disabled
              />
            </div>

            <div>
              <label className="dash-label">
                <Phone size={14} />
                Phone
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="dash-input"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label className="dash-label">Address Notes</label>
              <input
                name="address"
                value={form.address}
                onChange={onChange}
                className="dash-input"
                placeholder="Home / Office / etc."
              />
            </div>

            <div>
              <label className="dash-label">Street</label>
              <input
                name="street"
                value={form.street}
                onChange={onChange}
                className="dash-input"
              />
            </div>

            <div>
              <label className="dash-label">Unit</label>
              <input
                name="unit"
                value={form.unit}
                onChange={onChange}
                className="dash-input"
              />
            </div>

            <div>
              <label className="dash-label">City</label>
              <input
                name="city"
                value={form.city}
                onChange={onChange}
                className="dash-input"
              />
            </div>

            <div>
              <label className="dash-label">Province</label>
              <input
                name="province"
                value={form.province}
                onChange={onChange}
                className="dash-input"
              />
            </div>

            <div>
              <label className="dash-label">Postal Code</label>
              <input
                name="postal"
                value={form.postal}
                onChange={onChange}
                className="dash-input"
              />
            </div>

            <div>
              <label className="dash-label">Country</label>
              <input
                name="country"
                value={form.country}
                onChange={onChange}
                className="dash-input"
              />
            </div>
          </div>

          {/* Password */}
          <div
            style={{
              marginTop: 22,
              paddingTop: 18,
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 10,
              }}
            >
              Password
            </p>

            <div className="dash-form-grid">
              <div>
                <label className="dash-label">New Password</label>
                <div className="dash-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={form.newPassword}
                    onChange={onChange}
                    className="dash-input"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="dash-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="dash-label">Confirm Password</label>
                <div className="dash-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={onChange}
                    className="dash-input"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    className="dash-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="btn" style={{ marginTop: 16 }}>
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
}

/* ================== STAT CARD ================== */
function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="dash-stat-card">
      <div className="dash-stat-icon-wrap">
        <Icon size={22} strokeWidth={2} />
      </div>
      <div className="dash-stat-content">
        <p className="stat-val">{value ?? 0}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}
