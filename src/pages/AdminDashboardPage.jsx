import React, { useEffect, useState, lazy, Suspense, useMemo, useRef } from "react";
import apiClient from "../lib/api.js";
import toast from "react-hot-toast";
import { PageWrapper } from "../components/page-wrapper.jsx";
import * as LucideIcons from "lucide-react";
import { Sparkles } from "lucide-react";
import "./admin-bookings-sheet.css";

// Lazy load BookingBlocksBuilder to prevent blocking app initialization
const BookingBlocksBuilder = lazy(() => import("../components/admin/BookingBlocksBuilder.jsx"));
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShoppingBag,
  DollarSign,
  Calendar,
  CheckCircle2,
  CheckCircle,
  Clock,
  UserPlus,
  UserCheck,
  X,
  Check,
  AlertCircle,
  Mail,
  MessageCircle,
  Settings,
  Package,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  TrendingUp,
  Home,
  Building2,
} from "lucide-react";

export function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [users, setUsers] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [workerApplications, setWorkerApplications] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [chores, setChores] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [assigningWorker, setAssigningWorker] = useState(null);

  const loadData = async () => {
    try {
      // Load in batches to avoid overwhelming the API
      const [statsRes, bookingsRes, workersRes] = await Promise.all([
        apiClient.get("/api/admin/stats").catch((err) => {
          console.error("[Admin] Failed to load stats:", err);
          toast.error("Failed to load dashboard stats");
          // Return default stats structure to prevent crashes
          return { 
            data: {
              users: { total: 0 },
              workers: { total: 0 },
              bookings: { total: 0, pending: 0, assigned: 0, completed: 0 },
            }
          };
        }),
        apiClient.get("/api/admin/bookings").catch((err) => {
          console.error("[Admin] Failed to load bookings:", err);
          return { data: { bookings: [] } };
        }),
        apiClient.get("/api/admin/workers").catch((err) => {
          console.error("[Admin] Failed to load workers:", err);
          return { data: [] };
        }),
      ]);

      setStats(statsRes.data);
      setBookings(bookingsRes.data.bookings || []);
      setWorkers(workersRes.data || []);

      // Load remaining data in separate batch
      const [usersRes, contactRes, applicationsRes] = await Promise.all([
        apiClient.get("/api/admin/users?pageSize=100").catch((err) => {
          console.error("[Admin] Failed to load users:", err);
          return { data: { users: [] } };
        }),
        apiClient.get("/api/admin/contact").catch(() => ({ data: { messages: [] } })),
        apiClient.get("/api/admin/worker-applications").catch(() => ({ data: [] })),
      ]);

      console.log("[Admin] Users response:", usersRes.data);
      // Handle response format: {users: [...]}
      if (usersRes.data?.users) {
        setUsers(usersRes.data.users);
      } else if (Array.isArray(usersRes.data)) {
        setUsers(usersRes.data);
      } else {
        setUsers([]);
      }
      setContactMessages(contactRes.data.messages || []);
      setWorkerApplications(Array.isArray(applicationsRes.data) ? applicationsRes.data : []);
    } catch (err) {
      console.error("Admin dashboard error:", err);
      toast.error(err.response?.data?.message || "Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Load quotes, chores, orders when their tabs are activated
  useEffect(() => {
    const loadTabData = async () => {
      if (activeTab === "quotes") {
        try {
          const res = await apiClient.get("/api/admin/quotes");
          console.log("[Admin] Quotes loaded:", res.data);
          setQuotes(res.data.quotes || []);
        } catch (err) {
          console.error("[Admin] Failed to load quotes:", err);
          toast.error(err.response?.data?.message || "Failed to load quotes");
        }
      }
      if (activeTab === "chores") {
        try {
          const res = await apiClient.get("/api/admin/chores");
          console.log("[Admin] Chores loaded:", res.data);
          setChores(res.data.chores || []);
        } catch (err) {
          console.error("[Admin] Failed to load chores:", err);
          toast.error(err.response?.data?.message || "Failed to load chores");
        }
      }
      if (activeTab === "orders") {
        try {
          const res = await apiClient.get("/api/admin/orders");
          console.log("[Admin] Orders loaded:", res.data);
          setOrders(res.data.orders || []);
        } catch (err) {
          console.error("[Admin] Failed to load orders:", err);
          toast.error(err.response?.data?.message || "Failed to load orders");
        }
      }
    };

    loadTabData();
  }, [activeTab, loading]);

  const assignWorker = async (bookingId, workerId) => {
    setAssigningWorker(bookingId);
    try {
      await apiClient.patch(`/api/admin/bookings/${bookingId}/assign`, {
        workerId,
      });
      toast.success("Worker assigned successfully!");
      loadData();
    } catch (err) {
      console.error("Assign worker error:", err);
      toast.error(err.response?.data?.message || "Failed to assign worker");
    } finally {
      setAssigningWorker(null);
    }
  };

  const unassignWorker = async (bookingId) => {
    try {
      await apiClient.patch(`/api/admin/bookings/${bookingId}/unassign`);
      toast.success("Worker unassigned successfully!");
      loadData();
    } catch (err) {
      console.error("Unassign worker error:", err);
      toast.error(err.response?.data?.message || "Failed to unassign worker");
    }
  };

  if (loading || !stats) {
    return (
      <PageWrapper>
        <section className="section" style={{ textAlign: "center" }}>
          <h2>Loading Admin Dashboard...</h2>
        </section>
      </PageWrapper>
    );
  }

  const unassignedBookings = bookings.filter(
    (b) => !b.workerId && (b.status === "PENDING" || b.status === "CONFIRMED")
  );

  return (
    <PageWrapper>
      <section className="section dash-shell">
        <div className="dash-layout">
          {/* Sidebar */}
          <aside className="dash-sidebar">
            <div className="dash-profile">
              <div className="dash-avatar" style={{ background: "#6366f1" }}>
                <Users size={24} />
              </div>
              <div>
                <p className="dash-name">Admin</p>
                <p className="dash-email">Administrator</p>
              </div>
            </div>

            <nav className="dash-nav">
              <button
                className={`dash-nav-item ${activeTab === "overview" ? "is-active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <LayoutDashboard size={20} />
                <span>Overview</span>
              </button>
              <button
                className={`dash-nav-item ${activeTab === "bookings" ? "is-active" : ""}`}
                onClick={() => setActiveTab("bookings")}
              >
                <Calendar size={20} />
                <span>Bookings</span>
              </button>
              <button
                className={`dash-nav-item ${activeTab === "workers" ? "is-active" : ""}`}
                onClick={() => setActiveTab("workers")}
              >
                <Briefcase size={20} />
                <span>Workers</span>
              </button>
              <button
                className={`dash-nav-item ${activeTab === "services" ? "is-active" : ""}`}
                onClick={() => setActiveTab("services")}
              >
                <Package size={20} />
                <span>Services</span>
              </button>
              <button
                className={`dash-nav-item ${activeTab === "shop" ? "is-active" : ""}`}
                onClick={() => setActiveTab("shop")}
              >
                <ShoppingBag size={20} />
                <span>Shop</span>
              </button>
              <button
                className={`dash-nav-item ${activeTab === "users" ? "is-active" : ""}`}
                onClick={() => setActiveTab("users")}
              >
                <Users size={20} />
                <span>Users</span>
              </button>
              <button
                className={`dash-nav-item ${activeTab === "analytics" ? "is-active" : ""}`}
                onClick={() => setActiveTab("analytics")}
              >
                <BarChart3 size={20} />
                <span>Analytics</span>
              </button>
              <button
                className={`dash-nav-item ${activeTab === "contact" ? "is-active" : ""}`}
                onClick={() => setActiveTab("contact")}
              >
                <MessageCircle size={20} />
                <span>Contact Messages</span>
              </button>
              <button
                className={`dash-nav-item ${activeTab === "worker-applications" ? "is-active" : ""}`}
                onClick={() => setActiveTab("worker-applications")}
              >
                <UserPlus size={20} />
                <span>Worker Applications</span>
                {workerApplications.filter((app) => app.status === "PENDING").length > 0 && (
                  <span style={{
                    marginLeft: "8px",
                    background: "#dc2626",
                    color: "white",
                    borderRadius: "10px",
                    padding: "2px 6px",
                    fontSize: "11px",
                    fontWeight: 600
                  }}>
                    {workerApplications.filter((app) => app.status === "PENDING").length}
                  </span>
                )}
              </button>
              <button
                className={`dash-nav-item ${activeTab === "quotes" ? "is-active" : ""}`}
                onClick={() => setActiveTab("quotes")}
              >
                <DollarSign size={20} />
                <span>Quotes</span>
              </button>
              <button
                className={`dash-nav-item ${activeTab === "chores" ? "is-active" : ""}`}
                onClick={() => setActiveTab("chores")}
              >
                <Briefcase size={20} />
                <span>Chores</span>
              </button>
              <button
                className={`dash-nav-item ${activeTab === "orders" ? "is-active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                <ShoppingBag size={20} />
                <span>Orders</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="dash-main">
            {activeTab === "overview" && (
              <div className="dash-main-inner">
                <header className="dash-hero-row fade-in-up">
                  <div>
                    <h1 className="dash-title">Admin Dashboard</h1>
                    <p className="muted dash-subtitle">
                      Manage users, workers, and bookings
                    </p>
                  </div>
                </header>

                <div className="dash-stat-grid fade-in-up fade-in-delay-sm">
                  <StatCard
                    label="Total Users"
                    value={stats.users?.total || 0}
                    icon={Users}
                  />
                  <StatCard
                    label="Workers"
                    value={stats.workers?.total || 0}
                    icon={Briefcase}
                  />
                  <StatCard
                    label="Total Bookings"
                    value={stats.bookings?.total || 0}
                    icon={Calendar}
                  />
                  <StatCard
                    label="Pending Bookings"
                    value={stats.bookings?.pending || 0}
                    icon={Clock}
                  />
                  <StatCard
                    label="Assigned"
                    value={stats.bookings?.assigned || 0}
                    icon={UserCheck}
                  />
                  <StatCard
                    label="Completed"
                    value={stats.bookings?.completed || 0}
                    icon={CheckCircle2}
                  />
            </div>

                <div className="dash-card fade-in-up fade-in-delay-md" style={{ marginTop: "24px" }}>
                  <h3 className="dash-card-title">Unassigned Bookings</h3>
                  {unassignedBookings.length === 0 ? (
                    <p className="muted">No unassigned bookings</p>
                  ) : (
                    <div className="dash-list">
                      {unassignedBookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="dash-list-item">
                          <div className="dash-list-main">
                            <span className="dash-list-title">
                              {booking.serviceName} - {booking.addressLine}
                            </span>
                            <span className="dash-list-meta">
                              {new Date(booking.date).toLocaleDateString()}
                            </span>
                          </div>
                          <button
                            className="btn btn-sm"
                            onClick={() => setActiveTab("bookings")}
                          >
                            Assign Worker
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
            </div>
            )}

            {activeTab === "bookings" && (
              <BookingsTab
                bookings={bookings}
                workers={workers}
                onAssign={assignWorker}
                onUnassign={unassignWorker}
                assigningWorker={assigningWorker}
              />
        )}

            {activeTab === "workers" && <WorkersTab workers={workers} onRefresh={loadData} />}

            {activeTab === "services" && <ServicesTab />}

            {activeTab === "shop" && <ShopTab />}

            {activeTab === "users" && <UsersTab users={users} onRefresh={loadData} />}

            {activeTab === "analytics" && <AnalyticsTab />}

            {activeTab === "worker-applications" && (
              <WorkerApplicationsTab
                applications={workerApplications}
                onRefresh={loadData}
              />
            )}

            {activeTab === "contact" && (
              <ContactMessagesTab 
                messages={contactMessages} 
                onRefresh={loadData}
              />
            )}

            {activeTab === "quotes" && (
              <QuotesTab
                quotes={quotes}
                onRefresh={async () => {
                  try {
                    const res = await apiClient.get("/api/admin/quotes");
                    setQuotes(res.data.quotes || []);
                  } catch (err) {
                    console.error("Failed to refresh quotes:", err);
                  }
                }}
              />
            )}

            {activeTab === "chores" && (
              <ChoresTab
                chores={chores}
                onRefresh={async () => {
                  try {
                    const res = await apiClient.get("/api/admin/chores");
                    setChores(res.data.chores || []);
                  } catch (err) {
                    console.error("Failed to refresh chores:", err);
                  }
                }}
              />
            )}

            {activeTab === "orders" && (
              <OrdersTab
                orders={orders}
                onRefresh={async () => {
                  try {
                    const res = await apiClient.get("/api/admin/orders");
                    setOrders(res.data.orders || []);
                  } catch (err) {
                    console.error("Failed to refresh orders:", err);
                  }
                }}
              />
            )}
          </main>
        </div>
      </section>
    </PageWrapper>
  );
}

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

function BookingsTab({ bookings, workers, onAssign, onUnassign, assigningWorker, onRefresh }) {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState("");

  const handleAssign = () => {
    if (!selectedWorker) {
      toast.error("Please select a worker");
      return;
    }
    onAssign(selectedBooking.id, selectedWorker);
    setSelectedBooking(null);
    setSelectedWorker("");
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  const formatAddress = (booking) => {
    const parts = [
      booking.addressLine,
      booking.city,
      booking.province,
      booking.postal
    ].filter(Boolean);
    return parts.join(", ") || "—";
  };

  const getCustomerInfo = (booking) => {
    if (booking.customer) {
      return {
        name: booking.customer.fullName || booking.customer.email || "N/A",
        email: booking.customer.email || "—",
        phone: booking.customer.phone || "—"
      };
    }
    return {
      name: booking.guestName || "Guest",
      email: booking.guestEmail || "—",
      phone: booking.guestPhone || "—"
    };
  };

  return (
    <div className="dash-main-inner fade-in-up">
      <header className="dash-page-header">
        <div>
          <h2 className="dash-title">All Bookings</h2>
          <p className="muted dash-subtitle">
            Manage and assign bookings to workers ({bookings.length} total)
          </p>
        </div>
      </header>

      <div className="bookings-sheet-container">
        <div className="bookings-sheet-wrapper">
          <table className="bookings-sheet-table">
            <thead className="bookings-sheet-header">
              <tr>
                <th className="bookings-sheet-col-id">ID</th>
                <th className="bookings-sheet-col-date">Date</th>
                <th className="bookings-sheet-col-time">Time</th>
                <th className="bookings-sheet-col-customer">Customer</th>
                <th className="bookings-sheet-col-email">Email</th>
                <th className="bookings-sheet-col-phone">Phone</th>
                <th className="bookings-sheet-col-service">Service</th>
                <th className="bookings-sheet-col-subservice">Sub-Service</th>
                <th className="bookings-sheet-col-frequency">Frequency</th>
                <th className="bookings-sheet-col-address">Address</th>
                <th className="bookings-sheet-col-city">City</th>
                <th className="bookings-sheet-col-province">Province</th>
                <th className="bookings-sheet-col-postal">Postal</th>
                <th className="bookings-sheet-col-worker">Worker</th>
                <th className="bookings-sheet-col-status">Status</th>
                <th className="bookings-sheet-col-amount">Amount</th>
                <th className="bookings-sheet-col-payment">Payment</th>
                <th className="bookings-sheet-col-paystatus">Pay Status</th>
                <th className="bookings-sheet-col-notes">Notes</th>
                <th className="bookings-sheet-col-actions">Actions</th>
              </tr>
            </thead>
            <tbody className="bookings-sheet-body">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="20" style={{ textAlign: "center", padding: "48px", color: "var(--text-secondary)" }}>
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const customer = getCustomerInfo(booking);
                  return (
                    <tr key={booking.id} className="bookings-sheet-row">
                      <td className="bookings-sheet-cell bookings-sheet-col-id" title={booking.id}>
                        {booking.id.slice(0, 8)}...
                      </td>
                      <td className="bookings-sheet-cell bookings-sheet-col-date">
                        {formatDate(booking.date)}
                      </td>
                      <td className="bookings-sheet-cell bookings-sheet-col-time">
                        {booking.timeSlot || "—"}
                      </td>
                      <td className="bookings-sheet-cell bookings-sheet-col-customer">
                        {customer.name}
                      </td>
                      <td className="bookings-sheet-cell bookings-sheet-col-email" title={customer.email}>
                        {customer.email.length > 20 ? customer.email.slice(0, 20) + "..." : customer.email}
                      </td>
                      <td className="bookings-sheet-cell bookings-sheet-col-phone">
                        {customer.phone}
                      </td>
                      <td className="bookings-sheet-cell bookings-sheet-col-service">
                        {booking.serviceName || "—"}
                      </td>
                      <td className="bookings-sheet-cell bookings-sheet-col-subservice">
                        {booking.subService || "—"}
                      </td>
                      <td className="bookings-sheet-cell bookings-sheet-col-frequency">
                        {booking.frequency || "—"}
                      </td>
                      <td className="bookings-sheet-cell bookings-sheet-col-address" title={formatAddress(booking)}>
                        {booking.addressLine || "—"}
                      </td>
                      <td className="bookings-sheet-cell bookings-sheet-col-city">
                        {booking.city || "—"}
                      </td>
                      <td className="bookings-sheet-cell bookings-sheet-col-province">
                        {booking.province || "—"}
                      </td>
                      <td className="bookings-sheet-cell bookings-sheet-col-postal">
                        {booking.postal || "—"}
                      </td>
                      <td className="bookings-sheet-cell bookings-sheet-col-worker">
                        {booking.assignedWorker || booking.worker ? (
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <UserCheck size={12} />
                            {booking.assignedWorker?.name || booking.worker?.name || booking.assignedWorker?.email || booking.worker?.email || "N/A"}
                </span>
                        ) : (
                          <span className="muted" style={{ fontSize: "12px" }}>Unassigned</span>
                        )}
                      </td>
                      <td className="bookings-sheet-cell bookings-sheet-col-status">
                        <span className={`bookings-status-badge bookings-status-${(booking.status?.toLowerCase() || "pending").replace(/_/g, "-")}`}>
                          {booking.status || "PENDING"}
                </span>
                      </td>
                      <td className="bookings-sheet-cell bookings-sheet-col-amount">
                        {booking.totalAmount ? `$${booking.totalAmount.toFixed(2)}` : "—"}
                      </td>
                      <td className="bookings-sheet-cell bookings-sheet-col-payment">
                        {booking.paymentMethod ? booking.paymentMethod.replace("_", " ").toUpperCase() : "—"}
                      </td>
                      <td className="bookings-sheet-cell bookings-sheet-col-paystatus">
                        <span className={`bookings-payment-badge bookings-payment-${booking.paymentStatus || "pending"}`}>
                          {booking.paymentStatus || "PENDING"}
                </span>
                      </td>
                      <td className="bookings-sheet-cell bookings-sheet-col-notes" title={booking.notes || ""}>
                        {booking.notes ? (booking.notes.length > 30 ? booking.notes.slice(0, 30) + "..." : booking.notes) : "—"}
                      </td>
                      <td className="bookings-sheet-cell bookings-sheet-col-actions">
                        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                          {booking.assignedWorker || booking.worker ? (
                    <button
                              className="bookings-action-btn"
                      onClick={() => onUnassign(booking.id)}
                      title="Unassign worker"
                              style={{ color: "var(--error)" }}
                    >
                      <X size={14} />
                    </button>
                  ) : (
                    <button
                              className="bookings-action-btn bookings-action-btn-primary"
                      onClick={() => setSelectedBooking(booking)}
                      disabled={assigningWorker === booking.id}
                              title="Assign worker"
                            >
                              {assigningWorker === booking.id ? (
                                <Clock size={14} />
                              ) : (
                                <UserPlus size={14} />
                              )}
                    </button>
                  )}
              </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Worker Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Assign Worker</h3>
              <button
                className="modal-close"
                onClick={() => setSelectedBooking(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p className="muted">
                Assign a worker to: <strong>{selectedBooking.serviceName}</strong>
              </p>
              <div style={{ marginTop: "16px" }}>
                <label className="dash-label">Select Worker</label>
                <select
                  className="dash-input"
                  value={selectedWorker}
                  onChange={(e) => setSelectedWorker(e.target.value)}
                >
                  <option value="">Choose a worker...</option>
                  {workers.map((worker) => (
                    <option key={worker.id} value={worker.id}>
                      {worker.name || worker.email} ({worker._count?.assignedBookings || 0} tasks)
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn outline"
                onClick={() => setSelectedBooking(null)}
              >
                Cancel
              </button>
              <button
                className="btn"
                onClick={handleAssign}
                disabled={!selectedWorker || assigningWorker === selectedBooking.id}
              >
                Assign Worker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WorkersTab({ workers }) {
  return (
    <div className="dash-main-inner fade-in-up">
      <header className="dash-page-header">
        <div>
          <h2 className="dash-title">Workers</h2>
          <p className="muted dash-subtitle">
            View all workers and their assignments
          </p>
        </div>
      </header>

      <div className="dash-card-grid fade-in-up fade-in-delay-sm">
        {workers.length === 0 ? (
          <div className="dash-card">
            <div className="dash-empty-state">
              <Briefcase size={48} className="dash-empty-icon" />
              <p className="dash-empty-text">No workers found</p>
              <p className="dash-empty-subtext muted">
                Workers will appear here once they are registered with the WORKER role
              </p>
            </div>
          </div>
        ) : (
          workers.map((worker) => (
            <div className="dash-card" key={worker.id}>
              <div className="dash-card-header">
                <UserCheck size={20} className="dash-card-icon" />
                <h3 className="dash-card-title">{worker.name || "No Name"}</h3>
              </div>
              <div className="dash-card-content">
                <div className="dash-info-row">
                  <span className="dash-info-label">Email</span>
                  <span className="dash-info-value">{worker.email}</span>
                </div>
                <div className="dash-info-row">
                  <span className="dash-info-label">Phone</span>
                  <span className="dash-info-value">{worker.phone || "—"}</span>
                </div>
                <div className="dash-info-row">
                  <span className="dash-info-label">Active Bookings</span>
                  <span className="dash-info-value">
                    {worker.activeBookings || 0}
                  </span>
                </div>
                <div className="dash-info-row">
                  <span className="dash-info-label">Completed</span>
                  <span className="dash-info-value">
                    {worker.completedBookings || 0}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ServicesTab() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceTypeFilter, setServiceTypeFilter] = useState("RESIDENTIAL"); // Filter by type
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [creating, setCreating] = useState(false);
  const formRef = useRef(null); // Ref for auto-scrolling to form
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    type: "RESIDENTIAL",
    description: "",
    imageUrl: "",
    isTrending: false,
    basePrice: "",
    isActive: true,
    options: [],
    bookingBlocks: [],
  });
  const [newBullet, setNewBullet] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  // Auto-scroll to form when it opens
  useEffect(() => {
    if (showCreateForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showCreateForm]);

  const toggleDescription = (serviceId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Check file size (max 10MB = 10000 KB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Image size must be less than 10MB (${(file.size / (1024 * 1024)).toFixed(2)}MB selected). Please compress your image and try again.`);
      return;
    }

    setUploadingImage(true);
    try {
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setFormData({ ...formData, imageUrl: base64String });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const loadServices = async () => {
    try {
      const res = await apiClient.get("/api/admin/services");
      setServices(res.data);
    } catch (err) {
      console.error("Load services error:", err);
      toast.error(err.response?.data?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      type: serviceTypeFilter, // Use current filter as default
      description: "",
      imageUrl: "",
      iconName: "",
      isTrending: false,
      basePrice: "",
      isActive: true,
      options: [],
      bookingBlocks: [],
    });
    setNewBullet("");
    setImagePreview(null);
    setShowCreateForm(false);
    setEditingService(null);
  };

  // Filter services by type
  const residentialServices = services.filter(s => s.type === "RESIDENTIAL");
  const corporateServices = services.filter(s => s.type === "CORPORATE");

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name || "",
      slug: service.slug || "",
      type: service.type || "RESIDENTIAL",
      description: service.description || "",
      imageUrl: service.imageUrl || "",
      iconName: service.iconName || "",
      isTrending: service.isTrending || false,
      basePrice: service.basePrice || "",
      isActive: service.isActive !== undefined ? service.isActive : true,
      options: service.options?.map((opt) => opt.name) || [],
      bookingBlocks: service.bookingBlocks || [],
    });
    setImagePreview(service.imageUrl || null);
    setServiceTypeFilter(service.type || "RESIDENTIAL"); // Switch to the service's type
    setShowCreateForm(true);
    // Scroll to form after state updates
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const addBullet = () => {
    if (newBullet.trim()) {
      setFormData({
        ...formData,
        options: [...formData.options, newBullet.trim()],
      });
      setNewBullet("");
    }
  };

  const removeBullet = (index) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index),
    });
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = {
        ...formData,
        basePrice: formData.basePrice ? parseFloat(formData.basePrice) : null,
        options: formData.options.map((opt) => ({ name: opt })),
        bookingBlocks: formData.bookingBlocks && formData.bookingBlocks.length > 0 
          ? formData.bookingBlocks 
          : null,
      };

      if (editingService) {
        await apiClient.patch(`/api/admin/services/${editingService.id}`, payload);
        toast.success("Service updated successfully!");
      } else {
        await apiClient.post("/api/admin/services", payload);
        toast.success("Service created successfully!");
      }
      resetForm();
      loadServices();
    } catch (err) {
      console.error("Create/Update service error:", err);
      toast.error(err.response?.data?.message || "Failed to save service");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (service) => {
    if (!confirm(`Are you sure you want to delete "${service.name}"?`)) return;
    try {
      await apiClient.delete(`/api/admin/services/${service.id}`);
      toast.success("Service deleted successfully!");
      loadServices();
    } catch (err) {
      console.error("Delete service error:", err);
      toast.error(err.response?.data?.message || "Failed to delete service");
    }
  };

  const handleToggleActive = async (service) => {
    try {
      await apiClient.patch(`/api/admin/services/${service.id}`, {
        isActive: !service.isActive,
      });
      toast.success(`Service ${!service.isActive ? "activated" : "deactivated"}`);
      loadServices();
    } catch (err) {
      console.error("Toggle service error:", err);
      toast.error(err.response?.data?.message || "Failed to update service");
    }
  };

  if (loading) {
    return (
      <div className="dash-main-inner fade-in-up">
        <p>Loading services...</p>
      </div>
    );
  }

  return (
    <div className="dash-main-inner fade-in-up">
      <header className="dash-page-header">
        <div>
          <h2 className="dash-title">Services</h2>
          <p className="muted dash-subtitle">
            Manage services and pricing
          </p>
        </div>
        <button
          className="btn"
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            if (!showCreateForm) {
              setFormData(prev => ({ ...prev, type: serviceTypeFilter }));
              setTimeout(() => {
                if (formRef.current) {
                  formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }, 100);
            }
          }}
        >
          <Plus size={18} />
          {showCreateForm ? "Cancel" : "Create Service"}
        </button>
      </header>

      {/* Service Type Tabs */}
      <div style={{
        display: "flex",
        gap: "12px",
        marginBottom: "24px",
        borderBottom: "2px solid #e5e7eb",
        paddingBottom: "0",
      }}>
        <button
          onClick={() => {
            setServiceTypeFilter("RESIDENTIAL");
            setShowCreateForm(false);
          }}
          style={{
            padding: "12px 24px",
            background: serviceTypeFilter === "RESIDENTIAL" ? "#0b5c28" : "transparent",
            color: serviceTypeFilter === "RESIDENTIAL" ? "white" : "#6b7280",
            border: "none",
            borderBottom: serviceTypeFilter === "RESIDENTIAL" ? "3px solid #0b5c28" : "3px solid transparent",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "14px",
            transition: "all 0.2s ease",
            marginBottom: "-2px",
          }}
        >
          Residential Services ({residentialServices.length})
        </button>
        <button
          onClick={() => {
            setServiceTypeFilter("CORPORATE");
            setShowCreateForm(false);
          }}
          style={{
            padding: "12px 24px",
            background: serviceTypeFilter === "CORPORATE" ? "#0b5c28" : "transparent",
            color: serviceTypeFilter === "CORPORATE" ? "white" : "#6b7280",
            border: "none",
            borderBottom: serviceTypeFilter === "CORPORATE" ? "3px solid #0b5c28" : "3px solid transparent",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "14px",
            transition: "all 0.2s ease",
            marginBottom: "-2px",
          }}
        >
          Corporate Services ({corporateServices.length})
        </button>
      </div>

      {showCreateForm && (
        <div ref={formRef} className="dash-card fade-in-up fade-in-delay-sm" style={{ marginBottom: "24px" }}>
          <h3 className="dash-card-title">{editingService ? "Edit Service" : "Create New Service"}</h3>
          <form onSubmit={handleCreateService}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label className="dash-label">Service Name *</label>
                <input
                  type="text"
                  className="dash-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Cleaning"
                />
              </div>
              <div>
                <label className="dash-label">Slug * (e.g., house-cleaning)</label>
                <input
                  type="text"
                  className="dash-input"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                  required
                  pattern="[a-z0-9-]+"
                  disabled={!!editingService}
                />
              </div>
              <div>
                <label className="dash-label">Type *</label>
                <select
                  className="dash-input"
                  value={formData.type}
                  onChange={(e) => {
                    setFormData({ ...formData, type: e.target.value });
                    // Switch to the selected type's tab when creating new service
                    if (!editingService) {
                      setServiceTypeFilter(e.target.value);
                    }
                  }}
                  required
                >
                  <option value="RESIDENTIAL">Residential</option>
                  <option value="CORPORATE">Corporate</option>
                </select>
              </div>
              <div>
                <label className="dash-label">Icon Name (Lucide)</label>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <input
                  type="text"
                  className="dash-input"
                  value={formData.iconName || ""}
                  onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                  placeholder="e.g., Brush, Home, Truck"
                    style={{ flex: 1 }}
                  />
                  {formData.iconName && (() => {
                    // Get icon component dynamically - try multiple variations
                    const normalizedName = formData.iconName.charAt(0).toUpperCase() + formData.iconName.slice(1);
                    const iconNameWithSuffix = normalizedName + 'Icon';
                    
                    let IconComponent = null;
                    
                    if (normalizedName in LucideIcons) {
                      IconComponent = LucideIcons[normalizedName];
                    } else if (iconNameWithSuffix in LucideIcons) {
                      IconComponent = LucideIcons[iconNameWithSuffix];
                    } else if (formData.iconName in LucideIcons) {
                      IconComponent = LucideIcons[formData.iconName];
                    }
                    
                    const isInvalid = !IconComponent;
                    
                    if (isInvalid) {
                      IconComponent = Sparkles;
                    }
                    
                    return (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "48px",
                        height: "48px",
                        borderRadius: "8px",
                        background: isInvalid ? "#fee2e2" : "#eef9f5",
                        border: `2px solid ${isInvalid ? "#dc2626" : "#0b5c28"}`,
                        flexShrink: 0,
                      }}>
                        <IconComponent size={24} color={isInvalid ? "#dc2626" : "#0b5c28"} />
                      </div>
                    );
                  })()}
                </div>
                <p className="muted" style={{ fontSize: "12px", marginTop: "4px" }}>
                  Enter any Lucide icon name (e.g., Car, Brush, Home, Truck, Sparkles, Settings, Heart, Star, etc.)
                  {formData.iconName && !LucideIcons[formData.iconName.charAt(0).toUpperCase() + formData.iconName.slice(1)] && !LucideIcons[formData.iconName.charAt(0).toUpperCase() + formData.iconName.slice(1) + 'Icon'] && (
                    <span style={{ color: "#dc2626", display: "block", marginTop: "4px" }}>
                      ⚠️ Icon "{formData.iconName}" not found. Check the icon name spelling. Visit lucide.dev/icons to find valid names.
                    </span>
                  )}
                </p>
              </div>
              <div>
                <label className="dash-label">Base Price ($)</label>
                <input
                  type="number"
                  className="dash-input"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  step="0.01"
                  min="0"
                  placeholder="Optional"
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="dash-label">Service Image</label>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <label className="btn btn-sm outline" style={{ cursor: "pointer", display: "inline-block" }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                        disabled={uploadingImage}
                      />
                      {uploadingImage ? "Uploading..." : "Upload from Computer"}
                    </label>
                    <input
                      type="url"
                      className="dash-input"
                      value={formData.imageUrl?.startsWith("data:") ? "" : formData.imageUrl}
                      onChange={(e) => {
                        setFormData({ ...formData, imageUrl: e.target.value });
                        setImagePreview(e.target.value || null);
                      }}
                      placeholder="Or enter image URL"
                      style={{ marginTop: "8px" }}
                    />
                  </div>
                  {(imagePreview || formData.imageUrl) && (
                    <img
                      src={imagePreview || formData.imageUrl}
                      alt="Preview"
                      style={{
                        width: "200px",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid var(--border-subtle)",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                </div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="dash-label">Description</label>
                <textarea
                  className="dash-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Service description that appears on the services page"
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="dash-label">
                  Sub-services (Bullet Points)
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <input
                      type="text"
                      className="dash-input"
                      value={newBullet}
                      onChange={(e) => setNewBullet(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addBullet();
                        }
                      }}
                      placeholder="e.g., Home & apartment cleaning"
                    />
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={addBullet}
                    >
                      Add
                    </button>
                  </div>
                  {formData.options.length > 0 && (
                    <ul style={{ marginTop: "12px", paddingLeft: "20px" }}>
                      {formData.options.map((opt, idx) => (
                        <li key={idx} style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>{opt}</span>
                          <button
                            type="button"
                            className="btn-outline btn-sm"
                            onClick={() => removeBullet(idx)}
                            style={{ marginLeft: "12px" }}
                          >
                            <X size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </label>
              </div>
              <div>
                <label className="dash-label">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                  />
                  Mark as Trending
                </label>
              </div>
              <div>
                <label className="dash-label">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  Active
                </label>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                {showCreateForm && (
                  <Suspense fallback={<div style={{ padding: "20px", textAlign: "center" }}>Loading block builder...</div>}>
                    <BookingBlocksBuilder
                      blocks={formData.bookingBlocks || []}
                      onChange={(blocks) => setFormData({ ...formData, bookingBlocks: blocks })}
                      subServices={formData.options || []}
                    />
                  </Suspense>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button type="submit" className="btn" disabled={creating}>
                {creating ? "Saving..." : editingService ? "Update Service" : "Create Service"}
              </button>
              <button type="button" className="btn-outline" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Residential Services Section */}
      {serviceTypeFilter === "RESIDENTIAL" && (
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "16px",
            color: "#1a1a1a",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <Home size={18} />
            Residential Services
          </h3>
      <div className="dash-grid">
            {residentialServices.length === 0 ? (
          <div className="dash-empty-state">
            <Package size={48} className="dash-empty-icon" />
                <p className="dash-empty-text">No residential services yet</p>
                <p className="muted">Create a residential service to get started</p>
          </div>
        ) : (
              residentialServices.map((service) => (
            <div className="dash-card" key={service.id}>
              <div className="dash-card-header">
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    style={{
                      width: "48px",
                      height: "48px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginRight: "12px",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <Package size={20} className="dash-card-icon" />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h3 className="dash-card-title">{service.name}</h3>
                    {service.isTrending && (
                      <span style={{
                        background: "var(--primary)",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}>
                        <TrendingUp size={12} />
                        Trending
                      </span>
                    )}
                  </div>
                  <p className="muted" style={{ fontSize: "13px", marginTop: "4px" }}>
                    {service.slug} • {service.type}
                  </p>
                </div>
                <span className={`dash-status-pill dash-status-pill-${service.isActive ? "active" : "inactive"}`}>
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="dash-card-content">
                {service.description && (
                  <div style={{ marginBottom: "12px" }}>
                    <p className="muted" style={{ 
                      display: "-webkit-box",
                      WebkitLineClamp: expandedDescriptions[service.id] ? "none" : 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: "1.5",
                    }}>
                      {service.description}
                    </p>
                    {service.description.length > 150 && (
                      <button
                        type="button"
                        onClick={() => toggleDescription(service.id)}
                        className="btn-outline btn-sm"
                        style={{ marginTop: "8px", fontSize: "12px" }}
                      >
                        {expandedDescriptions[service.id] ? "Read less" : "Read more..."}
                      </button>
                    )}
                  </div>
                )}
                {service.options && service.options.length > 0 && (
                  <div style={{ marginBottom: "12px" }}>
                    <span className="dash-info-label" style={{ display: "block", marginBottom: "6px" }}>Sub-services:</span>
                    <ul style={{ paddingLeft: "20px", fontSize: "13px", color: "var(--text-secondary)" }}>
                      {service.options.slice(0, 3).map((opt, idx) => (
                        <li key={idx}>{opt.name || opt}</li>
                      ))}
                      {service.options.length > 3 && (
                        <li style={{ fontStyle: "italic" }}>+{service.options.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
                <div className="dash-info-row">
                  <span className="dash-info-label">Pricing</span>
                  <span className="dash-info-value">
                    {service.basePrice ? `Starting from $${service.basePrice.toFixed(2)}` : "Contact for pricing"}
                  </span>
                </div>
                <div className="dash-info-row">
                  <span className="dash-info-label">Sub-services</span>
                  <span className="dash-info-value">{service.options?.length || 0}</span>
                </div>
                <div className="dash-info-row">
                  <span className="dash-info-label">Bookings</span>
                  <span className="dash-info-value">{service._count?.bookings || 0}</span>
                </div>
                <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    className="btn btn-sm outline"
                    onClick={() => handleEdit(service)}
                  >
                    <Edit size={14} style={{ marginRight: "4px" }} />
                    Edit
                  </button>
                  <button
                    className="btn btn-sm outline"
                    onClick={() => handleToggleActive(service)}
                  >
                    {service.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    className="btn btn-sm outline"
                    onClick={() => handleDelete(service)}
                    style={{ color: "var(--error)", borderColor: "var(--error)" }}
                  >
                    <Trash2 size={14} style={{ marginRight: "4px" }} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
        </div>
      )}

      {/* Corporate Services Section */}
      {serviceTypeFilter === "CORPORATE" && (
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "16px",
            color: "#1a1a1a",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <Building2 size={18} />
            Corporate Services
          </h3>
          <div className="dash-grid">
            {corporateServices.length === 0 ? (
              <div className="dash-empty-state">
                <Package size={48} className="dash-empty-icon" />
                <p className="dash-empty-text">No corporate services yet</p>
                <p className="muted">Create a corporate service to get started</p>
              </div>
            ) : (
              corporateServices.map((service) => (
            <div className="dash-card" key={service.id}>
              <div className="dash-card-header">
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    style={{
                      width: "48px",
                      height: "48px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginRight: "12px",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <Package size={20} className="dash-card-icon" />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h3 className="dash-card-title">{service.name}</h3>
                    {service.isTrending && (
                      <span style={{
                        background: "var(--primary)",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}>
                        <TrendingUp size={12} />
                        Trending
                      </span>
                    )}
                  </div>
                  <p className="muted" style={{ fontSize: "13px", marginTop: "4px" }}>
                    {service.slug} • {service.type}
                  </p>
                </div>
                <span className={`dash-status-pill dash-status-pill-${service.isActive ? "active" : "inactive"}`}>
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="dash-card-content">
                {service.description && (
                  <div style={{ marginBottom: "12px" }}>
                    <p className="muted" style={{ 
                      display: "-webkit-box",
                      WebkitLineClamp: expandedDescriptions[service.id] ? "none" : 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: "1.5",
                    }}>
                      {service.description}
                    </p>
                    {service.description.length > 150 && (
                      <button
                        type="button"
                        onClick={() => toggleDescription(service.id)}
                        className="btn-outline btn-sm"
                        style={{ marginTop: "8px", fontSize: "12px" }}
                      >
                        {expandedDescriptions[service.id] ? "Read less" : "Read more..."}
                      </button>
                    )}
                  </div>
                )}
                {service.options && service.options.length > 0 && (
                  <div style={{ marginBottom: "12px" }}>
                    <span className="dash-info-label" style={{ display: "block", marginBottom: "6px" }}>Sub-services:</span>
                    <ul style={{ paddingLeft: "20px", fontSize: "13px", color: "var(--text-secondary)" }}>
                      {service.options.slice(0, 3).map((opt, idx) => (
                        <li key={idx}>{opt.name || opt}</li>
                      ))}
                      {service.options.length > 3 && (
                        <li style={{ fontStyle: "italic" }}>+{service.options.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
                <div className="dash-info-row">
                  <span className="dash-info-label">Pricing</span>
                  <span className="dash-info-value">
                    {service.basePrice ? `$${service.basePrice.toFixed(2)}` : "Custom"}
                  </span>
                </div>
                <div className="dash-info-row">
                  <span className="dash-info-label">Sub-services</span>
                  <span className="dash-info-value">{service.options?.length || 0}</span>
                </div>
                <div className="dash-info-row">
                  <span className="dash-info-label">Bookings</span>
                  <span className="dash-info-value">{service._count?.bookings || 0}</span>
                </div>
                <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    className="btn btn-sm outline"
                    onClick={() => handleEdit(service)}
                  >
                    <Edit size={14} style={{ marginRight: "4px" }} />
                    Edit
                  </button>
                  <button
                    className="btn btn-sm outline"
                    onClick={() => handleToggleActive(service)}
                  >
                    {service.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    className="btn btn-sm outline"
                    onClick={() => handleDelete(service)}
                    style={{ color: "var(--error)", borderColor: "var(--error)" }}
                  >
                    <Trash2 size={14} style={{ marginRight: "4px" }} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ShopTab() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("products"); // "products" or "categories"
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [creating, setCreating] = useState(false);
  const formRef = useRef(null);
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    categoryId: "",
    imageUrl: "",
    isActive: true,
  });
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    isActive: true,
  });
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (showCreateForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showCreateForm]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        apiClient.get("/api/admin/shop/products"),
        apiClient.get("/api/admin/shop/categories"),
      ]);
      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (err) {
      console.error("Load shop data error:", err);
      toast.error(err.response?.data?.message || "Failed to load shop data");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Check file size (max 10MB = 10000 KB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Image size must be less than 10MB (${(file.size / (1024 * 1024)).toFixed(2)}MB selected). Please compress your image and try again.`);
      return;
    }

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        if (activeView === "products") {
          setProductForm({ ...productForm, imageUrl: base64String });
        } else {
          setCategoryForm({ ...categoryForm, imageUrl: base64String });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForms = () => {
    setProductForm({
      name: "",
      slug: "",
      description: "",
      price: "",
      categoryId: "",
      imageUrl: "",
      isActive: true,
    });
    setCategoryForm({
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      isActive: true,
    });
    setImagePreview(null);
    setEditingItem(null);
    setShowCreateForm(false);
  };

  const handleCreateProduct = async () => {
    if (!productForm.name || !productForm.slug || !productForm.price) {
      toast.error("Name, slug, and price are required");
      return;
    }

    setCreating(true);
    try {
      await apiClient.post("/api/admin/shop/products", productForm);
      toast.success("Product created successfully!");
      resetForms();
      loadData();
    } catch (err) {
      console.error("Create product error:", err);
      toast.error(err.response?.data?.message || "Failed to create product");
    } finally {
      setCreating(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!categoryForm.name || !categoryForm.slug) {
      toast.error("Name and slug are required");
      return;
    }

    setCreating(true);
    try {
      await apiClient.post("/api/admin/shop/categories", categoryForm);
      toast.success("Category created successfully!");
      resetForms();
      loadData();
    } catch (err) {
      console.error("Create category error:", err);
      toast.error(err.response?.data?.message || "Failed to create category");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    if (activeView === "products") {
      setProductForm({
        name: item.name || "",
        slug: item.slug || "",
        description: item.description || "",
        price: item.price || "",
        categoryId: item.categoryId || "",
        imageUrl: item.imageUrl || "",
        isActive: item.isActive !== undefined ? item.isActive : true,
      });
      if (item.imageUrl) setImagePreview(item.imageUrl);
    } else {
      setCategoryForm({
        name: item.name || "",
        slug: item.slug || "",
        description: item.description || "",
        imageUrl: item.imageUrl || "",
        isActive: item.isActive !== undefined ? item.isActive : true,
      });
      if (item.imageUrl) setImagePreview(item.imageUrl);
    }
    setShowCreateForm(true);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleUpdateProduct = async () => {
    if (!editingItem) return;
    setCreating(true);
    try {
      await apiClient.patch(`/api/admin/shop/products/${editingItem.id}`, productForm);
      toast.success("Product updated successfully!");
      resetForms();
      loadData();
    } catch (err) {
      console.error("Update product error:", err);
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingItem) return;
    setCreating(true);
    try {
      await apiClient.patch(`/api/admin/shop/categories/${editingItem.id}`, categoryForm);
      toast.success("Category updated successfully!");
      resetForms();
      loadData();
    } catch (err) {
      console.error("Update category error:", err);
      toast.error(err.response?.data?.message || "Failed to update category");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (item, type) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      await apiClient.delete(`/api/admin/shop/${type}/${item.id}`);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
      loadData();
    } catch (err) {
      console.error(`Delete ${type} error:`, err);
      toast.error(err.response?.data?.message || `Failed to delete ${type}`);
    }
  };

  const toggleDescription = (itemId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  if (loading) {
    return (
      <div className="dash-main-inner fade-in-up">
        <p>Loading shop data...</p>
      </div>
    );
  }

  return (
    <div className="dash-main-inner fade-in-up">
      <header className="dash-page-header">
        <div>
          <h2 className="dash-title">Shop Management</h2>
          <p className="muted dash-subtitle">
            Manage products and categories
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px", background: "#f3f4f6", padding: "4px", borderRadius: "8px" }}>
            <button
              className={`btn btn-sm ${activeView === "products" ? "" : "outline"}`}
              onClick={() => {
                setActiveView("products");
                resetForms();
              }}
            >
              Products ({products.length})
            </button>
            <button
              className={`btn btn-sm ${activeView === "categories" ? "" : "outline"}`}
              onClick={() => {
                setActiveView("categories");
                resetForms();
              }}
            >
              Categories ({categories.length})
            </button>
          </div>
          <button
            className="btn"
            onClick={() => {
              resetForms();
              setShowCreateForm(true);
            }}
          >
            <Plus size={16} style={{ marginRight: "4px" }} />
            Create {activeView === "products" ? "Product" : "Category"}
          </button>
        </div>
      </header>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div ref={formRef} className="dash-card fade-in-up fade-in-delay-sm" style={{ marginBottom: "24px" }}>
          <div className="dash-card-header">
            <h3 className="dash-card-title">
              {editingItem ? `Edit ${activeView === "products" ? "Product" : "Category"}` : `Create New ${activeView === "products" ? "Product" : "Category"}`}
            </h3>
            <button className="btn btn-sm outline" onClick={resetForms}>
              <X size={16} />
            </button>
          </div>
          <div className="dash-card-content">
            {activeView === "products" ? (
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label className="dash-label">Product Name *</label>
                    <input
                      className="dash-input"
                      value={productForm.name}
                      onChange={(e) => {
                        setProductForm({ ...productForm, name: e.target.value, slug: generateSlug(e.target.value) });
                      }}
                      placeholder="e.g., Dish Wash Liquid"
                      required
                    />
                  </div>
                  <div>
                    <label className="dash-label">Slug *</label>
                    <input
                      className="dash-input"
                      value={productForm.slug}
                      onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                      placeholder="e.g., dish-wash-liquid"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="dash-label">Description</label>
                  <textarea
                    className="dash-input"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Product description"
                    rows={3}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label className="dash-label">Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="dash-input"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="dash-label">Category</label>
                    <select
                      className="dash-input"
                      value={productForm.categoryId}
                      onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    >
                      <option value="">No Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="dash-label">Image URL</label>
                  <input
                    className="dash-input"
                    value={productForm.imageUrl}
                    onChange={(e) => {
                      setProductForm({ ...productForm, imageUrl: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://example.com/image.png or upload file"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ marginTop: "8px" }}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        marginTop: "12px",
                        maxWidth: "200px",
                        maxHeight: "200px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                  )}
                </div>
                <div>
                  <label className="dash-label">
                    <input
                      type="checkbox"
                      checked={productForm.isActive}
                      onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                      style={{ marginRight: "8px" }}
                    />
                    Active
                  </label>
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                  <button
                    className="btn"
                    onClick={editingItem ? handleUpdateProduct : handleCreateProduct}
                    disabled={creating}
                  >
                    {creating ? "Saving..." : editingItem ? "Update Product" : "Create Product"}
                  </button>
                  <button className="btn outline" onClick={resetForms}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label className="dash-label">Category Name *</label>
                    <input
                      className="dash-input"
                      value={categoryForm.name}
                      onChange={(e) => {
                        setCategoryForm({ ...categoryForm, name: e.target.value, slug: generateSlug(e.target.value) });
                      }}
                      placeholder="e.g., Home Care & Essentials"
                      required
                    />
                  </div>
                  <div>
                    <label className="dash-label">Slug *</label>
                    <input
                      className="dash-input"
                      value={categoryForm.slug}
                      onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                      placeholder="e.g., home-care-essentials"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="dash-label">Description</label>
                  <textarea
                    className="dash-input"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="Category description"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="dash-label">Image URL</label>
                  <input
                    className="dash-input"
                    value={categoryForm.imageUrl}
                    onChange={(e) => {
                      setCategoryForm({ ...categoryForm, imageUrl: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://example.com/image.png or upload file"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ marginTop: "8px" }}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        marginTop: "12px",
                        maxWidth: "200px",
                        maxHeight: "200px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                  )}
                </div>
                <div>
                  <label className="dash-label">
                    <input
                      type="checkbox"
                      checked={categoryForm.isActive}
                      onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                      style={{ marginRight: "8px" }}
                    />
                    Active
                  </label>
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                  <button
                    className="btn"
                    onClick={editingItem ? handleUpdateCategory : handleCreateCategory}
                    disabled={creating}
                  >
                    {creating ? "Saving..." : editingItem ? "Update Category" : "Create Category"}
                  </button>
                  <button className="btn outline" onClick={resetForms}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products List */}
      {activeView === "products" && (
        <div className="dash-card fade-in-up fade-in-delay-sm">
          <h3 className="dash-card-title" style={{ marginBottom: "16px" }}>All Products</h3>
          {products.length === 0 ? (
            <div className="dash-empty-state">
              <ShoppingBag size={48} className="dash-empty-icon" />
              <p className="dash-empty-text">No products yet</p>
              <p className="muted">Create a product to get started</p>
            </div>
          ) : (
            <div className="dash-grid">
              {products.map((product) => (
                <div className="dash-card" key={product.id}>
                  <div className="dash-card-header">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{
                          width: "48px",
                          height: "48px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginRight: "12px",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <ShoppingBag size={20} className="dash-card-icon" />
                    )}
                    <div style={{ flex: 1 }}>
                      <h3 className="dash-card-title">{product.name}</h3>
                      <p className="muted" style={{ fontSize: "13px", marginTop: "4px" }}>
                        {product.slug} • {product.category?.name || "No Category"}
                      </p>
                    </div>
                    <span className={`dash-status-pill dash-status-pill-${product.isActive ? "active" : "inactive"}`}>
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="dash-card-content">
                    {product.description && (
                      <div style={{ marginBottom: "12px" }}>
                        <p className="muted" style={{
                          display: "-webkit-box",
                          WebkitLineClamp: expandedDescriptions[product.id] ? "none" : 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: "1.5",
                        }}>
                          {product.description}
                        </p>
                        {product.description.length > 150 && (
                          <button
                            type="button"
                            onClick={() => toggleDescription(product.id)}
                            className="btn-outline btn-sm"
                            style={{ marginTop: "8px", fontSize: "12px" }}
                          >
                            {expandedDescriptions[product.id] ? "Read less" : "Read more..."}
                          </button>
                        )}
                      </div>
                    )}
                    <div className="dash-info-row">
                      <span className="dash-info-label">Price</span>
                      <span className="dash-info-value">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="dash-info-row">
                      <span className="dash-info-label">Category</span>
                      <span className="dash-info-value">{product.category?.name || "—"}</span>
                    </div>
                    <div className="dash-info-row">
                      <span className="dash-info-label">Orders</span>
                      <span className="dash-info-value">{product._count?.orderItems || 0}</span>
                    </div>
                    <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button
                        className="btn btn-sm outline"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit size={14} style={{ marginRight: "4px" }} />
                        Edit
                      </button>
                      <button
                        className="btn btn-sm outline"
                        onClick={() => handleDelete(product, "products")}
                        style={{ color: "var(--error)", borderColor: "var(--error)" }}
                      >
                        <Trash2 size={14} style={{ marginRight: "4px" }} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Categories List */}
      {activeView === "categories" && (
        <div className="dash-card fade-in-up fade-in-delay-sm">
          <h3 className="dash-card-title" style={{ marginBottom: "16px" }}>All Categories</h3>
          {categories.length === 0 ? (
            <div className="dash-empty-state">
              <Package size={48} className="dash-empty-icon" />
              <p className="dash-empty-text">No categories yet</p>
              <p className="muted">Create a category to get started</p>
            </div>
          ) : (
            <div className="dash-grid">
              {categories.map((category) => (
                <div className="dash-card" key={category.id}>
                  <div className="dash-card-header">
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        style={{
                          width: "48px",
                          height: "48px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginRight: "12px",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <Package size={20} className="dash-card-icon" />
                    )}
                    <div style={{ flex: 1 }}>
                      <h3 className="dash-card-title">{category.name}</h3>
                      <p className="muted" style={{ fontSize: "13px", marginTop: "4px" }}>
                        {category.slug}
                      </p>
                    </div>
                    <span className={`dash-status-pill dash-status-pill-${category.isActive ? "active" : "inactive"}`}>
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="dash-card-content">
                    {category.description && (
                      <div style={{ marginBottom: "12px" }}>
                        <p className="muted" style={{
                          display: "-webkit-box",
                          WebkitLineClamp: expandedDescriptions[category.id] ? "none" : 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: "1.5",
                        }}>
                          {category.description}
                        </p>
                        {category.description.length > 150 && (
                          <button
                            type="button"
                            onClick={() => toggleDescription(category.id)}
                            className="btn-outline btn-sm"
                            style={{ marginTop: "8px", fontSize: "12px" }}
                          >
                            {expandedDescriptions[category.id] ? "Read less" : "Read more..."}
                          </button>
                        )}
                      </div>
                    )}
                    <div className="dash-info-row">
                      <span className="dash-info-label">Products</span>
                      <span className="dash-info-value">{category._count?.products || 0}</span>
                    </div>
                    <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button
                        className="btn btn-sm outline"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit size={14} style={{ marginRight: "4px" }} />
                        Edit
                      </button>
                      <button
                        className="btn btn-sm outline"
                        onClick={() => handleDelete(category, "categories")}
                        style={{ color: "var(--error)", borderColor: "var(--error)" }}
                      >
                        <Trash2 size={14} style={{ marginRight: "4px" }} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UsersTab({ users, onRefresh }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: "", phone: "", role: "" });
  const [updating, setUpdating] = useState(false);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      fullName: user.fullName || "",
      phone: user.phone || "",
      role: user.role || "CUSTOMER",
    });
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    setUpdating(true);
    try {
      await apiClient.patch(`/api/admin/users/${selectedUser.id}`, editForm);
      toast.success("User updated successfully");
      setSelectedUser(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="dash-main-inner fade-in-up">
      <header className="dash-page-header">
        <div>
          <h2 className="dash-title">Users</h2>
          <p className="muted dash-subtitle">
            Manage all registered users
          </p>
        </div>
      </header>

      <div className="dash-two-col">
        <div className="dash-card fade-in-up fade-in-delay-sm">
          <div className="dash-card-header">
            <Users size={20} className="dash-card-icon" />
            <h3 className="dash-card-title">All Users ({users.length})</h3>
          </div>
          <div className="dash-card-content">
            {users.length === 0 ? (
              <div className="dash-empty-state">
                <Users size={48} className="dash-empty-icon" />
                <p className="dash-empty-text">No users found</p>
              </div>
            ) : (
              <div className="dash-list">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className={`dash-list-item ${selectedUser?.id === user.id ? "is-active" : ""}`}
                    onClick={() => handleEdit(user)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="dash-list-content">
                      <div className="dash-list-title-row">
                        <span className="dash-list-title">{user.fullName || "—"}</span>
                        <span className={`dash-status-pill dash-status-pill-${user.role?.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </div>
                      <div className="dash-list-meta-row">
                        <span className="dash-list-meta">{user.email}</span>
                        {user.phone && <span className="dash-list-meta">{user.phone}</span>}
                        {user.city && <span className="dash-list-meta">{user.city}</span>}
                        {user.totalBookings !== undefined && (
                          <span className="dash-list-meta">{user.totalBookings} bookings</span>
                        )}
                      </div>
                    </div>
                    <Edit size={16} style={{ color: "#6b7280" }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedUser && (
          <div className="dash-card">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Edit User</h3>
              <button
                className="btn-outline btn-sm"
                onClick={() => setSelectedUser(null)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="dash-card-content">
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="input"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px" }}>
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="input"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px" }}>
                    Role
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="input"
                    style={{ width: "100%" }}
                  >
                    <option value="CUSTOMER">Customer</option>
                    <option value="WORKER">Worker</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="dash-info-row">
                  <span className="dash-info-label">Email</span>
                  <span className="dash-info-value">{selectedUser.email}</span>
                </div>
                <div className="dash-info-row">
                  <span className="dash-info-label">Joined</span>
                  <span className="dash-info-value">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  className="btn"
                  onClick={handleSave}
                  disabled={updating}
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [workers, setWorkers] = useState(null);
  const [services, setServices] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [overviewRes, bookingsRes, revenueRes, workersRes, servicesRes] = await Promise.all([
        apiClient.get("/api/admin/analytics/overview").catch((err) => {
          console.error("[Analytics] Failed to load overview:", err);
          toast.error("Failed to load overview analytics");
          return { data: null };
        }),
        apiClient.get("/api/admin/analytics/bookings").catch((err) => {
          console.error("[Analytics] Failed to load bookings analytics:", err);
          return { data: null };
        }),
        apiClient.get("/api/admin/analytics/revenue").catch((err) => {
          console.error("[Analytics] Failed to load revenue analytics:", err);
          return { data: null };
        }),
        apiClient.get("/api/admin/analytics/workers").catch((err) => {
          console.error("[Analytics] Failed to load workers analytics:", err);
          return { data: null };
        }),
        apiClient.get("/api/admin/analytics/services").catch((err) => {
          console.error("[Analytics] Failed to load services analytics:", err);
          return { data: null };
        }),
      ]);

      if (overviewRes.data) setOverview(overviewRes.data);
      if (bookingsRes.data) setBookings(bookingsRes.data);
      if (revenueRes.data) setRevenue(revenueRes.data);
      if (workersRes.data) setWorkers(workersRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
    } catch (err) {
      console.error("Load analytics error:", err);
      toast.error(err.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dash-main-inner fade-in-up">
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="dash-main-inner fade-in-up">
      <header className="dash-hero-row fade-in-up">
        <div>
          <h2 className="dash-title">Analytics Dashboard</h2>
          <p className="muted dash-subtitle">
            Business insights and performance metrics
          </p>
        </div>
      </header>

      {overview && (
        <div className="dash-stat-grid fade-in-up fade-in-delay-sm">
          <div className="dash-stat-card">
            <div className="dash-stat-icon-wrap">
              <Calendar size={22} strokeWidth={2} />
            </div>
            <div className="dash-stat-content">
              <p className="stat-val">{overview.bookings?.total || 0}</p>
              <p className="stat-label">Total Bookings</p>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon-wrap" style={{ background: "#dbeafe" }}>
              <CheckCircle2 size={22} strokeWidth={2} />
            </div>
            <div className="dash-stat-content">
              <p className="stat-val">{overview.bookings?.completed || 0}</p>
              <p className="stat-label">Completed</p>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon-wrap" style={{ background: "#dcfce7" }}>
              <DollarSign size={22} strokeWidth={2} />
            </div>
            <div className="dash-stat-content">
              <p className="stat-val">${(overview.revenue?.total || 0).toFixed(2)}</p>
              <p className="stat-label">Total Revenue</p>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon-wrap" style={{ background: "#fef3c7" }}>
              <TrendingUp size={22} strokeWidth={2} />
            </div>
            <div className="dash-stat-content">
              <p className="stat-val">${(overview.revenue?.averageBookingValue || 0).toFixed(2)}</p>
              <p className="stat-label">Avg Booking Value</p>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon-wrap" style={{ background: "#e0e7ff" }}>
              <Briefcase size={22} strokeWidth={2} />
            </div>
            <div className="dash-stat-content">
              <p className="stat-val">{overview.workers?.active || 0}</p>
              <p className="stat-label">Active Workers</p>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon-wrap" style={{ background: "#fce7f3" }}>
              <Package size={22} strokeWidth={2} />
            </div>
            <div className="dash-stat-content">
              <p className="stat-val">{overview.services?.active || 0}</p>
              <p className="stat-label">Active Services</p>
            </div>
          </div>
        </div>
      )}

      {revenue && revenue.summary && (
        <div className="dash-card fade-in-up fade-in-delay-md" style={{ marginTop: "24px" }}>
          <div className="dash-card-header">
            <DollarSign size={20} className="dash-card-icon" />
            <h3 className="dash-card-title">Revenue Analytics</h3>
          </div>
          <div className="dash-card-content">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              <div>
                <p className="muted" style={{ fontSize: "13px", marginBottom: "4px" }}>Today</p>
                <p style={{ fontSize: "20px", fontWeight: 600 }}>${(revenue.summary?.today || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="muted" style={{ fontSize: "13px", marginBottom: "4px" }}>This Week</p>
                <p style={{ fontSize: "20px", fontWeight: 600 }}>${(revenue.summary?.thisWeek || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="muted" style={{ fontSize: "13px", marginBottom: "4px" }}>This Month</p>
                <p style={{ fontSize: "20px", fontWeight: 600 }}>${(revenue.summary?.thisMonth || 0).toFixed(2)}</p>
              </div>
            </div>
            {revenue.byService && revenue.byService.length > 0 && (
              <div>
                <h4 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: 600 }}>Revenue by Service</h4>
                <div className="dash-table-wrapper">
                  <div className="dash-table">
                    <div className="dash-table-head">
                      <span>Service</span>
                      <span>Bookings</span>
                      <span>Revenue</span>
                    </div>
                    {revenue.byService.slice(0, 10).map((item) => (
                      <div className="dash-table-row" key={item.serviceId || item.serviceName}>
                        <span className="dash-table-cell-main">{item.serviceName || "N/A"}</span>
                        <span className="dash-table-cell">{item.bookingCount || 0}</span>
                        <span className="dash-table-cell" style={{ fontWeight: 600 }}>
                          ${(item.revenue || 0).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {workers && workers.workers && workers.workers.length > 0 && (
        <div className="dash-card fade-in-up fade-in-delay-md" style={{ marginTop: "24px" }}>
          <div className="dash-card-header">
            <Briefcase size={20} className="dash-card-icon" />
            <h3 className="dash-card-title">Worker Performance</h3>
          </div>
          <div className="dash-card-content">
            {workers.summary && (
            <div style={{ marginBottom: "16px", display: "flex", gap: "16px" }}>
              <div>
                <p className="muted" style={{ fontSize: "13px" }}>Avg Completion Rate</p>
                  <p style={{ fontSize: "18px", fontWeight: 600 }}>{workers.summary.averageCompletionRate || 0}%</p>
              </div>
              <div>
                <p className="muted" style={{ fontSize: "13px" }}>Total Completed Jobs</p>
                  <p style={{ fontSize: "18px", fontWeight: 600 }}>{workers.summary.totalCompletedJobs || 0}</p>
              </div>
            </div>
            )}
            <div className="dash-table-wrapper">
              <div className="dash-table">
                <div className="dash-table-head">
                  <span>Worker</span>
                  <span>Total Jobs</span>
                  <span>Completed</span>
                  <span>Completion Rate</span>
                  <span>Revenue</span>
                </div>
                {workers.workers.slice(0, 10).map((worker) => (
                  <div className="dash-table-row" key={worker.workerId}>
                    <span className="dash-table-cell-main">{worker.workerName || "N/A"}</span>
                    <span className="dash-table-cell">{worker.totalJobs || 0}</span>
                    <span className="dash-table-cell">{worker.completedJobs || 0}</span>
                    <span className="dash-table-cell">
                      <span className={`dash-status-pill ${(worker.completionRate || 0) >= 80 ? "dash-status-pill-active" : ""}`}>
                        {worker.completionRate || 0}%
                      </span>
                    </span>
                    <span className="dash-table-cell" style={{ fontWeight: 600 }}>
                      ${(worker.revenue || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {services && services.services && services.services.length > 0 && (
        <div className="dash-card fade-in-up fade-in-delay-md" style={{ marginTop: "24px" }}>
          <div className="dash-card-header">
            <Package size={20} className="dash-card-icon" />
            <h3 className="dash-card-title">Service Performance</h3>
          </div>
          <div className="dash-card-content">
            <div style={{ marginBottom: "16px", display: "flex", gap: "24px" }}>
              {services.mostBooked && (
                <div>
                  <p className="muted" style={{ fontSize: "13px" }}>Most Booked</p>
                  <p style={{ fontSize: "16px", fontWeight: 600 }}>{services.mostBooked.serviceName}</p>
                  <p className="muted" style={{ fontSize: "12px" }}>{services.mostBooked.totalBookings} bookings</p>
                </div>
              )}
              {services.leastBooked && (
                <div>
                  <p className="muted" style={{ fontSize: "13px" }}>Least Booked</p>
                  <p style={{ fontSize: "16px", fontWeight: 600 }}>{services.leastBooked.serviceName}</p>
                  <p className="muted" style={{ fontSize: "12px" }}>{services.leastBooked.totalBookings} bookings</p>
                </div>
              )}
            </div>
            <div className="dash-table-wrapper">
              <div className="dash-table">
                <div className="dash-table-head">
                  <span>Service</span>
                  <span>Total Bookings</span>
                  <span>Completed</span>
                  <span>Revenue</span>
                  <span>Status</span>
                </div>
                {services.services.slice(0, 10).map((service) => (
                  <div className="dash-table-row" key={service.serviceId}>
                    <span className="dash-table-cell-main">{service.serviceName || "N/A"}</span>
                    <span className="dash-table-cell">{service.totalBookings || 0}</span>
                    <span className="dash-table-cell">{service.completedBookings || 0}</span>
                    <span className="dash-table-cell" style={{ fontWeight: 600 }}>
                      ${(service.revenue || 0).toFixed(2)}
                    </span>
                    <span className="dash-table-cell">
                      <span className={`dash-status-pill dash-status-pill-${service.isActive ? "active" : "inactive"}`}>
                        {service.isActive ? "Active" : "Inactive"}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {bookings && bookings.summary && (
        <div className="dash-card fade-in-up fade-in-delay-md" style={{ marginTop: "24px" }}>
          <div className="dash-card-header">
            <Calendar size={20} className="dash-card-icon" />
            <h3 className="dash-card-title">Booking Analytics</h3>
          </div>
          <div className="dash-card-content">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              <div>
                <p className="muted" style={{ fontSize: "13px", marginBottom: "4px" }}>Today</p>
                <p style={{ fontSize: "20px", fontWeight: 600 }}>{bookings.summary?.today || 0}</p>
              </div>
              <div>
                <p className="muted" style={{ fontSize: "13px", marginBottom: "4px" }}>This Week</p>
                <p style={{ fontSize: "20px", fontWeight: 600 }}>{bookings.summary?.thisWeek || 0}</p>
              </div>
              <div>
                <p className="muted" style={{ fontSize: "13px", marginBottom: "4px" }}>This Month</p>
                <p style={{ fontSize: "20px", fontWeight: 600 }}>{bookings.summary?.thisMonth || 0}</p>
              </div>
            </div>
            {bookings.statusBreakdown && bookings.statusBreakdown.length > 0 && (
              <div>
                <h4 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: 600 }}>Status Breakdown</h4>
                <div className="dash-table-wrapper">
                  <div className="dash-table">
                    <div className="dash-table-head">
                      <span>Status</span>
                      <span>Count</span>
                    </div>
                    {bookings.statusBreakdown.map((item) => (
                      <div className="dash-table-row" key={item.status}>
                        <span className="dash-table-cell-main">{item.status}</span>
                        <span className="dash-table-cell">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="dash-card fade-in-up fade-in-delay-md" style={{ marginTop: "24px", background: "#f9fafb" }}>
        <div className="dash-card-content">
          <p className="muted" style={{ fontSize: "14px" }}>
            💡 <strong>Future Enhancements:</strong> Date range filters, CSV export, and payment provider integration coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}

function WorkerApplicationsTab({ applications, onRefresh }) {
  const [selectedApp, setSelectedApp] = useState(null);
  const [approving, setApproving] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredApplications = statusFilter === "all"
    ? applications
    : applications.filter(app => app.status === statusFilter.toUpperCase());

  const handleApprove = async (applicationId) => {
    if (!window.confirm("Approve this application? This will update the user's role to WORKER if they have a profile.")) {
      return;
    }

    setApproving(applicationId);
    try {
      await apiClient.post(`/api/admin/worker-applications/${applicationId}/approve`);
      toast.success("Application approved!");
      setSelectedApp(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Approve error:", err);
      toast.error(err.response?.data?.message || "Failed to approve application");
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (applicationId) => {
    if (!window.confirm("Reject this application?")) {
      return;
    }

    setRejecting(applicationId);
    try {
      await apiClient.post(`/api/admin/worker-applications/${applicationId}/reject`);
      toast.success("Application rejected.");
      setSelectedApp(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Reject error:", err);
      toast.error(err.response?.data?.message || "Failed to reject application");
    } finally {
      setRejecting(null);
    }
  };

  const pendingCount = applications.filter(app => app.status === "PENDING").length;

  return (
    <div className="dash-main-inner fade-in-up">
      <header className="dash-page-header">
        <div>
          <h2 className="dash-title">Worker Applications</h2>
          <p className="muted dash-subtitle">
            Review and approve worker applications
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="dash-chip" style={{ background: "#fef3c7", color: "#92400e" }}>
            {pendingCount} pending application{pendingCount !== 1 ? "s" : ""}
          </div>
        )}
      </header>

      <div className="dash-filters">
        <button
          className={`dash-filter-btn ${statusFilter === "all" ? "active" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          All ({applications.length})
        </button>
        <button
          className={`dash-filter-btn ${statusFilter === "PENDING" ? "active" : ""}`}
          onClick={() => setStatusFilter("PENDING")}
        >
          Pending ({applications.filter(a => a.status === "PENDING").length})
        </button>
        <button
          className={`dash-filter-btn ${statusFilter === "APPROVED" ? "active" : ""}`}
          onClick={() => setStatusFilter("APPROVED")}
        >
          Approved ({applications.filter(a => a.status === "APPROVED").length})
        </button>
        <button
          className={`dash-filter-btn ${statusFilter === "REJECTED" ? "active" : ""}`}
          onClick={() => setStatusFilter("REJECTED")}
        >
          Rejected ({applications.filter(a => a.status === "REJECTED").length})
        </button>
      </div>

      <div className="dash-two-col">
        <div className="dash-card">
          <div className="dash-card-header">
            <UserPlus size={20} className="dash-card-icon" />
            <h3 className="dash-card-title">Applications</h3>
          </div>
          {filteredApplications.length === 0 ? (
            <div className="dash-empty-state">
              <Briefcase size={48} className="dash-empty-icon" />
              <p className="dash-empty-text">No applications found</p>
            </div>
          ) : (
            <div className="dash-list">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className={`dash-list-item ${selectedApp?.id === app.id ? "is-active" : ""}`}
                  onClick={() => setSelectedApp(app)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="dash-list-main">
                    <div style={{ flex: 1 }}>
                      <span className="dash-list-title">{app.fullName}</span>
                      <p className="dash-list-sub muted">
                        {app.email} • {app.city || "Location not specified"}
                      </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                      <span className={`dash-status-pill dash-status-pill-${app.status?.toLowerCase()}`}>
                        {app.status}
                      </span>
                      <span className="muted" style={{ fontSize: "12px" }}>
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedApp ? (
          <div className="dash-card">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Application Details</h3>
              <button
                className="btn-icon"
                onClick={() => setSelectedApp(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="dash-card-content">
              <div className="dash-info-section">
                <h4 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: 600 }}>Personal Information</h4>
                <div className="dash-info-row">
                  <span className="dash-info-label">Name</span>
                  <span className="dash-info-value">{selectedApp.fullName}</span>
                </div>
                <div className="dash-info-row">
                  <span className="dash-info-label">Email</span>
                  <span className="dash-info-value">{selectedApp.email}</span>
                </div>
                {selectedApp.phone && (
                  <div className="dash-info-row">
                    <span className="dash-info-label">Phone</span>
                    <span className="dash-info-value">{selectedApp.phone}</span>
                  </div>
                )}
                {(selectedApp.city || selectedApp.province) && (
                  <div className="dash-info-row">
                    <span className="dash-info-label">Location</span>
                    <span className="dash-info-value">
                      {[selectedApp.city, selectedApp.province].filter(Boolean).join(", ") || "Not specified"}
                    </span>
                  </div>
                )}
                {selectedApp.experience && (
                  <div className="dash-info-section" style={{ marginTop: "24px" }}>
                    <h4 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: 600 }}>Experience</h4>
                    <p className="muted" style={{ whiteSpace: "pre-wrap" }}>{selectedApp.experience}</p>
                  </div>
                )}
              </div>

              {selectedApp.status === "PENDING" && (
                <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="btn"
                      onClick={() => handleApprove(selectedApp.id)}
                      disabled={approving === selectedApp.id}
                    >
                      {approving === selectedApp.id ? "Approving..." : (
                        <>
                          <CheckCircle size={16} />
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      className="btn outline"
                      onClick={() => handleReject(selectedApp.id)}
                      disabled={rejecting === selectedApp.id}
                    >
                      {rejecting === selectedApp.id ? "Rejecting..." : (
                        <>
                          <X size={16} />
                          Reject
                        </>
                      )}
                    </button>
            </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="dash-card">
            <div className="dash-empty-state">
              <Briefcase size={48} className="dash-empty-icon" />
              <p className="dash-empty-text">Select an application to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QuotesTab({ quotes, onRefresh }) {
  const [updating, setUpdating] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "#f59e0b";
      case "CONTACTED": return "#3b82f6";
      case "QUOTED": return "#8b5cf6";
      case "ACCEPTED": return "#10b981";
      case "REJECTED": return "#dc2626";
      default: return "#6b7280";
    }
  };

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await apiClient.patch(`/api/admin/quotes/${id}/status`, { status });
      toast.success("Quote status updated");
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update quote");
    } finally {
      setUpdating(null);
    }
  };

  const deleteQuote = async (id) => {
    if (!confirm("Are you sure you want to delete this quote?")) return;
    try {
      await apiClient.delete(`/api/admin/quotes/${id}`);
      toast.success("Quote deleted");
      if (onRefresh) onRefresh();
      if (selectedQuote?.id === id) setSelectedQuote(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete quote");
    }
  };

  return (
    <div className="dash-main-inner fade-in-up">
      <header className="dash-page-header">
        <div>
          <h2 className="dash-title">Quote Requests</h2>
          <p className="muted dash-subtitle">
            Manage all quote requests
          </p>
        </div>
      </header>

      <div className="dash-two-col">
        <div className="dash-card fade-in-up fade-in-delay-sm">
          <div className="dash-card-header">
            <DollarSign size={20} className="dash-card-icon" />
            <h3 className="dash-card-title">Quotes ({quotes.length})</h3>
          </div>
          <div className="dash-card-content">
            {quotes.length === 0 ? (
              <div className="dash-empty-state">
                <DollarSign size={48} className="dash-empty-icon" />
                <p className="dash-empty-text">No quote requests</p>
              </div>
            ) : (
              <div className="dash-list">
                {quotes.map((quote) => (
                  <div
                    key={quote.id}
                    className={`dash-list-item ${selectedQuote?.id === quote.id ? "is-active" : ""}`}
                    onClick={() => setSelectedQuote(quote)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="dash-list-content">
                      <div className="dash-list-title-row">
                        <span className="dash-list-title">{quote.serviceName || "Custom Service"}</span>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: 600,
                            background: getStatusColor(quote.status) + "20",
                            color: getStatusColor(quote.status),
                          }}
                        >
                          {quote.status}
                        </span>
                      </div>
                      <div className="dash-list-meta-row">
                        <span className="dash-list-meta">{quote.customerName || quote.guestName || "Guest"}</span>
                        <span className="dash-list-meta">{quote.customerEmail || quote.guestEmail || ""}</span>
                        {quote.estimatedPrice && (
                          <span className="dash-list-meta">${quote.estimatedPrice}</span>
                        )}
                      </div>
                      {quote.message && (
                        <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px" }}>
                          {quote.message.substring(0, 100)}{quote.message.length > 100 ? "..." : ""}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedQuote && (
          <div className="dash-card">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Quote Details</h3>
              <button
                className="btn-outline btn-sm"
                onClick={() => setSelectedQuote(null)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="dash-card-content">
              <div className="dash-info-row">
                <span className="dash-info-label">Service</span>
                <span className="dash-info-value">{selectedQuote.serviceName || "Custom Service"}</span>
              </div>
              <div className="dash-info-row">
                <span className="dash-info-label">Customer</span>
                <span className="dash-info-value">{selectedQuote.customerName || selectedQuote.guestName || "Guest"}</span>
              </div>
              <div className="dash-info-row">
                <span className="dash-info-label">Email</span>
                <span className="dash-info-value">{selectedQuote.customerEmail || selectedQuote.guestEmail || "—"}</span>
              </div>
              {selectedQuote.estimatedPrice && (
                <div className="dash-info-row">
                  <span className="dash-info-label">Estimated Price</span>
                  <span className="dash-info-value">${selectedQuote.estimatedPrice}</span>
                </div>
              )}
              <div className="dash-info-row">
                <span className="dash-info-label">Status</span>
                <span className="dash-info-value">
                        <select
                    value={selectedQuote.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setSelectedQuote({ ...selectedQuote, status: newStatus });
                      updateStatus(selectedQuote.id, newStatus);
                    }}
                    disabled={updating === selectedQuote.id}
                    className="input"
                    style={{ width: "100%" }}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="QUOTED">Quoted</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </span>
              </div>
              {selectedQuote.message && (
                <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--border-subtle)" }}>
                  <h4 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}>Message:</h4>
                  <p style={{ 
                    padding: "16px", 
                    background: "var(--bg)", 
                    borderRadius: "8px",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap"
                  }}>
                    {selectedQuote.message}
                  </p>
                </div>
              )}
              <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
                <button
                  className="btn-outline"
                  style={{ color: "var(--error)", borderColor: "var(--error)" }}
                  onClick={() => deleteQuote(selectedQuote.id)}
                >
                  <Trash2 size={16} style={{ marginRight: "8px" }} />
                  Delete Quote
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChoresTab({ chores, onRefresh }) {
  const [updating, setUpdating] = useState(null);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await apiClient.patch(`/api/admin/chores/${id}/status`, { status });
      toast.success("Chore status updated");
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update chore");
    } finally {
      setUpdating(null);
    }
  };

  const deleteChore = async (id) => {
    if (!confirm("Are you sure you want to delete this chore?")) return;
    try {
      await apiClient.delete(`/api/admin/chores/${id}`);
      toast.success("Chore deleted");
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete chore");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "#f59e0b";
      case "IN_PROGRESS": return "#3b82f6";
      case "COMPLETED": return "#10b981";
      case "CANCELLED": return "#dc2626";
      default: return "#6b7280";
    }
  };

  return (
    <div className="dash-main-inner fade-in-up">
      <header className="dash-page-header">
        <div>
          <h2 className="dash-title">Custom Chores</h2>
          <p className="muted dash-subtitle">
            Manage all custom chore requests
          </p>
        </div>
      </header>

      <div className="dash-card fade-in-up fade-in-delay-sm">
        <div className="dash-card-header">
          <Briefcase size={20} className="dash-card-icon" />
          <h3 className="dash-card-title">Chores ({chores.length})</h3>
        </div>
        <div className="dash-card-content">
        {chores.length === 0 ? (
          <div className="dash-empty-state">
            <Briefcase size={48} className="dash-empty-icon" />
            <p className="dash-empty-text">No custom chores</p>
          </div>
        ) : (
          <div className="dash-list">
            {chores.map((chore) => (
              <div key={chore.id} className="dash-list-item">
                <div className="dash-list-content">
                  <div className="dash-list-title-row">
                    <span className="dash-list-title">{chore.title}</span>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        background: getStatusColor(chore.status) + "20",
                        color: getStatusColor(chore.status),
                      }}
                    >
                      {chore.status}
                    </span>
                  </div>
                  <div className="dash-list-meta-row">
                    {chore.customer && (
                      <>
                        <span className="dash-list-meta">{chore.customer.fullName}</span>
                        <span className="dash-list-meta">{chore.customer.email}</span>
                      </>
                    )}
                    {chore.preferredDate && (
                      <span className="dash-list-meta">
                        {new Date(chore.preferredDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {chore.description && (
                    <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px" }}>
                      {chore.description.substring(0, 100)}...
                    </p>
                  )}
                </div>
                <div className="dash-list-actions">
                  <select
                    value={chore.status}
                    onChange={(e) => updateStatus(chore.id, e.target.value)}
                    disabled={updating === chore.id}
                    className="btn btn-sm"
                    style={{ marginRight: "8px" }}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                        </select>
                  <button
                    className="btn-outline btn-sm"
                    style={{ color: "var(--error)", borderColor: "var(--error)" }}
                    onClick={() => deleteChore(chore.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            </div>
        )}
        </div>
      </div>
    </div>
  );
}

function OrdersTab({ orders, onRefresh }) {
  const [updating, setUpdating] = useState(null);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await apiClient.patch(`/api/admin/orders/${id}/status`, { status });
      toast.success("Order status updated");
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "#f59e0b";
      case "CONFIRMED": return "#3b82f6";
      case "PROCESSING": return "#8b5cf6";
      case "SHIPPED": return "#06b6d4";
      case "DELIVERED": return "#10b981";
      case "CANCELLED": return "#dc2626";
      default: return "#6b7280";
    }
  };

  return (
    <div className="dash-main-inner fade-in-up">
      <header className="dash-page-header">
        <div>
          <h2 className="dash-title">Orders</h2>
          <p className="muted dash-subtitle">
            Manage all product orders
          </p>
            </div>
      </header>

      <div className="dash-card fade-in-up fade-in-delay-sm">
        <div className="dash-card-header">
          <ShoppingBag size={20} className="dash-card-icon" />
          <h3 className="dash-card-title">Orders ({orders.length})</h3>
        </div>
        <div className="dash-card-content">
        {orders.length === 0 ? (
          <div className="dash-empty-state">
            <ShoppingBag size={48} className="dash-empty-icon" />
            <p className="dash-empty-text">No orders</p>
          </div>
        ) : (
          <div className="dash-list">
            {orders.map((order) => (
              <div key={order.id} className="dash-list-item">
                <div className="dash-list-content">
                  <div className="dash-list-title-row">
                    <span className="dash-list-title">Order #{order.id.slice(0, 8)}</span>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        background: getStatusColor(order.status) + "20",
                        color: getStatusColor(order.status),
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="dash-list-meta-row">
                    {order.customer && (
                      <>
                        <span className="dash-list-meta">{order.customer.fullName}</span>
                        <span className="dash-list-meta">{order.customer.email}</span>
          </>
        )}
                    <span className="dash-list-meta">${order.totalAmount?.toFixed(2)}</span>
                    <span className="dash-list-meta">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {order.items && order.items.length > 0 && (
                    <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px" }}>
                      {order.items.map(i => i.product?.name || "Unknown").join(", ")}
                    </p>
                  )}
                </div>
                <div className="dash-list-actions">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    disabled={updating === order.id}
                    className="btn btn-sm"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

function ContactMessagesTab({ messages, onRefresh }) {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const filteredMessages = statusFilter === "all" 
    ? messages 
    : messages.filter(m => m.status === statusFilter.toUpperCase());

  const updateStatus = async (messageId, newStatus) => {
    setUpdatingStatus(messageId);
    try {
      await apiClient.put(`/api/contact/${messageId}/status`, { status: newStatus });
      toast.success("Message status updated");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Update status error:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }
    try {
      await apiClient.delete(`/api/contact/${messageId}`);
      toast.success("Message deleted");
      if (onRefresh) onRefresh();
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete message");
    }
  };

  const newCount = messages.filter(m => m.status === "NEW").length;

  return (
    <div className="dash-main-inner fade-in-up">
      <header className="dash-page-header">
        <div>
          <h2 className="dash-title">Contact Messages</h2>
          <p className="muted dash-subtitle">
            View and manage customer inquiries
          </p>
        </div>
        {newCount > 0 && (
          <div className="dash-chip" style={{ background: "#fee2e2", color: "#dc2626" }}>
            {newCount} new message{newCount !== 1 ? "s" : ""}
          </div>
        )}
      </header>

      <div className="dash-filters">
        <button
          className={`dash-filter-btn ${statusFilter === "all" ? "active" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          All ({messages.length})
        </button>
        <button
          className={`dash-filter-btn ${statusFilter === "NEW" ? "active" : ""}`}
          onClick={() => setStatusFilter("NEW")}
        >
          New ({messages.filter(m => m.status === "NEW").length})
        </button>
        <button
          className={`dash-filter-btn ${statusFilter === "READ" ? "active" : ""}`}
          onClick={() => setStatusFilter("READ")}
        >
          Read ({messages.filter(m => m.status === "READ").length})
        </button>
        <button
          className={`dash-filter-btn ${statusFilter === "REPLIED" ? "active" : ""}`}
          onClick={() => setStatusFilter("REPLIED")}
        >
          Replied ({messages.filter(m => m.status === "REPLIED").length})
        </button>
      </div>

      <div className="dash-two-col">
        <div className="dash-card">
          <div className="dash-card-header">
            <Mail size={20} className="dash-card-icon" />
            <h3 className="dash-card-title">Messages</h3>
          </div>
          {filteredMessages.length === 0 ? (
            <div className="dash-empty-state">
              <MessageCircle size={48} className="dash-empty-icon" />
              <p className="dash-empty-text">No messages found</p>
            </div>
          ) : (
            <div className="dash-list">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`dash-list-item ${selectedMessage?.id === msg.id ? "is-active" : ""}`}
                  onClick={() => setSelectedMessage(msg)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="dash-list-main">
                    <div style={{ flex: 1 }}>
                      <span className="dash-list-title">{msg.subject}</span>
                      <p className="dash-list-sub muted">
                        {msg.name} • {msg.email}
                      </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                      <span className={`dash-status-pill dash-status-pill-${msg.status?.toLowerCase()}`}>
                        {msg.status}
                      </span>
                      <span className="dash-list-meta">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dash-card">
          {selectedMessage ? (
            <>
              <div className="dash-card-header">
                <h3 className="dash-card-title">{selectedMessage.subject}</h3>
                <span className={`dash-status-pill dash-status-pill-${selectedMessage.status?.toLowerCase()}`}>
                  {selectedMessage.status}
                </span>
              </div>
              
              <div className="dash-card-content">
                <div className="dash-info-row">
                  <span className="dash-info-label">From</span>
                  <span className="dash-info-value">{selectedMessage.name}</span>
                </div>
                <div className="dash-info-row">
                  <span className="dash-info-label">Email</span>
                  <span className="dash-info-value">
                    <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
                  </span>
                </div>
                <div className="dash-info-row">
                  <span className="dash-info-label">Date</span>
                  <span className="dash-info-value">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </span>
                </div>
                {selectedMessage.repliedAt && (
                  <div className="dash-info-row">
                    <span className="dash-info-label">Replied</span>
                    <span className="dash-info-value">
                      {new Date(selectedMessage.repliedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--border-subtle)" }}>
                <h4 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}>Message:</h4>
                <p style={{ 
                  padding: "16px", 
                  background: "var(--bg)", 
                  borderRadius: "8px",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap"
                }}>
                  {selectedMessage.message}
                </p>
              </div>

              {selectedMessage.adminNotes && (
                <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--border-subtle)" }}>
                  <h4 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}>Admin Notes:</h4>
                  <p style={{ 
                    padding: "16px", 
                    background: "var(--primary-soft)", 
                    borderRadius: "8px",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap"
                  }}>
                    {selectedMessage.adminNotes}
                  </p>
                </div>
              )}

              <div className="dash-content-card-actions" style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--border-subtle)" }}>
                {selectedMessage.status !== "READ" && (
                  <button
                    className="btn-outline btn-sm"
                    onClick={() => updateStatus(selectedMessage.id, "READ")}
                    disabled={updatingStatus === selectedMessage.id}
                  >
                    Mark as Read
                  </button>
                )}
                {selectedMessage.status !== "REPLIED" && (
                  <button
                    className="btn btn-sm"
                    onClick={() => updateStatus(selectedMessage.id, "REPLIED")}
                    disabled={updatingStatus === selectedMessage.id}
                  >
                    Mark as Replied
                  </button>
                )}
                <button
                  className="btn-outline btn-sm"
                  style={{ color: "var(--error)", borderColor: "var(--error)" }}
                  onClick={() => deleteMessage(selectedMessage.id)}
                >
                  Delete
                </button>
              </div>
            </>
          ) : (
            <div className="dash-empty-state">
              <MessageCircle size={48} className="dash-empty-icon" />
              <p className="dash-empty-text">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
