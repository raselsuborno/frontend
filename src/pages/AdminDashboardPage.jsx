import React, { useEffect, useState } from "react";
import apiClient from "../lib/api.js";
import toast from "react-hot-toast";
import { PageWrapper } from "../components/page-wrapper.jsx";
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
        apiClient.get("/api/admin/stats"),
        apiClient.get("/api/admin/bookings"),
        apiClient.get("/api/admin/workers"),
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
  const [editForm, setEditForm] = useState({});
  const [updating, setUpdating] = useState(false);

  const handleAssign = () => {
    if (!selectedWorker) {
      toast.error("Please select a worker");
      return;
    }
    onAssign(selectedBooking.id, selectedWorker);
    setSelectedBooking(null);
    setSelectedWorker("");
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setEditForm({
      status: booking.status,
      date: booking.date ? new Date(booking.date).toISOString().split('T')[0] : "",
      timeSlot: booking.timeSlot || "",
      addressLine: booking.addressLine || "",
      city: booking.city || "",
      province: booking.province || "",
      postal: booking.postal || "",
      notes: booking.notes || "",
      totalAmount: booking.totalAmount || "",
      assignedWorkerId: booking.assignedWorkerId || "",
    });
  };

  const handleSaveBooking = async () => {
    if (!selectedBooking) return;
    setUpdating(true);
    try {
      await apiClient.put(`/api/admin/bookings/${selectedBooking.id}`, editForm);
      toast.success("Booking updated successfully");
      setSelectedBooking(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update booking");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="dash-main-inner fade-in-up">
      <header className="dash-page-header">
        <div>
          <h2 className="dash-title">All Bookings</h2>
          <p className="muted dash-subtitle">
            Manage and assign bookings to workers
          </p>
        </div>
      </header>

      <div className="dash-card fade-in-up fade-in-delay-sm">
        <div className="dash-table-wrapper">
          <div className="dash-table">
            <div className="dash-table-head">
              <span>Service</span>
              <span>Customer</span>
              <span>Date & Time</span>
              <span>Address</span>
              <span>Worker</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {bookings.map((booking) => (
              <div className="dash-table-row" key={booking.id}>
                <span className="dash-table-cell-main">
                  {booking.serviceName}
                  {booking.subService && ` - ${booking.subService}`}
                </span>
                <span className="dash-table-cell">
                  {booking.user?.name || booking.guestName || "Guest"}
                </span>
                <span className="dash-table-cell">
                  {new Date(booking.date).toLocaleDateString()}
                  {booking.timeSlot && ` ${booking.timeSlot}`}
                </span>
                <span className="dash-table-cell">
                  {booking.addressLine}, {booking.city}
                </span>
                <span className="dash-table-cell">
                  {booking.worker ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <UserCheck size={14} />
                      {booking.worker.name || booking.worker.email}
                    </div>
                  ) : (
                    <span className="muted">Unassigned</span>
                  )}
                </span>
                <span className={`dash-status-pill dash-status-pill-${booking.status?.toLowerCase()}`}>
                  {booking.status}
                </span>
                <span className="dash-table-cell">
                  {booking.worker ? (
                    <button
                      className="btn btn-sm outline"
                      onClick={() => onUnassign(booking.id)}
                      title="Unassign worker"
                    >
                      <X size={14} />
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm"
                      onClick={() => setSelectedBooking(booking)}
                      disabled={assigningWorker === booking.id}
                    >
                      {assigningWorker === booking.id ? "Assigning..." : "Assign"}
                    </button>
                  )}
                </span>
              </div>
            ))}
          </div>
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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    basePrice: "",
    isActive: true,
  });

  useEffect(() => {
    loadServices();
  }, []);

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

  const handleCreateService = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await apiClient.post("/api/admin/services", {
        ...formData,
        basePrice: formData.basePrice ? parseFloat(formData.basePrice) : null,
      });
      toast.success("Service created successfully!");
      setFormData({ name: "", slug: "", description: "", basePrice: "", isActive: true });
      setShowCreateForm(false);
      loadServices();
    } catch (err) {
      console.error("Create service error:", err);
      toast.error(err.response?.data?.message || "Failed to create service");
    } finally {
      setCreating(false);
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
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <Plus size={18} />
          {showCreateForm ? "Cancel" : "Create Service"}
        </button>
      </header>

      {showCreateForm && (
        <div className="dash-card fade-in-up fade-in-delay-sm" style={{ marginBottom: "24px" }}>
          <h3 className="dash-card-title">Create New Service</h3>
          <form onSubmit={handleCreateService}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label className="dash-label">Name *</label>
                <input
                  type="text"
                  className="dash-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
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
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="dash-label">Description</label>
                <textarea
                  className="dash-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
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
                />
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
            </div>
            <button type="submit" className="btn" disabled={creating}>
              {creating ? "Creating..." : "Create Service"}
            </button>
          </form>
        </div>
      )}

      <div className="dash-grid">
        {services.length === 0 ? (
          <div className="dash-empty-state">
            <Package size={48} className="dash-empty-icon" />
            <p className="dash-empty-text">No services yet</p>
            <p className="muted">Create a service to get started</p>
          </div>
        ) : (
          services.map((service) => (
            <div className="dash-card" key={service.id}>
              <div className="dash-card-header">
                <Package size={20} className="dash-card-icon" />
                <div style={{ flex: 1 }}>
                  <h3 className="dash-card-title">{service.name}</h3>
                  <p className="muted" style={{ fontSize: "13px", marginTop: "4px" }}>
                    {service.slug}
                  </p>
                </div>
                <span className={`dash-status-pill dash-status-pill-${service.isActive ? "active" : "inactive"}`}>
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="dash-card-content">
                {service.description && (
                  <p className="muted" style={{ marginBottom: "12px" }}>{service.description}</p>
                )}
                <div className="dash-info-row">
                  <span className="dash-info-label">Base Price</span>
                  <span className="dash-info-value">
                    {service.basePrice ? `$${service.basePrice.toFixed(2)}` : "Not set"}
                  </span>
                </div>
                <div className="dash-info-row">
                  <span className="dash-info-label">Options</span>
                  <span className="dash-info-value">{service.options?.length || 0}</span>
                </div>
                <div className="dash-info-row">
                  <span className="dash-info-label">Bookings</span>
                  <span className="dash-info-value">{service._count?.bookings || 0}</span>
                </div>
                <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                  <button
                    className="btn btn-sm outline"
                    onClick={() => handleToggleActive(service)}
                  >
                    {service.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
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
        apiClient.get("/api/admin/analytics/overview"),
        apiClient.get("/api/admin/analytics/bookings"),
        apiClient.get("/api/admin/analytics/revenue"),
        apiClient.get("/api/admin/analytics/workers"),
        apiClient.get("/api/admin/analytics/services"),
      ]);

      setOverview(overviewRes.data);
      setBookings(bookingsRes.data);
      setRevenue(revenueRes.data);
      setWorkers(workersRes.data);
      setServices(servicesRes.data);
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
              <p className="stat-val">{overview.bookings.total}</p>
              <p className="stat-label">Total Bookings</p>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon-wrap" style={{ background: "#dbeafe" }}>
              <CheckCircle2 size={22} strokeWidth={2} />
            </div>
            <div className="dash-stat-content">
              <p className="stat-val">{overview.bookings.completed}</p>
              <p className="stat-label">Completed</p>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon-wrap" style={{ background: "#dcfce7" }}>
              <DollarSign size={22} strokeWidth={2} />
            </div>
            <div className="dash-stat-content">
              <p className="stat-val">${overview.revenue.total.toFixed(2)}</p>
              <p className="stat-label">Total Revenue</p>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon-wrap" style={{ background: "#fef3c7" }}>
              <TrendingUp size={22} strokeWidth={2} />
            </div>
            <div className="dash-stat-content">
              <p className="stat-val">${overview.revenue.averageBookingValue.toFixed(2)}</p>
              <p className="stat-label">Avg Booking Value</p>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon-wrap" style={{ background: "#e0e7ff" }}>
              <Briefcase size={22} strokeWidth={2} />
            </div>
            <div className="dash-stat-content">
              <p className="stat-val">{overview.workers.active}</p>
              <p className="stat-label">Active Workers</p>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon-wrap" style={{ background: "#fce7f3" }}>
              <Package size={22} strokeWidth={2} />
            </div>
            <div className="dash-stat-content">
              <p className="stat-val">{overview.services.active}</p>
              <p className="stat-label">Active Services</p>
            </div>
          </div>
        </div>
      )}

      {revenue && (
        <div className="dash-card fade-in-up fade-in-delay-md" style={{ marginTop: "24px" }}>
          <div className="dash-card-header">
            <DollarSign size={20} className="dash-card-icon" />
            <h3 className="dash-card-title">Revenue Analytics</h3>
          </div>
          <div className="dash-card-content">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              <div>
                <p className="muted" style={{ fontSize: "13px", marginBottom: "4px" }}>Today</p>
                <p style={{ fontSize: "20px", fontWeight: 600 }}>${revenue.summary.today.toFixed(2)}</p>
              </div>
              <div>
                <p className="muted" style={{ fontSize: "13px", marginBottom: "4px" }}>This Week</p>
                <p style={{ fontSize: "20px", fontWeight: 600 }}>${revenue.summary.thisWeek.toFixed(2)}</p>
              </div>
              <div>
                <p className="muted" style={{ fontSize: "13px", marginBottom: "4px" }}>This Month</p>
                <p style={{ fontSize: "20px", fontWeight: 600 }}>${revenue.summary.thisMonth.toFixed(2)}</p>
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
                        <span className="dash-table-cell-main">{item.serviceName}</span>
                        <span className="dash-table-cell">{item.bookingCount}</span>
                        <span className="dash-table-cell" style={{ fontWeight: 600 }}>
                          ${item.revenue.toFixed(2)}
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
            <div style={{ marginBottom: "16px", display: "flex", gap: "16px" }}>
              <div>
                <p className="muted" style={{ fontSize: "13px" }}>Avg Completion Rate</p>
                <p style={{ fontSize: "18px", fontWeight: 600 }}>{workers.summary.averageCompletionRate}%</p>
              </div>
              <div>
                <p className="muted" style={{ fontSize: "13px" }}>Total Completed Jobs</p>
                <p style={{ fontSize: "18px", fontWeight: 600 }}>{workers.summary.totalCompletedJobs}</p>
              </div>
            </div>
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
                    <span className="dash-table-cell-main">{worker.workerName}</span>
                    <span className="dash-table-cell">{worker.totalJobs}</span>
                    <span className="dash-table-cell">{worker.completedJobs}</span>
                    <span className="dash-table-cell">
                      <span className={`dash-status-pill ${worker.completionRate >= 80 ? "dash-status-pill-active" : ""}`}>
                        {worker.completionRate}%
                      </span>
                    </span>
                    <span className="dash-table-cell" style={{ fontWeight: 600 }}>
                      ${worker.revenue.toFixed(2)}
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
                    <span className="dash-table-cell-main">{service.serviceName}</span>
                    <span className="dash-table-cell">{service.totalBookings}</span>
                    <span className="dash-table-cell">{service.completedBookings}</span>
                    <span className="dash-table-cell" style={{ fontWeight: 600 }}>
                      ${service.revenue.toFixed(2)}
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

      {bookings && (
        <div className="dash-card fade-in-up fade-in-delay-md" style={{ marginTop: "24px" }}>
          <div className="dash-card-header">
            <Calendar size={20} className="dash-card-icon" />
            <h3 className="dash-card-title">Booking Analytics</h3>
          </div>
          <div className="dash-card-content">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              <div>
                <p className="muted" style={{ fontSize: "13px", marginBottom: "4px" }}>Today</p>
                <p style={{ fontSize: "20px", fontWeight: 600 }}>{bookings.summary.today}</p>
              </div>
              <div>
                <p className="muted" style={{ fontSize: "13px", marginBottom: "4px" }}>This Week</p>
                <p style={{ fontSize: "20px", fontWeight: 600 }}>{bookings.summary.thisWeek}</p>
              </div>
              <div>
                <p className="muted" style={{ fontSize: "13px", marginBottom: "4px" }}>This Month</p>
                <p style={{ fontSize: "20px", fontWeight: 600 }}>{bookings.summary.thisMonth}</p>
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
