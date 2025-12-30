// src/pages/ContactPage.jsx
import React, { useState } from "react";
import { PageWrapper } from "../components/page-wrapper.jsx";
import { 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  MessageCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "How quickly can I book a service?",
      answer: "Most services can be booked within 24-48 hours. Same-day bookings may be available depending on your location and service type."
    },
    {
      question: "Are your service providers insured?",
      answer: "Yes, all service providers are fully insured and background-checked for your safety and peace of mind."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "We offer a 100% satisfaction guarantee. If you're not happy with the service, we'll send someone back to make it right or provide a full refund."
    },
    {
      question: "Can I cancel or reschedule?",
      answer: "Yes, you can cancel or reschedule up to 24 hours before your appointment without any fees."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thanks for reaching out! We'll reply soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <PageWrapper>
      <div className="contact-page">
        {/* ========== HERO SECTION ========== */}
        <section className="contact-hero fade-in-up">
          <h1 className="contact-hero-title">Get in Touch</h1>
          <p className="contact-hero-subtitle">
            Have a question? We're here to help.
          </p>
          <div className="home-hero-badge">
            <Sparkles size={14} />
            <span>Trusted by 50,000+ users across Saskatchewan</span>
          </div>
        </section>

        {/* ========== MAIN CONTENT ========== */}
        <div className="contact-content fade-in-up fade-in-delay-sm">
          {/* Left Column - Contact Form */}
          <div className="contact-form-section">
            <div className="contact-form-card">
              <div className="contact-form-header">
                <MessageCircle size={20} className="contact-form-icon" />
                <h2 className="contact-form-title">Send us a message</h2>
              </div>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-group">
                  <label className="contact-label">Name</label>
              <input
                type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="contact-input"
                placeholder="Your full name"
                required
                  />
                </div>

                <div className="contact-form-group">
                  <label className="contact-label">Email</label>
              <input
                type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="contact-input"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="contact-form-group">
                  <label className="contact-label">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="contact-input"
                    placeholder="How can we help?"
                required
                  />
                </div>

                <div className="contact-form-group">
                  <label className="contact-label">Message</label>
              <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="contact-textarea"
                    placeholder="Tell us more about your inquiry..."
                    rows="5"
                required
                  />
                </div>

                <button type="submit" className="btn contact-submit-btn">
                  <Send size={18} />
              Send Message
            </button>
          </form>
        </div>
          </div>

          {/* Right Column - Contact Info & FAQ */}
          <div className="contact-info-section">
            {/* Contact Information */}
            <div className="contact-info-card">
              <h3 className="contact-info-title">Contact Information</h3>
              <div className="contact-info-list">
                <div className="contact-info-item">
                  <Mail size={18} className="contact-info-icon" />
                  <div>
                    <div className="contact-info-label">Email</div>
                    <a href="mailto:hello@chorescape.com" className="contact-info-value">
                      hello@chorescape.com
                    </a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <Phone size={18} className="contact-info-icon" />
                  <div>
                    <div className="contact-info-label">Phone</div>
                    <a href="tel:+15551234567" className="contact-info-value">
                      (555) 123-4567
                    </a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <MapPin size={18} className="contact-info-icon" />
                  <div>
                    <div className="contact-info-label">Office Address</div>
                    <div className="contact-info-value">
                      123 Service St, City, ST 12345
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Support */}
            <div className="contact-info-card">
              <h3 className="contact-info-title">Quick Support</h3>
              <p className="contact-info-text">
                For immediate assistance with an existing booking, please call our 24/7 support line.
              </p>
              <button className="btn outline contact-support-btn">
                <Phone size={16} />
                Call Support
              </button>
            </div>

            {/* Business Hours */}
            <div className="contact-info-card">
              <div className="contact-info-header">
                <Clock size={18} className="contact-info-icon" />
                <h3 className="contact-info-title">Business Hours</h3>
              </div>
              <div className="contact-hours-list">
                <div className="contact-hours-item">
                  <span className="contact-hours-day">Monday - Friday</span>
                  <span className="contact-hours-time">8 AM - 8 PM</span>
                </div>
                <div className="contact-hours-item">
                  <span className="contact-hours-day">Saturday</span>
                  <span className="contact-hours-time">9 AM - 6 PM</span>
                </div>
                <div className="contact-hours-item">
                  <span className="contact-hours-day">Sunday</span>
                  <span className="contact-hours-time">10 AM - 4 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== FAQ SECTION ========== */}
        <section className="contact-faq-section fade-in-up fade-in-delay-md">
          <div className="contact-faq-header">
            <h2 className="contact-faq-title">Frequently Asked Questions</h2>
          </div>

          <div className="contact-faq-list">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`contact-faq-item ${openFaq === idx ? "is-open" : ""}`}
              >
                <button
                  className="contact-faq-question"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span>{faq.question}</span>
                  {openFaq === idx ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="contact-faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
        </div>
      </section>
      </div>
    </PageWrapper>
  );
}
