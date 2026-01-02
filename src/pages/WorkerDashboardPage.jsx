import React, { useEffect, useState } from "react";
import apiClient from "../lib/api.js";
import toast from "react-hot-toast";
import { PageWrapper } from "../components/page-wrapper.jsx";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  PlayCircle,
  XCircle,
  CheckCircle,
  AlertCircle,
  Upload,
  FileText,
  Shield,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";

export function WorkerDashboardPage() {
  const { profile, user, role } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [application, setApplication] = useState(null);
  const [activeTab, setActiveTab] = useState("jobs");
  const [grouped, setGrouped] = useState({
    assigned: [],
    accepted: [],
    inProgress: [],
    completed: [],
    cancelled: [],
  });
  const [stats, setStats] = useState({
    total: 0,
    assigned: 0,
    accepted: 0,
    inProgress: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(null);

  useEffect(() => {
    if (role === 'WORKER') {
      loadBookings();
      loadDocuments();
    } else {
      loadApplicationStatus();
      setLoading(false);
    }
  }, [role]);

  const loadBookings = async () => {
    try {
      const res = await apiClient.get("/api/worker/bookings");
      setBookings(res.data.bookings || []);
      setGrouped(res.data.grouped || {
        assigned: [],
        accepted: [],
        inProgress: [],
        completed: [],
        cancelled: [],
      });
      setStats(res.data.stats || {
        total: 0,
        assigned: 0,
        accepted: 0,
        inProgress: 0,
        completed: 0,
      });
    } catch (err) {
      console.error("Load bookings error:", err);
      toast.error(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const res = await apiClient.get("/api/worker/documents");
      setDocuments(res.data || []);
    } catch (err) {
      console.error("Load documents error:", err);
    }
  };

  const loadApplicationStatus = async () => {
    try {
      const email = profile?.email || user?.email;
      if (!email) return;
      
      const res = await apiClient.get(`/api/worker-applications?email=${email}`);
      if (res.data) {
        setApplication(res.data);
      }
    } catch (err) {
      console.error("Load application status error:", err);
    }
  };

  const handleDocumentUpload = async (type, file) => {
    if (!file) return;

    setUploadingDoc(type);
    try {
      // TODO: Upload to Supabase Storage and get URL
      // For now, use a placeholder URL
      const fileUrl = URL.createObjectURL(file);

      await apiClient.post("/api/worker/documents", {
        type,
        fileUrl,
      });

      toast.success(`${type === 'WORK_AUTH' ? 'Work Authorization' : type === 'TAX' ? 'Tax Document' : 'ID'} uploaded successfully`);
      loadDocuments();
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message || "Failed to upload document");
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleAction = async (bookingId, action) => {
    setActionLoading(bookingId);
    try {
      await apiClient.patch(`/api/worker/bookings/${bookingId}/${action}`);
      toast.success(`Booking ${action}ed successfully!`);
      loadBookings();
    } catch (err) {
      console.error(`${action} booking error:`, err);
      toast.error(err.response?.data?.message || `Failed to ${action} booking`);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <PageWrapper>
        <section className="section" style={{ textAlign: "center" }}>
          <h2>Loading Worker Dashboard...</h2>
        </section>
      </PageWrapper>
    );
  }

  // Show application status if not WORKER
  if (role !== 'WORKER') {
    return (
      <PageWrapper>
        <section className="section dash-shell">
          <div className="dash-layout">
            <main className="dash-main">
              <div className="dash-main-inner fade-in-up">
                <div className="dash-card">
                  <div className="dash-card-header">
                    <CheckCircle size={20} className="dash-card-icon" />
                    <h3 className="dash-card-title">Application Status</h3>
                  </div>
                  <div className="dash-card-content">
                    {application?.status === 'PENDING' && (
                      <div style={{ textAlign: "center", padding: "40px" }}>
                        <AlertCircle size={48} style={{ color: "#f59e0b", marginBottom: "16px" }} />
                        <h3 style={{ marginBottom: "8px" }}>Waiting for Admin Approval</h3>
                        <p className="muted">Your worker application is being reviewed. You'll be notified once it's approved.</p>
                        <p className="muted" style={{ marginTop: "8px", fontSize: "14px" }}>
                          Status: <strong>PENDING</strong>
                        </p>
                      </div>
                    )}
                    {application?.status === 'REJECTED' && (
                      <div style={{ textAlign: "center", padding: "40px" }}>
                        <XCircle size={48} style={{ color: "#dc2626", marginBottom: "16px" }} />
                        <h3 style={{ marginBottom: "8px" }}>Application Rejected</h3>
                        <p className="muted">Your worker application was not approved at this time.</p>
                        <p className="muted" style={{ marginTop: "8px", fontSize: "14px" }}>
                          Status: <strong>REJECTED</strong>
                        </p>
                      </div>
                    )}
                    {application?.status === 'APPROVED' && (
                      <div style={{ textAlign: "center", padding: "40px" }}>
                        <CheckCircle size={48} style={{ color: "#10b981", marginBottom: "16px" }} />
                        <h3 style={{ marginBottom: "8px" }}>Application Approved!</h3>
                        <p className="muted">Your application has been approved. Please refresh the page to access the worker dashboard.</p>
                      </div>
                    )}
                    {!application && (
                      <div style={{ textAlign: "center", padding: "40px" }}>
                        <Briefcase size={48} style={{ color: "#6b7280", marginBottom: "16px" }} />
                        <h3 style={{ marginBottom: "8px" }}>No Application Found</h3>
                        <p className="muted">You haven't submitted a worker application yet.</p>
                        <button 
                          className="btn" 
                          onClick={() => window.location.href = "/apply/worker"}
                          style={{ marginTop: "16px" }}
                        >
                          Apply as Worker
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </section>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <section className="section dash-shell">
        <div className="dash-layout">
          {/* Sidebar */}
          <aside className="dash-sidebar">
            <div className="dash-profile">
              <div className="dash-avatar" style={{ background: "#3b82f6" }}>
                <Briefcase size={24} />
              </div>
              <div>
                <p className="dash-name">{profile?.fullName || user?.email?.split('@')[0]}</p>
                <p className="dash-email">Worker</p>
              </div>
            </div>

            <nav className="dash-nav">
              <button
                className={`dash-nav-item ${activeTab === "jobs" ? "is-active" : ""}`}
                onClick={() => setActiveTab("jobs")}
              >
                <Briefcase size={20} />
                <span>Jobs</span>
              </button>
              <button
                className={`dash-nav-item ${activeTab === "onboarding" ? "is-active" : ""}`}
                onClick={() => setActiveTab("onboarding")}
              >
                <CheckCircle size={20} />
                <span>Onboarding</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="dash-main">
            <div className="dash-main-inner fade-in-up">
              <header className="dash-hero-row fade-in-up">
                <div>
                  <h1 className="dash-title">Worker Dashboard</h1>
                  <p className="muted dash-subtitle">
                    Welcome back, {profile?.fullName || "Worker"}! Manage your assigned jobs.
                  </p>
                </div>
              </header>

              {activeTab === "jobs" && (
                <>
              {/* Stats */}
              <div className="dash-stat-grid fade-in-up fade-in-delay-sm">
                <div className="dash-stat-card">
                  <div className="dash-stat-icon-wrap">
                    <Briefcase size={22} strokeWidth={2} />
                  </div>
                  <div className="dash-stat-content">
                    <p className="stat-val">{stats.total}</p>
                    <p className="stat-label">Total Jobs</p>
                  </div>
                </div>
                <div className="dash-stat-card">
                  <div className="dash-stat-icon-wrap" style={{ background: "#fef3c7" }}>
                    <Clock size={22} strokeWidth={2} />
                  </div>
                  <div className="dash-stat-content">
                    <p className="stat-val">{stats.assigned}</p>
                    <p className="stat-label">Assigned</p>
                  </div>
                </div>
                <div className="dash-stat-card">
                  <div className="dash-stat-icon-wrap" style={{ background: "#dbeafe" }}>
                    <CheckCircle size={22} strokeWidth={2} />
                  </div>
                  <div className="dash-stat-content">
                    <p className="stat-val">{stats.accepted}</p>
                    <p className="stat-label">Accepted</p>
                  </div>
                </div>
                <div className="dash-stat-card">
                  <div className="dash-stat-icon-wrap" style={{ background: "#dcfce7" }}>
                    <PlayCircle size={22} strokeWidth={2} />
                  </div>
                  <div className="dash-stat-content">
                    <p className="stat-val">{stats.inProgress}</p>
                    <p className="stat-label">In Progress</p>
                  </div>
                </div>
                <div className="dash-stat-card">
                  <div className="dash-stat-icon-wrap" style={{ background: "#dcfce7" }}>
                    <CheckCircle2 size={22} strokeWidth={2} />
                  </div>
                  <div className="dash-stat-content">
                    <p className="stat-val">{stats.completed}</p>
                    <p className="stat-label">Completed</p>
                  </div>
                </div>
              </div>

              {/* Assigned Jobs */}
              {grouped.assigned.length > 0 && (
                <div className="dash-card fade-in-up fade-in-delay-md" style={{ marginTop: "24px" }}>
                  <div className="dash-card-header">
                    <Clock size={20} className="dash-card-icon" />
                    <h3 className="dash-card-title">Assigned Jobs ({grouped.assigned.length})</h3>
                  </div>
                  <div className="dash-list">
                    {grouped.assigned.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onAction={handleAction}
                        actionLoading={actionLoading}
                        showActions={["accept", "reject"]}
                        formatDate={formatDate}
                        formatTime={formatTime}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Accepted Jobs */}
              {grouped.accepted.length > 0 && (
                <div className="dash-card fade-in-up fade-in-delay-md" style={{ marginTop: "24px" }}>
                  <div className="dash-card-header">
                    <CheckCircle size={20} className="dash-card-icon" />
                    <h3 className="dash-card-title">Accepted Jobs ({grouped.accepted.length})</h3>
                  </div>
                  <div className="dash-list">
                    {grouped.accepted.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onAction={handleAction}
                        actionLoading={actionLoading}
                        showActions={["start"]}
                        formatDate={formatDate}
                        formatTime={formatTime}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* In Progress Jobs */}
              {grouped.inProgress.length > 0 && (
                <div className="dash-card fade-in-up fade-in-delay-md" style={{ marginTop: "24px" }}>
                  <div className="dash-card-header">
                    <PlayCircle size={20} className="dash-card-icon" />
                    <h3 className="dash-card-title">In Progress ({grouped.inProgress.length})</h3>
                  </div>
                  <div className="dash-list">
                    {grouped.inProgress.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onAction={handleAction}
                        actionLoading={actionLoading}
                        showActions={["complete"]}
                        formatDate={formatDate}
                        formatTime={formatTime}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Jobs */}
              {grouped.completed.length > 0 && (
                <div className="dash-card fade-in-up fade-in-delay-md" style={{ marginTop: "24px" }}>
                  <div className="dash-card-header">
                    <CheckCircle2 size={20} className="dash-card-icon" />
                    <h3 className="dash-card-title">Completed Jobs ({grouped.completed.length})</h3>
                  </div>
                  <div className="dash-list">
                    {grouped.completed.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onAction={handleAction}
                        actionLoading={actionLoading}
                        showActions={[]}
                        formatDate={formatDate}
                        formatTime={formatTime}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {bookings.length === 0 && (
                <div className="dash-card fade-in-up fade-in-delay-md" style={{ marginTop: "24px" }}>
                  <div className="dash-empty-state">
                    <Briefcase size={48} className="dash-empty-icon" />
                    <p className="dash-empty-text">No assigned jobs yet</p>
                    <p className="muted">Jobs assigned by admins will appear here</p>
                  </div>
                </div>
              )}
                </>
              )}

              {activeTab === "onboarding" && (
                <div className="dash-card fade-in-up fade-in-delay-sm" style={{ marginTop: "24px" }}>
                  <div className="dash-card-header">
                    <CheckCircle size={20} className="dash-card-icon" />
                    <h3 className="dash-card-title">Onboarding Checklist</h3>
                  </div>
                  <div className="dash-card-content">
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {[
                        { type: 'WORK_AUTH', label: 'Work Authorization', icon: Shield, desc: 'Upload your work authorization document' },
                        { type: 'TAX', label: 'Tax Document', icon: FileText, desc: 'Upload your tax document (SIN card, T4, etc.)' },
                        { type: 'ID', label: 'Government ID', icon: User, desc: 'Upload a valid government-issued ID' },
                      ].map(({ type, label, icon: Icon, desc }) => {
                        const doc = documents.find(d => d.type === type);
                        const isUploading = uploadingDoc === type;

                        return (
                          <div
                            key={type}
                            style={{
                              padding: "16px",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between"
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                              <Icon size={24} style={{ color: doc ? "#10b981" : "#6b7280" }} />
                              <div>
                                <div style={{ fontWeight: 500 }}>{label}</div>
                                <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>{desc}</div>
                                {doc && (
                                  <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                                    Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                            {doc ? (
                              <CheckCircle size={20} style={{ color: "#10b981" }} />
                            ) : (
                              <label className="btn btn-sm" style={{ cursor: "pointer" }}>
                                {isUploading ? "Uploading..." : (
                                  <>
                                    <Upload size={16} /> Upload
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  style={{ display: "none" }}
                                  onChange={(e) => handleDocumentUpload(type, e.target.files[0])}
                                  disabled={isUploading}
                                />
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </section>
    </PageWrapper>
  );
}

function BookingCard({ booking, onAction, actionLoading, showActions, formatDate, formatTime }) {
  const customerName = booking.customer?.fullName || booking.guestName || "Guest";
  const customerEmail = booking.customer?.email || booking.guestEmail || "";
  const serviceName = booking.service?.name || booking.serviceName || "Service";
  const address = `${booking.addressLine}, ${booking.city}, ${booking.province}`;

  const getStatusBadge = (status) => {
    const badges = {
      ASSIGNED: { label: "Assigned", color: "#fef3c7", textColor: "#92400e" },
      ACCEPTED: { label: "Accepted", color: "#dbeafe", textColor: "#1e40af" },
      IN_PROGRESS: { label: "In Progress", color: "#dcfce7", textColor: "#166534" },
      COMPLETED: { label: "Completed", color: "#dcfce7", textColor: "#166534" },
      CANCELLED: { label: "Cancelled", color: "#fee2e2", textColor: "#991b1b" },
    };
    const badge = badges[status] || { label: status, color: "#f3f4f6", textColor: "#374151" };
    return (
      <span
        className="dash-status-pill"
        style={{ background: badge.color, color: badge.textColor }}
      >
        {badge.label}
      </span>
    );
  };

  const isLoading = actionLoading === booking.id;

  return (
    <div className="dash-list-item">
      <div className="dash-list-main" style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <span className="dash-list-title">{serviceName}</span>
            {booking.subService && (
              <span className="muted" style={{ fontSize: "14px", marginLeft: "8px" }}>
                - {booking.subService}
              </span>
            )}
            <div className="dash-list-meta" style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <User size={14} />
                <span>{customerName}</span>
                {customerEmail && <span className="muted">({customerEmail})</span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Calendar size={14} />
                <span>
                  {formatDate(booking.date)}
                  {booking.timeSlot && ` • ${booking.timeSlot}`}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={14} />
                <span>{address}</span>
              </div>
              {booking.notes && (
                <div style={{ marginTop: "4px" }}>
                  <span className="muted" style={{ fontSize: "13px" }}>
                    Notes: {booking.notes}
                  </span>
                </div>
              )}
              {booking.totalAmount && (
                <div style={{ marginTop: "4px" }}>
                  <span style={{ fontWeight: 600, fontSize: "14px" }}>
                    ${booking.totalAmount.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
            {getStatusBadge(booking.status)}
          </div>
        </div>
      </div>
      <div className="dash-list-actions" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {showActions.includes("accept") && (
          <button
            className="btn btn-sm"
            onClick={() => onAction(booking.id, "accept")}
            disabled={isLoading}
          >
            {isLoading ? "..." : (
              <>
                <CheckCircle size={16} />
                Accept
              </>
            )}
          </button>
        )}
        {showActions.includes("reject") && (
          <button
            className="btn btn-sm outline"
            onClick={() => {
              if (window.confirm("Are you sure you want to reject this job? It will be available for reassignment.")) {
                onAction(booking.id, "reject");
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? "..." : (
              <>
                <XCircle size={16} />
                Reject
              </>
            )}
          </button>
        )}
        {showActions.includes("start") && (
          <button
            className="btn btn-sm"
            onClick={() => onAction(booking.id, "start")}
            disabled={isLoading}
          >
            {isLoading ? "..." : (
              <>
                <PlayCircle size={16} />
                Start Job
              </>
            )}
          </button>
        )}
        {showActions.includes("complete") && (
          <button
            className="btn btn-sm"
            onClick={() => {
              if (window.confirm("Mark this job as completed?")) {
                onAction(booking.id, "complete");
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? "..." : (
              <>
                <CheckCircle2 size={16} />
                Complete
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

