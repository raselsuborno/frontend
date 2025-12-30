// src/pages/AboutPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageWrapper } from "../components/page-wrapper.jsx";
import { 
  Heart, 
  Users, 
  Target, 
  Award,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from "lucide-react";

export function AboutPage() {
  const navigate = useNavigate();
  const [currentReview, setCurrentReview] = useState(0);

  const reviews = [
    { 
      quote: "ChorEscape has completely changed my life. I used to spend my entire weekend cleaning and doing laundry. Now I have time to actually enjoy my weekends with my family. The service is reliable, professional, and worth every penny.", 
      name: "Sarah Mitchell", 
      title: "Marketing Director",
      tag: "Home Cleaning",
      rating: 5,
      avatar: "SM"
    },
    { 
      quote: "As a busy professional, having someone handle my laundry has given me back so much time. Everything comes back perfectly folded and fresh. I can't imagine going back to doing it myself.", 
      name: "Emily Chen", 
      title: "Software Engineer",
      tag: "Laundry & Folding",
      rating: 5,
      avatar: "EC"
    },
    { 
      quote: "Best decision I made this winter. They show up early, clear everything perfectly, and I haven't had to shovel once. Worth every penny!", 
      name: "David Rodriguez", 
      title: "Business Owner",
      tag: "Snow Removal",
      rating: 5,
      avatar: "DR"
    },
    { 
      quote: "Made moving so much easier! They handled the entire cleaning while I focused on packing. Got my full deposit back thanks to their thorough work.", 
      name: "Jennifer Adams", 
      title: "Project Manager",
      tag: "Move-out Clean",
      rating: 5,
      avatar: "JA"
    },
  ];

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <PageWrapper>
      <div className="about-page">
        {/* ========== HERO SECTION ========== */}
        <section className="about-hero fade-in-up">
          <h1 className="about-hero-title">Helping you reclaim your time</h1>
          <p className="about-hero-subtitle">
            Life's too short to spend it on chores. ChorEscape connects you with 
            trusted professionals who handle the tasks you don't have time for.
          </p>
          <div className="home-hero-badge">
            <Sparkles size={14} />
            <span>Trusted by 50,000+ users across Saskatchewan</span>
          </div>
        </section>

        {/* ========== OUR STORY ========== */}
        <section className="about-section fade-in-up fade-in-delay-sm">
          <div className="about-story-card">
            <div className="about-story-header">
              <Sparkles size={24} className="about-story-icon" />
              <h2 className="about-story-title">Our Story</h2>
            </div>
            <div className="about-story-content">
              <p>
                We started ChorEscape because we believe everyone deserves more time 
                for what matters. Time with family. Time for hobbies. Time to simply relax.
              </p>
              <p>
                What began as a simple idea — connecting busy people with reliable help — 
                has grown into a community of thousands who trust us with their homes and their time.
              </p>
              <p>
                Today, we're proud to serve 50,000+ customers across the country, helping 
                them get their time back, one chore at a time.
              </p>
            </div>
          </div>
        </section>

        {/* ========== WHAT WE STAND FOR ========== */}
        <section className="about-section fade-in-up fade-in-delay-md">
          <div className="home-section-header">
            <h2 className="home-section-title">What We Stand For</h2>
          </div>

          <div className="home-features-grid">
            <div className="home-feature-card">
              <div className="home-feature-icon">
                <Heart size={24} />
              </div>
              <h3 className="home-feature-title">Customer First</h3>
              <p className="home-feature-desc">
                Your time and satisfaction are our top priorities
              </p>
            </div>

            <div className="home-feature-card">
              <div className="home-feature-icon">
                <Users size={24} />
              </div>
              <h3 className="home-feature-title">Trusted Professionals</h3>
              <p className="home-feature-desc">
                Every service provider is vetted and verified
              </p>
            </div>

            <div className="home-feature-card">
              <div className="home-feature-icon">
                <Target size={24} />
              </div>
              <h3 className="home-feature-title">Simple & Fast</h3>
              <p className="home-feature-desc">
                Book quality services in under 60 seconds
              </p>
            </div>

            <div className="home-feature-card">
              <div className="home-feature-icon">
                <Award size={24} />
              </div>
              <h3 className="home-feature-title">Quality Guaranteed</h3>
              <p className="home-feature-desc">
                Not satisfied? We'll make it right, no questions asked
              </p>
            </div>
          </div>
        </section>

        {/* ========== STATISTICS ========== */}
        <section className="home-stats-section fade-in-up fade-in-delay-lg">
          <div className="home-stats-grid">
            <div className="home-stat-card">
              <div className="home-stat-value">50K+</div>
              <div className="home-stat-label">Happy Customers</div>
            </div>
            <div className="home-stat-card">
              <div className="home-stat-value">98%</div>
              <div className="home-stat-label">Satisfaction Rate</div>
            </div>
            <div className="home-stat-card">
              <div className="home-stat-value">150+</div>
              <div className="home-stat-label">Cities Served</div>
            </div>
            <div className="home-stat-card">
              <div className="home-stat-value">24/7</div>
              <div className="home-stat-label">Support</div>
            </div>
          </div>
        </section>

        {/* ========== HEAR FROM OUR CUSTOMERS ========== */}
        <section className="about-section fade-in-up fade-in-delay-lg">
          <div className="home-section-header">
            <h2 className="home-section-title">Hear From Our Customers</h2>
          </div>

          <div className="about-review-container">
            <div className="about-review-card">
              <div className="about-review-quote-icon">"</div>
              <div className="about-review-stars">
                {[...Array(reviews[currentReview].rating)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="about-review-quote">{reviews[currentReview].quote}</p>
              <div className="about-review-tag">{reviews[currentReview].tag}</div>
              <div className="about-review-author">
                <div className="about-review-avatar">
                  <div className="about-review-avatar-initial">{reviews[currentReview].avatar}</div>
                </div>
                <div className="about-review-author-info">
                  <div className="about-review-author-name">
                    <strong>{reviews[currentReview].name}</strong>
                    <CheckCircle size={14} className="about-review-verified" />
                  </div>
                  <div className="about-review-author-title">{reviews[currentReview].title}</div>
                </div>
              </div>
            </div>

            <div className="about-review-navigation">
              <button 
                className="about-review-nav-btn" 
                onClick={prevReview}
                aria-label="Previous review"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="about-review-dots">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    className={`about-review-dot ${idx === currentReview ? "active" : ""}`}
                    onClick={() => setCurrentReview(idx)}
                    aria-label={`Go to review ${idx + 1}`}
                  />
                ))}
              </div>
              <button 
                className="about-review-nav-btn" 
                onClick={nextReview}
                aria-label="Next review"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* ========== CTA SECTION ========== */}
        <section className="home-cta-section fade-in-up fade-in-delay-lg">
          <div className="home-cta-content">
            <h2 className="home-cta-title">Ready to get started?</h2>
            <p className="home-cta-subtitle">
              Join thousands who've already reclaimed their time
            </p>
            <button 
              className="btn home-cta-btn"
              onClick={() => navigate("/pricing-booking")}
            >
              Book your first service
            </button>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
