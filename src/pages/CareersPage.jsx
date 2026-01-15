// Cloudflare rebuild trigger



import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../lib/api.js";
import { PageWrapper } from "../components/page-wrapper.jsx";
import toast from "react-hot-toast";
import "../styles/unified-page-layout.css";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Sparkles, 
  User, 
  Mail, 
  FileText, 
  MessageSquare,
  ArrowRight,
  X,
  CheckCircle
} from "lucide-react";
import { WorkerCTACard } from "../components/WorkerCTACard.jsx";

export function CareersPage() {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    resume: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const jobs = [
    {
      id: 1,
      title: "Residential Cleaner",
      location: "Regina, SK",
      type: "Full-time",
      desc: "Responsible for providing top-quality residential cleaning services with attention to detail and professionalism.",
    },
    {
      id: 2,
      title: "Cleaning Supervisor",
      location: "Regina, SK",
      type: "Part-time",
      desc: "Oversee cleaning staff, ensure job quality, and coordinate client schedules. Leadership experience required.",
    },
    {
      id: 3,
      title: "Logistics & Supply Assistant",
      location: "Regina, SK",
      type: "Contract",
      desc: "Assist in product inventory, restocking supplies, and maintaining cleaning equipment for daily operations.",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("careers", { 
        ...form, 
        jobTitle: selectedJob,
        resumeUrl: form.resume 
      });
      toast.success("Application submitted successfully!");
      setForm({ name: "", email: "", resume: "", message: "" });
      setSelectedJob(null);
    } catch (err) {
      toast.error(err.message || err.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="unified-page">
        {/* Hero Section */}
        <motion.header 
          className="unified-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="unified-hero-content">
            <motion.div 
              className="unified-hero-badge"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Briefcase size={14} />
              <span>Join our growing team</span>
            </motion.div>
            <motion.h1 
              className="unified-hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Join Our Team
            </motion.h1>
            <motion.p 
              className="unified-hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Be part of ChorEscape — where teamwork meets excellence. Browse our openings and apply online below.
            </motion.p>
          
            {/* Worker Application CTA */}
            <motion.div 
              style={{ marginTop: "24px" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <WorkerCTACard variant="prominent" />
              </div>
            </motion.div>
          </div>
        </motion.header>

        {/* Job Listings */}
        <div className="unified-section">
        <section className="careers-jobs-section fade-in-up fade-in-delay-sm">
          <div className="careers-jobs-grid">
            {jobs.map((job, idx) => (
              <div 
                key={job.id} 
                className="careers-job-card fade-in-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="careers-job-header">
                  <h3 className="careers-job-title">{job.title}</h3>
                </div>
                <div className="careers-job-meta">
                  <div className="careers-job-meta-item">
                    <MapPin size={16} />
                    <span>{job.location}</span>
                  </div>
                  <div className="careers-job-meta-item">
                    <Clock size={16} />
                    <span>{job.type}</span>
                  </div>
                </div>
                <p className="careers-job-desc">{job.desc}</p>
                <button
                  className="btn careers-job-btn"
                  onClick={() => setSelectedJob(job.title)}
                >
                  Apply Now
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Application Form */}
        {selectedJob && (
          <section className="careers-form-section fade-in-up">
            <div className="careers-form-card">
              <div className="careers-form-header">
                <h3 className="careers-form-title">Apply for {selectedJob}</h3>
                <button
                  className="careers-form-close"
                  onClick={() => setSelectedJob(null)}
                  type="button"
                >
                  <X size={20} />
                </button>
              </div>

              <form className="careers-form" onSubmit={handleSubmit}>
                <div className="careers-form-group">
                  <label className="careers-form-label">
                    <User size={18} className="careers-form-label-icon" />
                    Full Name *
                  </label>
                  <input
                    className="careers-form-input"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="careers-form-group">
                  <label className="careers-form-label">
                    <Mail size={18} className="careers-form-label-icon" />
                    Email *
                  </label>
                  <input
                    type="email"
                    className="careers-form-input"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                  />
                </div>

                <div className="careers-form-group">
                  <label className="careers-form-label">
                    <FileText size={18} className="careers-form-label-icon" />
                    Resume Link *
                  </label>
                  <input
                    className="careers-form-input"
                    name="resume"
                    value={form.resume}
                    onChange={handleChange}
                    placeholder="https://drive.google.com/..."
                    required
                  />
                  <p className="careers-form-hint">Google Drive, Dropbox, or any shareable link</p>
                </div>

                <div className="careers-form-group">
                  <label className="careers-form-label">
                    <MessageSquare size={18} className="careers-form-label-icon" />
                    Why would you like to join ChorEscape?
                  </label>
                  <textarea
                    className="careers-form-textarea"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us why you're the perfect fit!"
                  />
                </div>

                <button
                  type="submit"
                  className="btn careers-form-submit"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Application"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>
            </div>
          </section>
        )}
        </div>
      </div>
    </PageWrapper>
  );
}
