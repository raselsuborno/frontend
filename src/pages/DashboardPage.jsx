// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import apiClient from "../lib/api.js";
import { PageWrapper } from "../components/page-wrapper.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { extractArrayData } from "../utils/apiHelpers.js";
import toast from "react-hot-toast";
import "../styles/dashboard-modern.css";
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
  X,
  RefreshCw,
  Star,
  Filter,
  FileText,
  Download,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ClipboardList,
  Tag,
  Edit,
  Save,
  Trash2,
  Quote,
} from "lucide-react";
import { BookingDetailModal } from "../components/BookingDetailModal.jsx";
import { AddressManagement } from "../components/AddressManagement.jsx";
import { LoadingSpinner } from "../components/ui/LoadingSpinner.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Breadcrumbs } from "../components/ui/Breadcrumbs.jsx";
import { StatCard } from "../components/ui/StatCard.jsx";
import { Tooltip } from "../components/ui/Tooltip.jsx";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user: authUser, profile, session, loading: authLoading } = useAuth();
  const [user, setUser] = useState(null); // Profile data from API
  const [bookings, setBookings] = useState([]);
  const [chores, setChores] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // ========== LOAD PROFILE + BOOKINGS ==========
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // Check if user has valid session
    if (!session || !session.access_token) {
      setLoading(false);
      setError("Please log in to view your dashboard.");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("[Dashboard] Fetching profile and bookings...");
        
        // Add timeout to prevent hanging forever
        const profilePromise = apiClient.get("/api/profile/me");
        const bookingsPromise = apiClient.get("/api/bookings/mine");
        const choresPromise = apiClient.get("/api/chores").catch(err => {
          console.warn("[Dashboard] Failed to load chores:", err);
          return { data: [] }; // Return empty array on error
        });
        const quotesPromise = apiClient.get("/api/quotes/mine").catch(err => {
          console.warn("[Dashboard] Failed to load quotes:", err);
          return { data: [] }; // Return empty array on error
        });
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Request timeout after 15 seconds")), 15000)
        );

        const [userRes, bookingRes, choresRes, quotesRes] = await Promise.race([
          Promise.all([profilePromise, bookingsPromise, choresPromise, quotesPromise]),
          timeoutPromise
        ]);

        const u = userRes.data;
        console.log("[Dashboard] ✅ Profile loaded:", u);
        setUser(u);

        setForm((prev) => ({
          ...prev,
          name: u.name || u.fullName || "",
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

        const bookingsData = extractArrayData(bookingRes.data);
        const choresData = extractArrayData(choresRes.data);
        const quotesData = extractArrayData(quotesRes.data);
        setBookings(bookingsData);
        setChores(choresData);
        setQuotes(quotesData);
        setError(null);
      } catch (err) {
        console.error("[Dashboard] ❌ Load error:", err);
        setError(err.response?.data?.message || err.message || "Failed to load dashboard. Please refresh the page.");
        // Don't set user to null - show error but keep UI functional if user was previously loaded
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authLoading, session]);

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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 10MB = 10000 KB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Image size must be less than 10MB (${(file.size / (1024 * 1024)).toFixed(2)}MB selected). Please compress your image and try again.`);
      return;
    }

    const reader = new FileReader();
    
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };

    reader.onloadend = () => {
      const base64String = reader.result;
      console.log("[Profile] Image loaded, size:", base64String.length);
      
      setForm((prev) => ({
        ...prev,
        profilePicUrl: base64String,
      }));
      
      toast.success("Image selected! Click 'Save changes' to update your profile picture.");
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
        fullName: form.name || form.fullName,
        phone: form.phone || null,
        profilePicUrl: form.profilePicUrl || null,
        street: form.street || null,
        unit: form.unit || null,
        city: form.city || null,
        province: form.province || null,
        postal: form.postal || null,
        country: form.country || null,
      };

      console.log("[Profile] Saving profile with picture:", {
        hasProfilePicUrl: !!payload.profilePicUrl,
        profilePicUrlLength: payload.profilePicUrl?.length || 0,
      });

      // Note: Password update would need a separate endpoint in Supabase
      // if (form.newPassword) payload.newPassword = form.newPassword;

      const { data: updated } = await apiClient.put(
        "/api/profile",
        payload
      );

      console.log("[Profile] Profile updated successfully:", {
        hasProfilePicUrl: !!updated.profilePicUrl,
      });

      // Update both user state and form state with the response
      setUser((prev) => ({ ...(prev || {}), ...updated }));

      setForm((prev) => ({
        ...prev,
        name: updated.fullName || updated.name || prev.name,
        profilePicUrl: updated.profilePicUrl || prev.profilePicUrl,
        newPassword: "",
        confirmPassword: "",
      }));

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Could not update profile";
      toast.error(errorMessage);
    }
  };

  // Logout is handled by AuthContext - just redirect
  const handleLogout = () => {
    window.location.href = "/";
  };

  // ========== LOADING ==========
  // Wait for auth to finish loading - ProtectedRoute handles redirects, so just show loading
  if (authLoading) {
    return (
      <PageWrapper>
        <section className="section" style={{ textAlign: "center", padding: "60px 20px" }}>
          <h2>Loading Dashboard...</h2>
          <p className="muted">
            Please wait while we load your profile.
          </p>
        </section>
      </PageWrapper>
    );
  }

  // Show loading while fetching user data from API
  if (loading && !user) {
    return (
      <PageWrapper>
        <section className="section" style={{ textAlign: "center", padding: "60px 20px" }}>
          <h2>Loading Dashboard...</h2>
          <p className="muted">
            Please wait while we load your profile.
          </p>
        </section>
      </PageWrapper>
    );
  }

  // ========== ERROR ==========
  // Show error only if user is loaded but there was an error fetching data
  if (error && user) {
    return (
      <PageWrapper>
        <section className="section" style={{ textAlign: "center", padding: "60px 20px" }}>
          <h2>Error Loading Dashboard</h2>
          <p style={{ color: "var(--error)", margin: "20px 0" }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn"
            style={{ marginTop: "20px" }}
          >
            Refresh Page
          </button>
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
          <motion.aside 
            className="dash-sidebar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div 
              className="dash-profile"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <motion.img
                src={
                  form.profilePicUrl ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(user.name || "User")
                }
                alt="avatar"
                className="dash-avatar"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
              <div>
                <p className="dash-name">{user.name}</p>
                <p className="dash-email">{user.email}</p>
              </div>
            </motion.div>

            <nav className="dash-nav">
              <motion.button
                className={`dash-nav-item ${
                  activeTab === "overview" ? "is-active" : ""
                }`}
                onClick={() => setActiveTab("overview")}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <LayoutDashboard size={20} />
                <span>Overview</span>
              </motion.button>

              <motion.button
                className={`dash-nav-item ${
                  activeTab === "inbox" ? "is-active" : ""
                }`}
                onClick={() => setActiveTab("inbox")}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Inbox size={20} />
                <span>Inbox</span>
              </motion.button>

              <motion.button
                className={`dash-nav-item ${
                  activeTab === "orders" ? "is-active" : ""
                }`}
                onClick={() => setActiveTab("orders")}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <ShoppingBag size={20} />
                <span>Bookings & Orders</span>
              </motion.button>

              <motion.button
                className={`dash-nav-item ${
                  activeTab === "billing" ? "is-active" : ""
                }`}
                onClick={() => setActiveTab("billing")}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <CreditCard size={20} />
                <span>Billing</span>
              </motion.button>

              <motion.button
                className={`dash-nav-item ${
                  activeTab === "addresses" ? "is-active" : ""
                }`}
                onClick={() => setActiveTab("addresses")}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <MapPin size={20} />
                <span>Addresses</span>
              </motion.button>

              <motion.button
                className={`dash-nav-item ${
                  activeTab === "chores" ? "is-active" : ""
                }`}
                onClick={() => setActiveTab("chores")}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <ClipboardList size={20} />
                <span>My Chores</span>
              </motion.button>

              <motion.button
                className={`dash-nav-item ${
                  activeTab === "quotes" ? "is-active" : ""
                }`}
                onClick={() => setActiveTab("quotes")}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Quote size={20} />
                <span>Quote Requests</span>
              </motion.button>

              <motion.button
                className={`dash-nav-item ${
                  activeTab === "profile" ? "is-active" : ""
                }`}
                onClick={() => setActiveTab("profile")}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Settings size={20} />
                <span>Profile & Settings</span>
              </motion.button>
            </nav>

            <motion.button
              className="dash-nav-item dash-logout"
              onClick={handleLogout}
              type="button"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </motion.button>
          </motion.aside>

          {/* ========== MAIN CONTENT ========== */}
          <motion.main 
            className="dash-main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardOverview
                  firstName={firstName}
                  stats={{ totalBookings, completed, upcoming, totalHours }}
                  nextBooking={nextBooking}
                  recent={recentBookings}
                  allBookings={bookings}
                  onStatClick={(filterType) => {
                    setActiveTab("orders");
                    setFilter(filterType === "completed" ? "past" : filterType === "upcoming" ? "upcoming" : "all");
                  }}
                />
              </motion.div>
            )}

            {activeTab === "inbox" && (
              <motion.div
                key="inbox"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardInbox recent={recentBookings} />
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardOrders 
                  bookings={bookings}
                  onRefresh={() => {
                    // Refresh bookings
                    const token = localStorage.getItem("token");
                    if (token) {
                      apiClient.get("/api/bookings/mine")
                        .then((res) => {
                          const bookingsData = extractArrayData(res.data);
                          setBookings(bookingsData);
                        })
                        .catch((err) => console.error("Failed to refresh bookings:", err));
                    }
                  }}
                />
              </motion.div>
            )}

            {activeTab === "billing" && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardBilling bookings={bookings} user={user} />
              </motion.div>
            )}

            {activeTab === "addresses" && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <AddressManagement />
              </motion.div>
            )}

            {activeTab === "chores" && (
              <motion.div
                key="chores"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardChores 
                  chores={chores} 
                  onRefresh={async () => {
                    try {
                      const res = await apiClient.get("/api/chores");
                      const choresData = extractArrayData(res.data);
                      setChores(choresData);
                    } catch (err) {
                      console.error("Failed to refresh chores:", err);
                    }
                  }}
                />
              </motion.div>
            )}

            {activeTab === "quotes" && (
              <motion.div
                key="quotes"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardQuotes 
                  quotes={quotes} 
                  onRefresh={async () => {
                    try {
                      const res = await apiClient.get("/api/quotes/mine");
                      const quotesData = extractArrayData(res.data);
                      setQuotes(quotesData);
                    } catch (err) {
                      console.error("Failed to refresh quotes:", err);
                    }
                  }}
                />
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardProfile
                  form={form}
                  onChange={handleChange}
                  onSave={handleSave}
                  onAvatarChange={handleAvatarChange}
                />
              </motion.div>
            )}
            </AnimatePresence>
          </motion.main>
        </div>
      </section>
    </PageWrapper>
  );
}

/* ================== OVERVIEW ================== */
function DashboardOverview({ firstName, stats, nextBooking, recent, allBookings, onFilterChange, onStatClick }) {
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
        <StatCardLegacy
          label="Total bookings"
          value={stats.totalBookings}
          icon={Calendar}
          onClick={() => onStatClick && onStatClick("all")}
          clickable
          variant="blue"
        />
        <StatCardLegacy
          label="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          onClick={() => onStatClick && onStatClick("completed")}
          clickable
          variant="green"
        />
        <StatCardLegacy
          label="Upcoming"
          value={stats.upcoming}
          icon={Clock}
          onClick={() => onStatClick && onStatClick("upcoming")}
          clickable
          variant="orange"
        />
        <StatCardLegacy
          label="Hours booked"
          value={stats.totalHours}
          icon={Timer}
          onClick={() => onStatClick && onStatClick("all")}
          clickable
          variant="purple"
        />
      </div>

      <div className="dash-two-col fade-in-up fade-in-delay-md">
        <div className="dash-card dash-card-next">
          <div className="dash-card-header-enhanced">
            <h3 className="dash-card-title">
              <Calendar size={20} />
              Next booking
            </h3>
          </div>
          {!nextBooking && (
            <EmptyState
              icon={Calendar}
              title="No upcoming bookings"
              description="Book a service to see your next appointment here."
              action={
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.href = "/pricing-booking"}
                >
                  Book Now
                </button>
              }
            />
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

        <div className="dash-card dash-card-recent">
          <div className="dash-card-header-enhanced">
            <h3 className="dash-card-title">
              <Clock size={20} />
              Recent activity
            </h3>
          </div>
          {recent.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No recent activity"
              description="Your booking history will appear here."
            />
          ) : (
            <ul className="dash-list">
              {recent.map((b, idx) => (
                <li key={b.id} className="dash-list-item-enhanced" style={{ animationDelay: `${idx * 0.05}s` }}>
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
          <EmptyState
            icon={Inbox}
            title="No messages yet"
            description="You'll see booking updates and notifications here."
          />
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
function DashboardOrders({ bookings, onRefresh }) {
  const [cancellingId, setCancellingId] = useState(null);
  const [rebookingId, setRebookingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState("all"); // "all", "upcoming", "past", "favorites"

  const handleCancel = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await apiClient.delete(`/api/bookings/${bookingId}`);
      toast.success("Booking cancelled successfully");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Cancel booking error:", err);
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  const handleRebook = async (booking) => {
    if (!confirm("Create a new booking with the same details?")) {
      return;
    }

    setRebookingId(booking.id);
    try {
      await apiClient.post(`/api/bookings/${booking.id}/rebook`, {
        date: booking.date, // Use same date by default, user can edit
        timeSlot: booking.timeSlot,
      });
      toast.success("Booking rebooked successfully!");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Rebook error:", err);
      toast.error(err.response?.data?.message || "Failed to rebook");
    } finally {
      setRebookingId(null);
    }
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const handleModalUpdate = () => {
    if (onRefresh) onRefresh();
  };

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const bookingDate = b.date ? new Date(b.date) : null;
    const now = new Date();
    const isPast = bookingDate && bookingDate < now;
    const isUpcoming = bookingDate && bookingDate >= now;

    switch (filter) {
      case "upcoming":
        return isUpcoming && b.status !== "CANCELLED";
      case "past":
        return isPast || b.status === "COMPLETED";
      case "favorites":
        return b.isFavorite;
      default:
        return true;
    }
  });

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

      {/* Filters */}
      {bookings.length > 0 && (
        <div className="dash-filters">
          <button
            className={`dash-filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({bookings.length})
          </button>
          <button
            className={`dash-filter-btn ${filter === "upcoming" ? "active" : ""}`}
            onClick={() => setFilter("upcoming")}
          >
            Upcoming ({bookings.filter(b => {
              const bookingDate = b.date ? new Date(b.date) : null;
              return bookingDate && bookingDate >= new Date() && b.status !== "CANCELLED";
            }).length})
          </button>
          <button
            className={`dash-filter-btn ${filter === "past" ? "active" : ""}`}
            onClick={() => setFilter("past")}
          >
            Past ({bookings.filter(b => {
              const bookingDate = b.date ? new Date(b.date) : null;
              return (bookingDate && bookingDate < new Date()) || b.status === "COMPLETED";
            }).length})
          </button>
          <button
            className={`dash-filter-btn ${filter === "favorites" ? "active" : ""}`}
            onClick={() => setFilter("favorites")}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Star size={14} fill={filter === "favorites" ? "white" : "none"} />
            Favorites ({bookings.filter(b => b.isFavorite).length})
          </button>
        </div>
      )}

      <div className="dash-card fade-in-up fade-in-delay-sm">
        {filteredBookings.length === 0 ? (
          <div className="dash-empty-state">
            <ShoppingBag size={48} className="dash-empty-icon" />
            <p className="dash-empty-text">
              {bookings.length === 0 ? "No bookings yet" : `No ${filter === "all" ? "" : filter} bookings`}
            </p>
            <p className="dash-empty-subtext muted">
              {bookings.length === 0
                ? "Start booking services to see them here."
                : `Try changing the filter to see more bookings.`}
            </p>
          </div>
        ) : (
          <>
          <div className="dash-table-wrapper">
            <div className="dash-table">
              <div className="dash-table-head">
                <span>Service</span>
                <span>Date</span>
                <span>Status</span>
                  <span>Actions</span>
              </div>
                {filteredBookings.map((b, idx) => {
                const isCancelled = b.status === "CANCELLED";
                const canCancel = !isCancelled && b.status !== "COMPLETED";
                const canRebook = isCancelled;

                return (
                <div 
                  className="dash-table-row fade-in-up" 
                  key={b.id}
                    style={{ 
                      animationDelay: `${0.15 + idx * 0.05}s`,
                      cursor: "pointer",
                    }}
                    onClick={() => handleBookingClick(b)}
                >
                  <span className="dash-table-cell-main">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {b.isFavorite && (
                          <Star size={14} fill="var(--primary)" color="var(--primary)" />
                        )}
                        <div>
                          {b.service?.name || b.serviceName || "Service"}
                          {b.subService && (
                            <span className="muted" style={{ display: "block", fontSize: "12px" }}>
                              {b.subService}
                            </span>
                          )}
                        </div>
                      </div>
                  </span>
                  <span className="dash-table-cell">
                    {b.date ? new Date(b.date).toLocaleDateString() : "—"}
                      {b.timeSlot && (
                        <span className="muted" style={{ display: "block", fontSize: "12px" }}>
                          {b.timeSlot}
                  </span>
                      )}
                  </span>
                    <Badge
                      variant={
                        b.status === "COMPLETED" ? "success" :
                        b.status === "CANCELLED" ? "error" :
                        b.status === "PENDING" ? "warning" :
                        "info"
                      }
                    >
                      {b.status || "PENDING"}
                    </Badge>
                    <span className="dash-table-cell">
                      <div 
                        style={{ display: "flex", gap: "8px", alignItems: "center" }}
                        onClick={(e) => e.stopPropagation()} // Prevent modal from opening when clicking buttons
                      >
                        {canCancel && (
                          <button
                            className="btn-outline"
                            style={{ padding: "4px 12px", fontSize: "12px" }}
                            onClick={() => handleCancel(b.id)}
                            disabled={cancellingId === b.id}
                          >
                            {cancellingId === b.id ? "Cancelling..." : "Cancel"}
                          </button>
                        )}
                        {canRebook && (
                          <button
                            className="btn"
                            style={{ padding: "4px 12px", fontSize: "12px" }}
                            onClick={() => handleRebook(b)}
                            disabled={rebookingId === b.id}
                          >
                            {rebookingId === b.id ? "Rebooking..." : "Rebook"}
                          </button>
                        )}
                        {!canCancel && !canRebook && (
                          <span className="muted" style={{ fontSize: "12px" }}>
                            {b.status === "COMPLETED" ? "Completed" : "—"}
                      </span>
                    )}
                      </div>
                  </span>
                </div>
                );
              })}
            </div>
          </div>
          </>
        )}
      </div>

      {/* Booking Detail Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedBooking(null);
        }}
        onUpdate={handleModalUpdate}
      />
    </div>
  );
}

/* ================== BILLING ================== */
function DashboardBilling({ bookings, user }) {
  const [activeView, setActiveView] = useState("summary"); // "summary" or "invoices"
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "paid", "pending", "refunded"

  // Calculate stats
  const totalBookings = bookings.length;
  const paidBookings = bookings.filter(
    (b) => b.paymentStatus === "paid" || b.status === "COMPLETED"
  );
  const pendingPayments = bookings.filter(
    (b) => (b.paymentStatus === "pending" || !b.paymentStatus) && b.status !== "CANCELLED"
  );
  const totalPaid = paidBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalPending = pendingPayments.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const cardCount = bookings.filter((b) => b.paymentMethod === "card").length;

  // Filter invoices
  const filteredInvoices = bookings.filter((b) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "paid") return b.paymentStatus === "paid" || b.status === "COMPLETED";
    if (filterStatus === "pending") return (b.paymentStatus === "pending" || !b.paymentStatus) && b.status !== "CANCELLED";
    if (filterStatus === "refunded") return b.paymentStatus === "refunded";
    return true;
  }).sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

  const generateInvoiceNumber = (booking) => {
    const date = new Date(booking.createdAt || booking.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const id = booking.id.substring(0, 8).toUpperCase();
    return `INV-${year}${month}-${id}`;
  };

  const handleDownloadInvoice = (booking) => {
    // Generate invoice content
    const invoiceContent = `
INVOICE
Invoice #: ${generateInvoiceNumber(booking)}
Date: ${new Date(booking.createdAt || booking.date).toLocaleDateString()}
Due Date: ${new Date(booking.date).toLocaleDateString()}

BILL TO:
${user?.fullName || user?.name || ""}
${user?.email || ""}

SERVICE DETAILS:
Service: ${booking.service?.name || booking.serviceName || "Service"}
${booking.subService ? `Sub-service: ${booking.subService}` : ""}
Date: ${new Date(booking.date).toLocaleDateString()}
${booking.timeSlot ? `Time: ${booking.timeSlot}` : ""}

LOCATION:
${booking.addressLine}
${booking.city}, ${booking.province} ${booking.postal}

STATUS: ${booking.status}
Payment Status: ${booking.paymentStatus || "Pending"}
Payment Method: ${booking.paymentMethod || "Pay Later"}

AMOUNT: $${(booking.totalAmount || 0).toFixed(2)}

${booking.notes ? `Notes: ${booking.notes}` : ""}
    `.trim();

    // Create and download file
    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice-${generateInvoiceNumber(booking)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dash-main-inner fade-in-up">
      <header className="dash-page-header">
        <div>
          <h2 className="dash-title">Billing & Invoices</h2>
          <p className="muted dash-subtitle">
            View all your purchases, payments, and invoices.
          </p>
        </div>
      </header>

      {/* View Toggle */}
      <div className="dash-filters">
          <button
            className={`dash-filter-btn ${activeView === "summary" ? "active" : ""}`}
            onClick={() => setActiveView("summary")}
          >
            Summary
          </button>
          <button
            className={`dash-filter-btn ${activeView === "invoices" ? "active" : ""}`}
            onClick={() => setActiveView("invoices")}
          >
            All Invoices & Purchases
          </button>
      </div>

      {activeView === "summary" ? (
      <div className="dash-card-grid fade-in-up fade-in-delay-sm">
          <div className="dash-card">
            <div className="dash-card-header">
              <DollarSign size={20} className="dash-card-icon" />
              <h3 className="dash-card-title">Payment Summary</h3>
            </div>
            <div className="dash-card-content">
              <div className="dash-info-row">
                <span className="dash-info-label">Total Paid</span>
                <span className="dash-info-value" style={{ color: "var(--success)", fontWeight: 600 }}>
                  ${totalPaid.toFixed(2)}
                </span>
              </div>
              <div className="dash-info-row">
                <span className="dash-info-label">Pending Payment</span>
                <span className="dash-info-value" style={{ color: "var(--warning)" }}>
                  ${totalPending.toFixed(2)}
                </span>
              </div>
              <div className="dash-info-row">
                <span className="dash-info-label">Total Bookings</span>
                <span className="dash-info-value">{totalBookings}</span>
              </div>
            </div>
          </div>

        <div className="dash-card">
          <div className="dash-card-header">
            <CreditCard size={20} className="dash-card-icon" />
              <h3 className="dash-card-title">Payment Methods</h3>
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
              <div className="dash-info-row">
                <span className="dash-info-label">Paid bookings</span>
                <span className="dash-info-value">{paidBookings.length}</span>
              </div>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-header">
              <FileText size={20} className="dash-card-icon" />
              <h3 className="dash-card-title">Quick Actions</h3>
          </div>
          <div className="dash-card-content">
              <p className="muted dash-card-text" style={{ marginBottom: "12px" }}>
              You'll only be charged after your booking is confirmed.
            </p>
              <button
                className="btn-outline"
                onClick={() => setActiveView("invoices")}
                style={{ width: "100%" }}
              >
                View All Invoices
              </button>
          </div>
        </div>
      </div>
      ) : (
        <div className="fade-in-up">
          {/* Filters */}
          <div className="dash-filters">
            <button
              className={`dash-filter-btn ${filterStatus === "all" ? "active" : ""}`}
              onClick={() => setFilterStatus("all")}
            >
              All ({bookings.length})
            </button>
            <button
              className={`dash-filter-btn ${filterStatus === "paid" ? "active" : ""}`}
              onClick={() => setFilterStatus("paid")}
            >
              Paid ({paidBookings.length})
            </button>
            <button
              className={`dash-filter-btn ${filterStatus === "pending" ? "active" : ""}`}
              onClick={() => setFilterStatus("pending")}
            >
              Pending ({pendingPayments.length})
            </button>
            {bookings.some((b) => b.paymentStatus === "refunded") && (
              <button
                className={`dash-filter-btn ${filterStatus === "refunded" ? "active" : ""}`}
                onClick={() => setFilterStatus("refunded")}
              >
                Refunded ({bookings.filter((b) => b.paymentStatus === "refunded").length})
              </button>
            )}
          </div>

          {/* Invoices List */}
          {filteredInvoices.length === 0 ? (
            <div className="dash-card">
              <div className="dash-empty-state">
                <FileText size={48} className="dash-empty-icon" />
                <p className="dash-empty-text">No invoices found</p>
                <p className="dash-empty-subtext muted">
                  {filterStatus === "all"
                    ? "You don't have any bookings yet."
                    : `No ${filterStatus} invoices found.`}
                </p>
              </div>
            </div>
          ) : (
            <div className="dash-table-wrapper">
              <div className="dash-table">
                <div className="dash-table-head">
                  <span>Invoice #</span>
                  <span>Service</span>
                  <span>Date</span>
                  <span>Amount</span>
                  <span>Payment Status</span>
                  <span>Actions</span>
                </div>
                {filteredInvoices.map((booking, idx) => {
                  const isPaid = booking.paymentStatus === "paid" || booking.status === "COMPLETED";
                  const isPending = (booking.paymentStatus === "pending" || !booking.paymentStatus) && booking.status !== "CANCELLED";
                  const isCancelled = booking.status === "CANCELLED";
                  const amount = booking.totalAmount || 0;

                  return (
                    <div
                      className="dash-table-row fade-in-up"
                      key={booking.id}
                      style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
                    >
                      <span className="dash-table-cell-main">
                        <div style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--text-muted)" }}>
                          {generateInvoiceNumber(booking)}
                        </div>
                      </span>
                      <span className="dash-table-cell">
                        <div style={{ fontWeight: 500 }}>
                          {booking.service?.name || booking.serviceName || "Service"}
                        </div>
                        {booking.subService && (
                          <div className="muted" style={{ fontSize: "12px" }}>
                            {booking.subService}
                          </div>
                        )}
                      </span>
                      <span className="dash-table-cell">
                        <div>{new Date(booking.date).toLocaleDateString()}</div>
                        <div className="muted" style={{ fontSize: "12px" }}>
                          {new Date(booking.createdAt || booking.date).toLocaleDateString()}
                        </div>
                      </span>
                      <span className="dash-table-cell">
                        <div style={{ fontWeight: 600, fontSize: "15px" }}>
                          ${amount.toFixed(2)}
                        </div>
                        {booking.paymentMethod && (
                          <div className="muted" style={{ fontSize: "12px" }}>
                            {booking.paymentMethod === "card" ? "Card" : "Pay Later"}
                          </div>
                        )}
                      </span>
                      <span className="dash-table-cell">
                        {isPaid ? (
                          <Badge variant="success" icon={CheckCircle}>
                            Paid
                          </Badge>
                        ) : isCancelled ? (
                          <Badge variant="error">
                            Cancelled
                          </Badge>
                        ) : (
                          <Badge variant="warning" icon={AlertCircle}>
                            Pending
                          </Badge>
                        )}
                      </span>
                      <span className="dash-table-cell">
                        <button
                          className="btn-outline"
                          onClick={() => handleDownloadInvoice(booking)}
                          style={{
                            padding: "4px 12px",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <Download size={14} />
                          Invoice
                        </button>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
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

      await apiClient.put(
        "/api/profile",
        payload
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
          <div 
            className="dash-avatar-wrapper"
            onClick={() => {
              // Trigger file input when clicking on avatar
              const input = document.getElementById('profile-avatar-input');
              if (input) input.click();
            }}
            style={{ cursor: "pointer" }}
          >
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
            <label className="dash-upload-label" style={{ cursor: "pointer" }}>
              <Upload size={16} />
              <span>Upload new photo</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="profile-avatar-input"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    console.log("[Profile] File selected:", {
                      name: file.name,
                      type: file.type,
                      size: file.size,
                    });
                    onAvatarChange(file);
                  }
                  // Reset input so same file can be selected again
                  e.target.value = '';
                }}
              />
            </label>
            {form.profilePicUrl && form.profilePicUrl.startsWith('data:image') && (
              <p className="muted" style={{ fontSize: "12px", marginTop: "8px", color: "var(--success)" }}>
                ✓ Image ready to save. Click "Save changes" below.
              </p>
            )}
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
function StatCardLegacy({ label, value, icon: Icon, onClick, clickable = false, variant = "default" }) {
  const CardComponent = clickable ? 'button' : 'div';
  const cardProps = clickable ? {
    onClick,
    style: {
      background: 'none',
      border: 'none',
      padding: 0,
      width: '100%',
      cursor: 'pointer',
      textAlign: 'center',
    }
  } : {};

  return (
    <CardComponent 
      className={`dash-stat-card dash-stat-card-${variant} ${clickable ? 'dash-stat-card-clickable' : ''}`}
      {...cardProps}
    >
      <div className={`dash-stat-icon-wrap dash-stat-icon-${variant}`}>
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <div className="dash-stat-content">
        <p className={`stat-val stat-val-${variant}`}>{value ?? 0}</p>
        <p className="stat-label">{label}</p>
      </div>
      <div className={`dash-stat-accent dash-stat-accent-${variant}`}></div>
    </CardComponent>
  );
}

/* ================== QUOTES TAB ================== */
function DashboardQuotes({ quotes, onRefresh }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "contacted") {
      return <Badge variant="info">Contacted</Badge>;
    } else if (statusLower === "closed") {
      return <Badge variant="success">Closed</Badge>;
    }
    return <Badge variant="warning">Pending</Badge>;
  };

  return (
    <div className="dash-main-inner">
      <header className="dash-hero-row fade-in-up">
        <div>
          <h1 className="dash-title">Quote Requests</h1>
          <p className="muted dash-subtitle">
            View and track all your corporate quote requests
          </p>
        </div>
        <button
          className="btn"
          onClick={onRefresh}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </header>

      {quotes.length === 0 ? (
        <EmptyState
          icon={Quote}
          title="No quote requests yet"
          description="You haven't submitted any quote requests. Submit a corporate quote request to see it here!"
          action={
            <button 
              className="btn"
              onClick={() => window.location.href = "/request-quote"}
            >
              <Plus size={18} />
              Request a Quote
            </button>
          }
        />
      ) : (
        <div className="dash-two-col fade-in-up fade-in-delay-sm">
          <div className="dash-card" style={{ gridColumn: "1 / -1" }}>
            <div className="dash-card-header">
              <Quote size={20} className="dash-card-icon" />
              <h3 className="dash-card-title">Your Quote Requests</h3>
            </div>
            <div className="dash-content-grid">
              {quotes.map((quote, idx) => (
                <div 
                  key={quote.id} 
                  className="dash-content-card fade-in-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="dash-content-card-header">
                    <h4 className="dash-content-card-title">
                      {quote.serviceType}
                    </h4>
                    {getStatusBadge(quote.status)}
                  </div>

                  <div className="dash-content-card-body">
                    {quote.companyName && (
                      <div>
                        <span style={{ fontSize: "13px", color: "var(--text-soft)", fontWeight: 600 }}>Company: </span>
                        <span style={{ fontSize: "13px", color: "var(--text-main)" }}>{quote.companyName}</span>
                      </div>
                    )}

                    {quote.details && (
                      <p className="dash-content-card-description">
                        {quote.details}
                      </p>
                    )}
                  </div>

                  <div className="dash-content-card-meta">
                    <div className="dash-content-card-meta-item">
                      <Mail size={14} />
                      <span>{quote.email}</span>
                    </div>
                    {quote.phone && (
                      <div className="dash-content-card-meta-item">
                        <Phone size={14} />
                        <span>{quote.phone}</span>
                      </div>
                    )}
                    <div className="dash-content-card-meta-item">
                      <Calendar size={14} />
                      <span>{formatDate(quote.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================== CHORES TAB ================== */
function DashboardChores({ chores, onRefresh }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deletingId, setDeletingId] = useState(null);

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "completed" || statusLower === "done") {
      return <CheckCircle2 size={16} />;
    } else if (statusLower === "in_progress") {
      return <Clock size={16} />;
    } else if (statusLower === "pending") {
      return <Clock size={16} />;
    }
    return <X size={16} />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  return (
    <div className="dash-main-inner">
      <header className="dash-hero-row fade-in-up">
        <div>
          <h1 className="dash-title">My Chores</h1>
          <p className="muted dash-subtitle">
            View and manage all the chores you've posted
          </p>
        </div>
        <button
          className="btn"
          onClick={onRefresh}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </header>

      {chores.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No chores posted yet"
          description="You haven't posted any chores yet. Post your first chore to get started!"
          action={
            <button 
              className="btn"
              onClick={() => window.location.href = "/post-chore"}
            >
              <Plus size={18} />
              Post a Chore
            </button>
          }
        />
      ) : (
        <div className="dash-two-col fade-in-up fade-in-delay-sm">
          <div className="dash-card" style={{ gridColumn: "1 / -1" }}>
            <div className="dash-card-header">
              <ClipboardList size={20} className="dash-card-icon" />
              <h3 className="dash-card-title">Your Posted Chores</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px", padding: "20px" }}>
              {chores.map((chore, idx) => (
                <div 
                  key={chore.id} 
                  className="dash-stat-card fade-in-up"
                  style={{ animationDelay: `${idx * 0.05}s`, cursor: "pointer" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-main)", margin: 0 }}>
                      {chore.title}
                    </h4>
                    <Badge 
                      variant={
                        chore.status === "COMPLETED" ? "success" :
                        chore.status === "IN_PROGRESS" ? "info" :
                        chore.status === "CANCELLED" ? "error" :
                        "warning"
                      }
                    >
                      {getStatusIcon(chore.status)}
                      {chore.status?.replace("_", " ") || "PENDING"}
                    </Badge>
                  </div>

                  {editingId === chore.id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "12px" }}>
                      <input
                        type="text"
                        placeholder="Title"
                        value={editForm.title || ""}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        style={{
                          padding: "8px 12px",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: "6px",
                          fontSize: "14px",
                          background: "var(--bg)",
                          color: "var(--text-main)"
                        }}
                      />
                      <select
                        value={editForm.category || ""}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        style={{
                          padding: "8px 12px",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: "6px",
                          fontSize: "14px",
                          background: "var(--bg)",
                          color: "var(--text-main)"
                        }}
                      >
                        <option>Cleaning</option>
                        <option>Handyman</option>
                        <option>Furniture Assembly</option>
                        <option>Moving Help</option>
                        <option>Car Cleaning</option>
                        <option>Yard Work</option>
                        <option>Laundry</option>
                        <option>Snow Removal</option>
                        <option>Other</option>
                      </select>
                      <textarea
                        placeholder="Description"
                        value={editForm.description || ""}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows={3}
                        style={{
                          padding: "8px 12px",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: "6px",
                          fontSize: "14px",
                          background: "var(--bg)",
                          color: "var(--text-main)",
                          resize: "vertical"
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Budget"
                        value={editForm.budget || ""}
                        onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                        style={{
                          padding: "8px 12px",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: "6px",
                          fontSize: "14px",
                          background: "var(--bg)",
                          color: "var(--text-main)"
                        }}
                      />
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="btn"
                          style={{ padding: "6px 12px", fontSize: "13px", flex: 1 }}
                          onClick={async () => {
                            try {
                              await apiClient.put(`/api/chores/${chore.id}`, editForm);
                              toast.success("Chore updated successfully!");
                              setEditingId(null);
                              setEditForm({});
                              onRefresh();
                            } catch (err) {
                              toast.error(err.response?.data?.message || "Failed to update chore");
                            }
                          }}
                        >
                          <Save size={14} />
                          Save
                        </button>
                        <button
                          className="btn outline"
                          style={{ padding: "6px 12px", fontSize: "13px" }}
                          onClick={() => {
                            setEditingId(null);
                            setEditForm({});
                          }}
                        >
                          <X size={14} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {chore.description && (
                        <p style={{ fontSize: "14px", color: "var(--text-soft)", marginBottom: "12px", lineHeight: "1.5" }}>
                          {chore.description}
                        </p>
                      )}
                    </>
                  )}

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-soft)" }}>
                      <Tag size={14} />
                      <span>{chore.category || "Other"}</span>
                    </div>
                    {chore.budget != null && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-soft)" }}>
                        <DollarSign size={14} />
                        <span>${chore.budget}</span>
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-soft)" }}>
                      <Calendar size={14} />
                      <span>{formatDate(chore.createdAt)}</span>
                    </div>
                  </div>

                  {!editingId && (
                    <div style={{ display: "flex", gap: "8px", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--border-subtle)" }}>
                      <button
                        className="btn outline"
                        style={{ padding: "6px 12px", fontSize: "13px", flex: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(chore.id);
                          setEditForm({
                            title: chore.title,
                            category: chore.category,
                            description: chore.description,
                            budget: chore.budget,
                          });
                        }}
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button
                        className="btn outline"
                        style={{ padding: "6px 12px", fontSize: "13px", color: "var(--error)", borderColor: "var(--error)" }}
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (window.confirm("Are you sure you want to delete this chore?")) {
                            setDeletingId(chore.id);
                            try {
                              await apiClient.delete(`/api/chores/${chore.id}`);
                              toast.success("Chore deleted successfully!");
                              onRefresh();
                            } catch (err) {
                              toast.error(err.response?.data?.message || "Failed to delete chore");
                            } finally {
                              setDeletingId(null);
                            }
                          }
                        }}
                        disabled={deletingId === chore.id}
                      >
                        {deletingId === chore.id ? (
                          <RefreshCw size={14} className="spinning" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
