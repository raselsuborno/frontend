import React, { useEffect, useState } from "react";
import apiClient from "../lib/api.js";
import toast from "react-hot-toast";
import { PageWrapper } from "../components/page-wrapper.jsx";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Plus, Calendar, DollarSign, Tag, CheckCircle2, Clock, XCircle } from "lucide-react";

export function MyChoresPage() {
  const navigate = useNavigate();
  const [chores, setChores] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadChores = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await apiClient.get("/api/chores");
      setChores(data);
    } catch (err) {
      console.error("My chores error:", err);
      toast.error("Failed to load your chores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChores();
  }, []);

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "completed" || statusLower === "done") {
      return <CheckCircle2 size={16} />;
    } else if (statusLower === "pending" || statusLower === "in_progress") {
      return <Clock size={16} />;
    }
    return <XCircle size={16} />;
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
    <PageWrapper>
      <div className="my-chores-page">
        {/* Hero Section */}
        <section className="my-chores-hero fade-in-up">
          <div className="my-chores-hero-badge">
            <ClipboardList size={14} />
            <span>Track your posted chores</span>
          </div>
          <h1 className="my-chores-title">My Chores</h1>
          <p className="my-chores-subtitle">
            View and manage all the chores you've posted
          </p>
        </section>

        {/* Content Section */}
        <section className="my-chores-content fade-in-up fade-in-delay-sm">
          {loading ? (
            <div className="my-chores-empty">
              <div className="my-chores-empty-icon">
                <ClipboardList size={48} />
              </div>
              <p className="my-chores-empty-text">Loading your chores...</p>
            </div>
          ) : chores.length === 0 ? (
            <div className="my-chores-empty">
              <div className="my-chores-empty-icon">
                <ClipboardList size={64} />
              </div>
              <h3 className="my-chores-empty-title">No chores posted yet</h3>
              <p className="my-chores-empty-text">
                You haven't posted any chores yet. Post your first chore to get started!
              </p>
              <button 
                className="btn my-chores-empty-btn"
                onClick={() => navigate("/post-chore")}
              >
                <Plus size={18} />
                Post Your First Chore
              </button>
            </div>
          ) : (
            <div className="my-chores-grid">
              {chores.map((chore, idx) => (
                <div 
                  key={chore.id} 
                  className="my-chore-card fade-in-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="my-chore-card-header">
                    <h3 className="my-chore-card-title">{chore.title}</h3>
                    <div className={`my-chore-status my-chore-status-${chore.status?.toLowerCase()}`}>
                      {getStatusIcon(chore.status)}
                      <span>{chore.status}</span>
                    </div>
                  </div>

                  {chore.description && (
                    <p className="my-chore-description">{chore.description}</p>
                  )}

                  <div className="my-chore-details">
                    <div className="my-chore-detail-item">
                      <Tag size={16} />
                      <span>{chore.category}</span>
                    </div>
                    {chore.budget != null && (
                      <div className="my-chore-detail-item">
                        <DollarSign size={16} />
                        <span>Budget: ${chore.budget}</span>
                      </div>
                    )}
                    <div className="my-chore-detail-item">
                      <Calendar size={16} />
                      <span>{formatDate(chore.createdAt)}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageWrapper>
  );
}
