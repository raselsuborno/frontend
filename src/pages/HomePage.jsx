// src/pages/HomePage.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageWrapper } from "../components/page-wrapper.jsx";
import { 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Shield, 
  DollarSign, 
  MapPin, 
  Star,
  Sparkles,
  X,
  Plus,
  Clock,
  Users,
  Award,
  Snowflake,
  Shirt,
  ChefHat,
  Package,
  Car,
  Home,
  CheckCircle
} from "lucide-react";
import toast from "react-hot-toast";

export function HomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!user;
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const modalRef = useRef(null);
  const searchWrapperRef = useRef(null);

  // Guest info for modal
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    postal: "",
  });

  // Custom chore state
  const [customChore, setCustomChore] = useState({
    title: "",
    category: "",
    budget: "",
    details: "",
  });

  // Suggestions for "Need ideas" section
  const suggestions = [
    { title: "Hassle-free snow clearing", caption: "Book weekly or one-time.", icon: Snowflake },
    { title: "Laundry & folding", caption: "Fresh clothes with no effort.", icon: Shirt },
    { title: "Deep kitchen reset", caption: "Grease, fridge, oven — done.", icon: ChefHat },
    { title: "Move-out clean", caption: "Leave the keys, we'll handle it.", icon: Package },
    { title: "Car inside & out", caption: "Showroom clean again.", icon: Car },
    { title: "Basement reset", caption: "Declutter & reclaim space.", icon: Home },
  ];

  // Reviews for social proof
  const reviews = [
    { 
      quote: "Absolutely phenomenal service! My home has never looked better. The team was professional, punctual, and paid attention to every detail. I'll definitely be booking again.", 
      name: "Sarah Mitchell", 
      tag: "Home Cleaning",
      rating: 5,
      timeAgo: "2 days ago",
      location: "San Francisco, CA"
    },
    { 
      quote: "Quick, efficient, and incredibly skilled. Fixed three issues in my apartment in under two hours. Pricing was transparent and fair. Highly recommend!", 
      name: "Marcus Johnson", 
      tag: "Handyman",
      rating: 5,
      timeAgo: "5 days ago",
      location: "Austin, TX"
    },
    { 
      quote: "This service is a game-changer! As a busy professional, having someone handle my laundry has given me back so much time. Everything comes back perfectly folded and fresh.", 
      name: "Emily Chen", 
      tag: "Laundry & Folding",
      rating: 5,
      timeAgo: "1 week ago",
      location: "Seattle, WA"
    },
    { 
      quote: "Best decision I made this winter. They show up early, clear everything perfectly, and I haven't had to shovel once. Worth every penny!", 
      name: "David Rodriguez", 
      tag: "Snow Removal",
      rating: 5,
      timeAgo: "1 week ago",
      location: "Denver, CO"
    },
    { 
      quote: "Made moving so much easier! They handled the entire cleaning while I focused on packing. Got my full deposit back thanks to their thorough work.", 
      name: "Jennifer Adams", 
      tag: "Move-out Clean",
      rating: 5,
      timeAgo: "2 weeks ago",
      location: "Boston, MA"
    },
    { 
      quote: "My car looks brand new again! They came to my office, detailed it while I worked, and the results were incredible. Interior and exterior are spotless.", 
      name: "Alex Thompson", 
      tag: "Car Detailing",
      rating: 5,
      timeAgo: "2 weeks ago",
      location: "Los Angeles, CA"
    },
  ];

  // Partners/Used by logos for partners section
  const partners = [
    { name: "SGI", logo: "SGI" },
    { name: "SaskPower", logo: "SaskPower" },
    { name: "City of Regina", logo: "City of Regina" },
    { name: "Regina Public Schools", logo: "RPS" },
    { name: "University of Regina", logo: "U of R" },
    { name: "SaskTel", logo: "SaskTel" },
  ];

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(e) {
      if (modalOpen && modalRef.current && !modalRef.current.contains(e.target)) {
        setModalOpen(false);
        setModalStep(1);
      }
    }

    function handleEsc(e) {
      if (e.key === "Escape" && modalOpen) {
        setModalOpen(false);
        setModalStep(1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [modalOpen]);

  // All services for search (combining residential and corporate services)
  const allServices = useMemo(() => [
    { id: "cleaning", title: "Cleaning", keywords: ["cleaning", "clean", "house cleaning", "apartment cleaning", "deep clean"] },
    { id: "maid", title: "Maid Service", keywords: ["maid", "housekeeping", "maid service", "regular cleaning"] },
    { id: "laundry", title: "Laundry Service", keywords: ["laundry", "washing", "folding", "clothes", "dry cleaning"] },
    { id: "lawn", title: "Lawn Care", keywords: ["lawn", "mowing", "yard", "grass", "landscaping", "gardening"] },
    { id: "handyman", title: "Handyman", keywords: ["handyman", "repair", "fix", "assembly", "mounting", "installation"] },
    { id: "reno", title: "Home Renovation", keywords: ["renovation", "renovate", "remodel", "home improvement", "construction"] },
    { id: "pest", title: "Pest Control", keywords: ["pest", "bugs", "insects", "rodent", "exterminator"] },
    { id: "snow", title: "Snow Removal", keywords: ["snow", "snow removal", "shoveling", "snow clearing", "winter"] },
    { id: "move", title: "Move-In / Move-Out", keywords: ["move", "moving", "move in", "move out", "packing"] },
    { id: "airbnb", title: "Vacation Home / Airbnb", keywords: ["airbnb", "vacation", "short term rental", "turnover"] },
    { id: "auto", title: "Automotive", keywords: ["car", "automotive", "detailing", "car wash", "tire", "oil change"] },
    { id: "trades", title: "Heating, Cooling & Plumbing", keywords: ["plumbing", "heating", "cooling", "hvac", "electrician", "electric"] },
  ], []);

  // Fuzzy match function
  const fuzzyMatch = (query, text) => {
    const queryLower = query.toLowerCase().trim();
    const textLower = text.toLowerCase();
    
    // Exact match gets highest priority
    if (textLower === queryLower) return 100;
    
    // Starts with query
    if (textLower.startsWith(queryLower)) return 90;
    
    // Contains query
    if (textLower.includes(queryLower)) return 80;
    
    // Check if all characters of query exist in order in text
    let queryIndex = 0;
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        queryIndex++;
      }
    }
    if (queryIndex === queryLower.length) return 70;
    
    // Check individual words
    const queryWords = queryLower.split(/\s+/);
    const textWords = textLower.split(/\s+/);
    let matchCount = 0;
    for (const qWord of queryWords) {
      for (const tWord of textWords) {
        if (tWord.includes(qWord) || qWord.includes(tWord)) {
          matchCount++;
          break;
        }
      }
    }
    if (matchCount > 0) return 60 + (matchCount * 5);
    
    return 0;
  };

  const findBestMatch = (query) => {
    if (!query.trim()) return null;
    
    const matches = allServices.map(service => {
      // Check title match
      const titleScore = fuzzyMatch(query, service.title);
      
      // Check keywords match
      const keywordScores = service.keywords.map(keyword => fuzzyMatch(query, keyword));
      const maxKeywordScore = Math.max(...keywordScores, 0);
      
      // Take the best score
      const score = Math.max(titleScore, maxKeywordScore);
      
      return { service, score };
    }).filter(m => m.score > 0).sort((a, b) => b.score - a.score);
    
    return matches.length > 0 ? matches[0].service : null;
  };

  const handleServiceClick = (service) => {
    navigate("/pricing-booking", { state: { service } });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      const matchedService = findBestMatch(query);
      if (matchedService) {
        handleServiceClick(matchedService.title);
      } else {
        // If no match, navigate with the query as custom service
        handleServiceClick(query);
      }
    }
  };

  const handleSearchWrapperClick = () => {
    // Focus the input when clicking anywhere on the wrapper
    const input = searchWrapperRef.current?.querySelector('.home-search-input');
    if (input) {
      input.focus();
    }
  };

  const submitChore = () => {
    if (!customChore.title.trim()) {
      toast.error("Enter a title");
      return;
    }
    navigate("/pricing-booking", { state: { custom: customChore } });
    setModalOpen(false);
    setModalStep(1);
  };

  return (
    <PageWrapper>
      <div className="home-page">
        {/* ========== HERO SECTION ========== */}
        <section className="home-hero-section fade-in-up">
          <h1 className="home-hero-title">
          Give yourself a break & relax
            <br />
            <span className="home-hero-highlight">Let us handle the chores</span>
          </h1>

          <p className="home-hero-subtitle">
            Professional cleaning, handyman services, laundry & more — all booked in minutes.
          </p>

          <div className="home-hero-cta">
            <button 
              className="btn home-hero-btn-primary"
              onClick={() => navigate("/pricing-booking")}
            >
              Book a service
              <ArrowRight size={18} />
          </button>
            <button 
              className="btn outline home-hero-btn-secondary"
              onClick={() => navigate("/services")}
            >
              Browse services
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="home-search-container">
            <div 
              className="home-search-wrapper" 
              onClick={handleSearchWrapperClick}
              ref={searchWrapperRef}
            >
              <Search size={20} className="home-search-icon-left" />
              <input
                type="text"
                className="home-search-input"
                placeholder="What do you need done today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="home-search-popular">
              <span className="home-search-popular-label">Popular:</span>
              {["Cleaning", "Laundry", "Handyman", "Snow Removal"].map((service) => (
                    <button
                  key={service}
                  type="button"
                  className="home-search-popular-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchQuery(service);
                    handleServiceClick(service);
                  }}
                >
                  {service}
                    </button>
                  ))}
            </div>
            <div className="home-hero-badge">
              <Sparkles size={16} />
              <span>Trusted by 50,000+ users across Saskatchewan</span>
            </div>
          </form>

        </section>

        {/* ========== NEED IDEAS ========== */}
        <section className="home-section fade-in-up fade-in-delay-md">
          <div className="home-section-header">
            <h2 className="home-section-title">Need ideas?</h2>
            <p className="home-section-subtitle">
              Popular tasks people are booking this week
            </p>
          </div>

          <div className="home-suggestions-grid">
            {suggestions.map((s) => {
              const IconComponent = s.icon;
              return (
                <div 
                  key={s.title} 
                  className="home-suggestion-card"
                  onClick={() => handleServiceClick(s.title)}
                >
                  <div className="home-suggestion-icon">
                    <IconComponent size={32} />
                  </div>
                  <h3 className="home-suggestion-title">{s.title}</h3>
                  <p className="home-suggestion-caption">{s.caption}</p>
                  <button className="home-suggestion-cta">
                    Book now
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========== POST A CUSTOM CHORE ========== */}
        <section className="home-custom-chore-section fade-in-up fade-in-delay-lg">
          <div className="home-custom-wide" onClick={() => setModalOpen(true)}>
            <div className="custom-left-pattern">
              <svg className="task-anim" viewBox="0 0 260 150">
                <g className="anim-group">
                  <rect className="box b1" x="10" y="20" width="25" height="25" />
                  <rect className="box b2" x="10" y="60" width="25" height="25" />
                  <rect className="box b3" x="10" y="100" width="25" height="25" />

                  <path className="tick t1" d="M12 33 l7 7 l13 -13" />
                  <path className="tick t2" d="M12 73 l7 7 l13 -13" />
                  <path className="tick t3" d="M12 113 l7 7 l13 -13" />

                  <text className="label label1" x="60" y="38">Home Cleaning</text>
                  <text className="label label2" x="60" y="78">Snow Removal</text>
                  <text className="label label3" x="60" y="118">Laundry</text>
                </g>
              </svg>
            </div>

            <div className="custom-right-content">
              <p className="custom-eyebrow">Can't find what you're looking for?</p>
              <h3 className="custom-title">Post a Custom Chore</h3>
              <p className="custom-sub">
                Tell us what you need — we'll match you with the right helper ASAP.
              </p>

              <button className="custom-cta">Post Your Chore →</button>
            </div>
          </div>
        </section>

        {/* ========== HOW IT WORKS ========== */}
        <section className="home-section fade-in-up fade-in-delay-lg">
          <div className="home-section-header">
            <h2 className="home-section-title">How It Works</h2>
            <p className="home-section-subtitle">
              Book your service in three simple steps
            </p>
          </div>

          <div className="home-steps-grid">
            <div className="home-step-card">
              <div className="home-step-number">1</div>
              <h3 className="home-step-title">Choose a service</h3>
              <p className="home-step-desc">
                Browse our services or describe what you need
              </p>
            </div>

            <div className="home-step-card">
              <div className="home-step-number">2</div>
              <h3 className="home-step-title">Pick a time</h3>
              <p className="home-step-desc">
                Select a date and time that works for you
              </p>
            </div>

            <div className="home-step-card">
              <div className="home-step-number">3</div>
              <h3 className="home-step-title">Relax</h3>
              <p className="home-step-desc">
                We handle it — you get your time back
              </p>
            </div>
          </div>
        </section>

        {/* ========== WHY CHOOSE ========== */}
        <section className="home-section fade-in-up fade-in-delay-lg">
          <div className="home-section-header">
            <h2 className="home-section-title">Why Choose ChorEscape</h2>
            <p className="home-section-subtitle">
              Trusted, transparent, and always reliable
            </p>
          </div>

          <div className="home-features-grid">
            <div className="home-feature-card">
              <div className="home-feature-icon">
                <Shield size={24} />
              </div>
              <h3 className="home-feature-title">Vetted Professionals</h3>
              <p className="home-feature-desc">
                Background-checked and verified
              </p>
            </div>

            <div className="home-feature-card">
              <div className="home-feature-icon">
                <DollarSign size={24} />
              </div>
              <h3 className="home-feature-title">Transparent Pricing</h3>
              <p className="home-feature-desc">
                No hidden fees, ever
              </p>
            </div>

            <div className="home-feature-card">
              <div className="home-feature-icon">
                <MapPin size={24} />
              </div>
              <h3 className="home-feature-title">Local & Reliable</h3>
              <p className="home-feature-desc">
                Available in your area
              </p>
            </div>

            <div className="home-feature-card">
              <div className="home-feature-icon">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="home-feature-title">Satisfaction Guaranteed</h3>
              <p className="home-feature-desc">
                Not happy? We'll make it right
              </p>
            </div>
          </div>
        </section>

        {/* ========== USED BY ========== */}
        <section className="home-partners-section fade-in-up fade-in-delay-lg">
          <div className="home-section-header">
            <h2 className="home-section-title">Trusted by leading organizations</h2>
            <p className="home-section-subtitle">
              Serving businesses and institutions across Saskatchewan
            </p>
          </div>

          <div className="home-partners-grid">
            {partners.map((partner, idx) => (
              <div 
                key={idx} 
                className="home-partner-logo"
                title={partner.name}
              >
                {partner.logo}
              </div>
            ))}
          </div>
        </section>

        {/* ========== SOCIAL PROOF / REVIEWS ========== */}
        <section className="home-social-proof fade-in-up fade-in-delay-lg">
          <div className="home-section-header">
            <h2 className="home-section-title">What Our Customers Say</h2>
            <p className="home-section-subtitle">Real reviews from real people who got their time back.</p>
          </div>

          <div className="home-reviews-grid">
            {reviews.map((review, idx) => (
              <div 
                key={idx} 
                className="home-review-card fade-in-up"
                style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
              >
                <div className="home-review-quote-icon">"</div>
                <div className="home-review-stars">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
                <p className="home-review-quote">{review.quote}</p>
                <div className="home-review-tag">{review.tag}</div>
                <div className="home-review-author">
                  <div className="home-review-avatar">
                    <div className="home-review-avatar-initial">{review.name.charAt(0)}</div>
                  </div>
                  <div className="home-review-author-info">
                    <div className="home-review-author-name">
                      <strong>{review.name}</strong>
                      <CheckCircle size={14} className="home-review-verified" />
                    </div>
                    <div className="home-review-meta">
                      <span>{review.timeAgo}</span>
                      <span className="home-review-separator">·</span>
                      <span>{review.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========== GET STARTED CTA ========== */}
        <section className="home-cta-section fade-in-up fade-in-delay-lg">
          <div className="home-cta-content">
            <h2 className="home-cta-title">Ready to get started?</h2>
            <p className="home-cta-subtitle">
              Join thousands who've already reclaimed their time.
            </p>
            <button 
              className="btn home-cta-btn"
              onClick={() => navigate("/pricing-booking")}
            >
              Book your first service
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </div>

      {/* ========== POST CHORE MODAL ========== */}
      {modalOpen && (
        <div className="home-modal-overlay">
          <div className="home-modal-card" ref={modalRef}>
            <button
              className="home-modal-close"
              onClick={() => {
                setModalOpen(false);
                setModalStep(1);
              }}
            >
              <X size={20} />
            </button>

            {/* Step 1: Chore Details */}
            {modalStep === 1 && (
              <>
                <div className="home-modal-header">
                  <div className="home-modal-icon">
                    <Plus size={24} />
                  </div>
                  <h3 className="home-modal-title">Create a Custom Chore</h3>
                  <p className="home-modal-subtitle">Tell us what you need and we'll match you with the right professional</p>
                </div>

                <div className="home-modal-form">
                  <div className="home-modal-form-group">
                    <label className="home-modal-label">Chore Title *</label>
                <input
                  type="text"
                      placeholder="e.g., Deep clean entire house"
                  className="home-modal-input"
                  value={customChore.title}
                  onChange={(e) =>
                    setCustomChore({ ...customChore, title: e.target.value })
                  }
                />
                  </div>

                  <div className="home-modal-form-group">
                    <label className="home-modal-label">Category (optional)</label>
                <input
                  type="text"
                      placeholder="e.g., Cleaning, Handyman, Laundry"
                  className="home-modal-input"
                  value={customChore.category}
                  onChange={(e) =>
                    setCustomChore({ ...customChore, category: e.target.value })
                  }
                />
                  </div>

                  <div className="home-modal-form-group">
                    <label className="home-modal-label">Budget (optional)</label>
                <input
                  type="text"
                      placeholder="e.g., $100-200"
                  className="home-modal-input"
                  value={customChore.budget}
                  onChange={(e) =>
                    setCustomChore({ ...customChore, budget: e.target.value })
                  }
                />
                  </div>

                  <div className="home-modal-form-group">
                    <label className="home-modal-label">Details</label>
                <textarea
                      placeholder="Describe the chore in detail..."
                  className="home-modal-textarea"
                      rows="4"
                  value={customChore.details}
                  onChange={(e) =>
                    setCustomChore({ ...customChore, details: e.target.value })
                  }
                />
                  </div>

                {!isLoggedIn ? (
                  <button
                      className="btn home-modal-btn"
                    onClick={() => {
                        if (!customChore.title.trim()) {
                          toast.error("Please enter a chore title");
                          return;
                        }
                      setModalStep(2);
                    }}
                  >
                      Continue
                      <ArrowRight size={18} />
                  </button>
                ) : (
                    <button 
                      className="btn home-modal-btn" 
                      onClick={submitChore}
                    >
                    Post Chore
                      <ArrowRight size={18} />
                  </button>
                )}
                </div>
              </>
            )}

            {/* Step 2: Guest Info */}
            {!isLoggedIn && modalStep === 2 && (
              <>
                <div className="home-modal-header">
                  <div className="home-modal-icon">
                    <Users size={24} />
                  </div>
                  <h3 className="home-modal-title">Your Details</h3>
                  <p className="home-modal-subtitle">We'll follow up if needed</p>
                </div>

                <div className="home-modal-form">
                  <div className="home-modal-form-group">
                    <label className="home-modal-label">Full Name *</label>
                <input
                  type="text"
                      placeholder="Your full name"
                  className="home-modal-input"
                  value={guestInfo.name}
                  onChange={(e) =>
                    setGuestInfo({ ...guestInfo, name: e.target.value })
                  }
                />
                  </div>

                  <div className="home-modal-form-group">
                    <label className="home-modal-label">Email *</label>
                <input
                  type="email"
                      placeholder="your@email.com"
                  className="home-modal-input"
                  value={guestInfo.email}
                  onChange={(e) =>
                    setGuestInfo({ ...guestInfo, email: e.target.value })
                  }
                />
                  </div>

                  <div className="home-modal-form-group">
                    <label className="home-modal-label">Phone *</label>
                <input
                      type="tel"
                      placeholder="(306) 555-1234"
                  className="home-modal-input"
                  value={guestInfo.phone}
                  onChange={(e) =>
                    setGuestInfo({ ...guestInfo, phone: e.target.value })
                  }
                />
                  </div>

                  <div className="home-modal-form-group">
                    <label className="home-modal-label">Street Address</label>
                <input
                  type="text"
                      placeholder="123 Main St"
                  className="home-modal-input"
                  value={guestInfo.street}
                  onChange={(e) =>
                    setGuestInfo({ ...guestInfo, street: e.target.value })
                  }
                />
                  </div>

                  <div className="home-modal-form-row">
                    <div className="home-modal-form-group">
                      <label className="home-modal-label">City</label>
                <input
                  type="text"
                        placeholder="Regina"
                  className="home-modal-input"
                  value={guestInfo.city}
                  onChange={(e) =>
                    setGuestInfo({ ...guestInfo, city: e.target.value })
                  }
                />
                    </div>

                    <div className="home-modal-form-group">
                      <label className="home-modal-label">Postal Code</label>
                <input
                  type="text"
                        placeholder="S4P 0A1"
                  className="home-modal-input"
                  value={guestInfo.postal}
                  onChange={(e) =>
                    setGuestInfo({ ...guestInfo, postal: e.target.value })
                  }
                />
                    </div>
                  </div>

                <button
                    className="btn home-modal-btn"
                  onClick={() => {
                    if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
                        toast.error("Name, email & phone are required");
                        return;
                    }

                    navigate("/pricing-booking", {
                      state: {
                        custom: customChore,
                        guest: guestInfo,
                      },
                    });

                    setModalOpen(false);
                    setModalStep(1);
                  }}
                >
                  Post Chore
                    <ArrowRight size={18} />
                </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
