import React, { useState } from "react";
import apiClient from "../lib/api.js";
import toast from "react-hot-toast";
import { PageWrapper } from "../components/page-wrapper.jsx";
import { Plus, Sparkles, FileText, DollarSign, Tag, ArrowRight } from "lucide-react";

export function PostChorePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Cleaning");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to post a chore.");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title for your chore.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(
        "/api/chores",
        {
          title: title.trim(),
          category,
          description: description.trim() || null,
          budget: budget ? Number(budget) : null,
        }
      );

      toast.success("Chore posted successfully! We'll review it and send you a quote soon.");
      
      // Reset form
      setTitle("");
      setCategory("Cleaning");
      setDescription("");
      setBudget("");
      
      // Redirect to My Chores page after a short delay
      setTimeout(() => {
        window.location.href = "/my-chores";
      }, 1500);
    } catch (err) {
      console.error("Post chore error:", err);
      toast.error(
        err.response?.data?.message || "Failed to post chore. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="post-chore-page">
        {/* Hero Section */}
        <section className="post-chore-hero fade-in-up">
          <div className="post-chore-hero-badge">
            <Sparkles size={14} />
            <span>Get help with any task</span>
          </div>
          <h1 className="post-chore-title">Post a Chore</h1>
          <p className="post-chore-subtitle">
            Describe what you need help with. Our team will review and match you with the right professional.
          </p>
        </section>

        {/* Form Section */}
        <section className="post-chore-form-section fade-in-up fade-in-delay-sm">
          <div className="post-chore-form-card">
            <form className="post-chore-form" onSubmit={handleSubmit}>
              <div className="post-chore-form-group">
                <label className="post-chore-label">
                  <FileText size={18} className="post-chore-label-icon" />
                  Title *
                </label>
                <input
                  className="post-chore-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Deep clean 2BR condo"
                  required
                />
              </div>

              <div className="post-chore-form-group">
                <label className="post-chore-label">
                  <Tag size={18} className="post-chore-label-icon" />
                  Category *
                </label>
                <select
                  className="post-chore-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Cleaning</option>
                  <option>Handyman</option>
                  <option>Furniture Assembly</option>
                  <option>Moving Help</option>
                  <option>Car Cleaning</option>
                  <option>Yard Work</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="post-chore-form-group">
                <label className="post-chore-label">Description</label>
                <textarea
                  className="post-chore-textarea"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="2 bedroom condo, balcony, inside fridge & oven..."
                />
              </div>

              <div className="post-chore-form-group">
                <label className="post-chore-label">
                  <DollarSign size={18} className="post-chore-label-icon" />
                  Budget (optional)
                </label>
                <input
                  className="post-chore-input"
                  type="number"
                  min="0"
                  step="1"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="120"
                />
              </div>

              <button 
                className="btn post-chore-submit-btn" 
                type="submit"
                disabled={loading}
              >
                {loading ? "Posting..." : "Post Chore"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
