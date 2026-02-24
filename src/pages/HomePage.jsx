// src/pages/HomePage.jsx - Redesigned with smooth, performant animations
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PageWrapper } from "../components/page-wrapper.jsx";
import { PostChoreModal } from "../components/PostChoreModal.jsx";
import CountryMap from "../components/CountryMap.jsx";
import { useIsMobile } from "../hooks/useIsMobile";
import { 
  ArrowRight, 
  Shield, 
  DollarSign, 
  MapPin, 
  CheckCircle2,
  Sparkles,
  Star,
  ThumbsUp,
} from "lucide-react";
import { WorkerCTACard } from "../components/WorkerCTACard.jsx";
import "../styles/home-square.css";

// Smooth animation variants - optimized for performance
const fadeInUp = {
  hidden: { 
    opacity: 0, 
    y: 30,
    transition: { duration: 0 }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] // Smooth, natural easing
    }
  }
};

const fadeInScale = {
  hidden: { 
    opacity: 0, 
    scale: 0.96,
    transition: { duration: 0 }
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export function HomePage() {
  const navigate = useNavigate();
  const [postChoreModalOpen, setPostChoreModalOpen] = useState(false);
  const isMobile = useIsMobile();

  const reviews = [
    { name: "Johnny Ho", time: "2 days ago", text: "The cleaners from Call the Cleaners were very professional, polite and timely. They left no spot left uncleaned, especially the bathroom and kitchen." },
    { name: "Eugene Shcherban", time: "2 days ago", text: "All went fine. Great service!" },
    { name: "Áine Hamilton", time: "2 days ago", text: "We were very happy with the service provided by call the cleaners, they were friendly efficient and reasonably priced. We get a regular fortnightly cl..." },
    { name: "Louise Rigby", time: "2 days ago", text: "My cleaner was so professional and worked really hard. She checked in at the end that I was happy and I was over the moon!" },
    { name: "Daniel Eyre", time: "3 days ago", text: "Very nice clean. Good job." },
    { name: "Lisa Schaup", time: "4 days ago", text: "We used Call the Cleaners for our end-of-lease clean in Randwick and couldn't be happier with the service — communication was great and we got our ful..." },
    { name: "Ceci Yu", time: "2 days ago", text: "I booked a general clean in Pyrmont. Very happy with the service." },
  ];

  const popularTasks = [
    { title: "Hassle-free snow clearing", subtitle: "Book weekly or one-time.", image: "https://images.unsplash.com/photo-1732645556313-841fed3ead13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbm93JTIwcmVtb3ZhbCUyMHdpbnRlcnxlbnwxfHx8fDE3NjgxMTI4MDR8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { title: "Laundry & folding", subtitle: "Fresh clothes with no effort.", image: "https://images.unsplash.com/photo-1604762434310-c6def6a3d844?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXVuZHJ5JTIwZm9sZGluZyUyMGNsZWFufGVufDF8fHx8MTc2ODExMjgwNHww&ixlib=rb-4.1.0&q=80&w=1080" },
    { title: "Deep kitchen reset", subtitle: "Grease, fridge, oven — done.", image: "https://images.unsplash.com/photo-1567767326925-e2047bf469d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwY2xlYW5pbmd8ZW58MXx8fHwxNzY4MTEyODA1fDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { title: "Move-out clean", subtitle: "Leave the keys, we'll handle it.", image: "https://images.unsplash.com/photo-1718066236069-a4d42a6436a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMGVtcHR5JTIwcm9vbXxlbnwxfHx8fDE3NjgxMTI4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { title: "Car inside & out", subtitle: "Showroom clean again.", image: "https://images.unsplash.com/photo-1761312834150-4beefff097a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3YXNoJTIwY2xlYW58ZW58MXx8fHwxNzY4MDYzNzc3fDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { title: "Basement reset", subtitle: "Declutter & reclaim space.", image: "https://images.unsplash.com/photo-1732900309946-7efe975d6ae1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbml6ZWQlMjBiYXNlbWVudHxlbnwxfHx8fDE3NjgxMTI4MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  ];

  const partners = [
    { name: "SGI", logo: "SGI" },
    { name: "SaskPower", logo: "SaskPower" },
    { name: "City of Regina", logo: "City of Regina" },
    { name: "Regina Public Schools", logo: "RPS" },
    { name: "University of Regina", logo: "U of R" },
    { name: "SaskTel", logo: "SaskTel" },
  ];

  const handleServiceClick = (service) => {
    navigate("/pricing-booking", { state: { service } });
  };

  return (
    <PageWrapper>
      <div className="home-square-page">
        {/* Hero Section */}
        <section className="square-hero">
          <div className="square-container">
            <div className="square-hero-grid">
              <motion.div 
                className="square-hero-text"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div 
                  className="square-hero-badge"
                  variants={fadeInUp}
                >
                  <span>Fresh to Saskatchewan • Committed to quality</span>
                </motion.div>
                <motion.h1 
                  className="square-hero-title"
                  variants={fadeInUp}
                >
                  Skip the chores. Life reimagined!
                </motion.h1>
                <motion.p 
                  className="square-hero-description"
                  variants={fadeInUp}
                >
                  Focus on what matters—ChorEscape takes care of the rest.
                </motion.p>
                <motion.div 
                  className="square-hero-actions"
                  variants={fadeInUp}
                >
                  <motion.button 
                    className="square-btn-primary"
                    onClick={() => navigate("/pricing-booking")}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    Book a Service
                  </motion.button>
                </motion.div>
                <motion.div 
                  className="square-hero-trust"
                  variants={fadeInUp}
                >
                  <div className="square-trust-stars">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: 1.1 + i * 0.05,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                      >
                        <Star size={18} fill="#FFB800" color="#FFB800" />
                      </motion.div>
                    ))}
                  </div>
                  <span className="square-trust-label">QUALITY FIRST</span>
                  <span className="square-trust-text">Building trust, one service at a time</span>
                </motion.div>
              </motion.div>
              <motion.div 
                className="square-hero-image"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1763026227930-ec2c91d4e7f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbmluZyUyMHNlcnZpY2UlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY4MDQ0Mjg4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Professional cleaning service" 
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <motion.section 
          className="square-reviews"
          initial="visible"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="square-container">
            {/* Review Section Header - Match "Need ideas?" style */}
            <motion.div 
              className="square-section-header"
              variants={fadeInUp}
            >
              <h2 className="square-section-title">Trusted by real people</h2>
              <p className="square-section-subtitle">
                Verified bookings • Honest reviews
              </p>
            </motion.div>
          </div>

          {/* Review Carousel */}
          <motion.div 
            className="square-reviews-scroll"
            variants={staggerContainer}
          >
            {[...reviews, ...reviews].map((review, idx) => (
              <ReviewCard
                key={idx}
                review={review}
                idx={idx}
                isMobile={isMobile}
              />
            ))}
          </motion.div>
        </motion.section>

        {/* Popular Tasks Section */}
        <SectionReveal className="square-section">
          <div className="square-container">
            <motion.div 
              className="square-section-header"
              variants={fadeInUp}
            >
              <h2 className="square-section-title">Need ideas?</h2>
              <p className="square-section-subtitle">
                Popular tasks people are booking this week
              </p>
            </motion.div>
            
            {isMobile ? (
              <MobileTaskCarousel
                tasks={popularTasks}
                onTaskClick={handleServiceClick}
              />
            ) : (
              <motion.div 
                className="square-grid-3"
                variants={staggerContainer}
              >
                {popularTasks.map((task, idx) => (
                  <TaskCard
                    key={idx}
                    task={task}
                    idx={idx}
                    onClick={() => handleServiceClick(task.title)}
                    isMobile={isMobile}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </SectionReveal>

        {/* Custom Chore CTA */}
        <SectionReveal className="square-cta-section">
          <div className="square-container">
            <motion.div 
              className="square-cta-card"
              variants={fadeInScale}
            >
              <div className="square-cta-content">
                <motion.h2 
                  className="square-cta-title"
                  variants={fadeInUp}
                >
                  Can't find what you're looking for?
                </motion.h2>
                <motion.p 
                  className="square-cta-subtitle"
                  variants={fadeInUp}
                >
                  Tell us what you need — we're here to help and learn what matters to you.
                </motion.p>
                <motion.button 
                  className="square-btn-primary square-btn-large"
                  onClick={() => setPostChoreModalOpen(true)}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Post Your Chore <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </SectionReveal>

        {/* How It Works */}
        <SectionReveal className="square-section" variant="alt">
          <div className="square-container">
            <motion.div 
              className="square-section-header"
              variants={fadeInUp}
            >
              <h2 className="square-section-title">How It Works</h2>
              <p className="square-section-subtitle">
                Book your service in three simple steps
              </p>
            </motion.div>
            
            <motion.div 
              className="square-steps-container"
              variants={staggerContainer}
            >
              {[
                { num: "1", icon: Sparkles, title: "Choose a service", desc: "Browse our services or describe what you need" },
                { num: "2", icon: CheckCircle2, title: "Pick a time", desc: "Select a date and time that works for you" },
                { num: "3", icon: ThumbsUp, title: "Relax", desc: "We handle it — you get your time back" },
              ].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <StepCard
                    key={idx}
                    step={step}
                    Icon={Icon}
                    idx={idx}
                    isMobile={isMobile}
                  />
                );
              })}
            </motion.div>
          </div>
        </SectionReveal>

        {/* Why Choose */}
        <SectionReveal className="square-section square-section-alt">
          <div className="square-container">
            <motion.div 
              className="square-section-header"
              variants={fadeInUp}
            >
              <h2 className="square-section-title">Why Choose ChorEscape</h2>
              <p className="square-section-subtitle">
                A fresh approach built on transparency and reliability
              </p>
            </motion.div>
            
            <motion.div 
              className="square-benefits-grid"
              variants={staggerContainer}
            >
              {[
                { icon: Shield, title: "Carefully Selected", desc: "We handpick our service providers and verify their credentials" },
                { icon: DollarSign, title: "Honest Pricing", desc: "No surprises. What you see is what you pay — upfront and clear" },
                { icon: MapPin, title: "Growing Locally", desc: "Building our network in Saskatchewan with quality, not quantity" },
                { icon: ThumbsUp, title: "Your Satisfaction Matters", desc: "We're here to help. If something's not right, we'll fix it" },
              ].map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <BenefitCard
                    key={idx}
                    benefit={benefit}
                    Icon={Icon}
                    idx={idx}
                    isMobile={isMobile}
                  />
                );
              })}
            </motion.div>
          </div>
        </SectionReveal>

        {/* Worker CTA */}
        <SectionReveal className="square-section">
          <div className="square-container">
            <WorkerCTACard variant="default" />
          </div>
        </SectionReveal>
      
        {/* Worldwide Section */}
        <SectionReveal className="square-section">
          <div className="square-container">
            <motion.div 
              className="square-section-header"
              variants={fadeInUp}
            >
              <h2 className="square-section-title">Growing Our Reach</h2>
              <p className="square-section-subtitle">
                Starting in Saskatchewan, expanding to serve more communities
              </p>
            </motion.div>
            
            <motion.div 
              className="square-worldwide-grid"
              variants={staggerContainer}
            >
              {[
                { country: "australia", flag: "🇦🇺", title: "Australia", location: "Sydney", desc: "Coming soon. We're expanding to bring quality services to Australian communities", stats: [{ value: "Coming", label: "Soon" }, { value: "Quality", label: "First" }] },
                { country: "canada", flag: "🇨🇦", title: "Canada", location: "Saskatchewan", desc: "Our home base. Starting here in Saskatchewan, building relationships with local service providers and communities", stats: [{ value: "New", label: "Startup" }, { value: "Local", label: "Focus" }], featured: true },
                { country: "uae", flag: "🇦🇪", title: "United Arab Emirates", location: "7 Emirates", desc: "Future expansion. We're planning to bring our transparent, quality-focused approach to the Emirates", stats: [{ value: "Future", label: "Plans" }, { value: "Quality", label: "Promise" }] },
              ].map((country, idx) => (
                <WorldwideCard
                  key={idx}
                  country={country}
                  idx={idx}
                  isMobile={isMobile}
                />
              ))}
            </motion.div>
          </div>
        </SectionReveal>

        {/* Partners section removed as requested */}
        {/* Final CTA */}
        <SectionReveal className="square-section">
          <div className="square-container">
            <motion.div 
              className="square-final-cta"
              variants={fadeInScale}
            >
              <motion.h2 
                className="square-final-cta-title"
                variants={fadeInUp}
              >
                Ready to get started?
              </motion.h2>
              <motion.p 
                className="square-final-cta-subtitle"
                variants={fadeInUp}
              >
                Be part of our journey. Let's make your life easier, together.
              </motion.p>
              <motion.button 
                className="square-btn-primary square-btn-large"
                onClick={() => navigate("/pricing-booking")}
                variants={fadeInUp}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Get started
              </motion.button>
            </motion.div>
          </div>
        </SectionReveal>
      </div>

      <PostChoreModal 
        isOpen={postChoreModalOpen} 
        onClose={() => setPostChoreModalOpen(false)} 
      />
    </PageWrapper>
  );
}

// Optimized Section Reveal Component
function SectionReveal({ children, className, variant }) {
  return (
    <motion.section
      className={`${className} ${variant === 'alt' ? 'square-section-alt' : ''}`}
      initial="visible"
      animate="visible"
      variants={staggerContainer}
    >
      {children}
    </motion.section>
  );
}

// Optimized Task Card
function TaskCard({ task, idx, onClick, isMobile }) {
  return (
    <motion.div
      className="square-card"
      initial="visible"
      animate="visible"
      variants={fadeInScale}
      transition={{ delay: idx * 0.05 }}
    >
      <div onClick={onClick}>
        <div className="square-card-image">
          <img src={task.image} alt={task.title} />
        </div>
        <div className="square-card-content">
          <h3 className="square-card-title">{task.title}</h3>
          <p className="square-card-subtitle">{task.subtitle}</p>
          <div className="square-card-cta">
            Book now <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Optimized Step Card
function StepCard({ step, Icon, idx, isMobile }) {
  return (
    <motion.div
      className="square-step-card"
      initial="visible"
      animate="visible"
      variants={fadeInUp}
      transition={{ delay: idx * 0.1 }}
    >
      <div className="square-step-indicator">
        <div className="square-step-number">{step.num}</div>
        {idx < 2 && !isMobile && (
          <div className="square-step-connector" />
        )}
      </div>
      <div className="square-step-content">
        <div className="square-step-icon-wrapper">
          <Icon className="square-step-icon" size={28} />
        </div>
        <h3 className="square-step-title">{step.title}</h3>
        <p className="square-step-description">{step.desc}</p>
      </div>
    </motion.div>
  );
}

// Optimized Benefit Card
function BenefitCard({ benefit, Icon, idx, isMobile }) {
  return (
    <motion.div
      className="square-benefit-card"
      initial="visible"
      animate="visible"
      variants={fadeInScale}
      transition={{ delay: idx * 0.08 }}
      whileHover={!isMobile ? { y: -8, transition: { duration: 0.2 } } : {}}
    >
      <div className="square-benefit-icon-wrapper">
        <Icon className="square-benefit-icon" size={28} />
      </div>
      <h3 className="square-benefit-title">{benefit.title}</h3>
      <p className="square-benefit-description">{benefit.desc}</p>
    </motion.div>
  );
}

// Optimized Worldwide Card
function WorldwideCard({ country, idx, isMobile }) {
  return (
    <motion.div
      className={`square-worldwide-card ${country.featured ? 'square-worldwide-card-featured' : ''}`}
      initial="visible"
      animate="visible"
      variants={fadeInScale}
      transition={{ delay: idx * 0.1 }}
      whileHover={!isMobile ? { y: -8, transition: { duration: 0.2 } } : {}}
    >
      <div className="square-worldwide-map-container">
        <CountryMap country={country.country} color="#0b5c28" />
        <div className="square-worldwide-map-overlay"></div>
        <div className={`square-worldwide-badge ${country.featured ? 'square-worldwide-badge-featured' : ''}`}>
          <span className="square-worldwide-flag">{country.flag}</span>
          <span className="square-worldwide-badge-text">{country.featured ? 'Launching' : 'Coming Soon'}</span>
        </div>
      </div>
      <div className="square-worldwide-card-content">
        <div className="square-worldwide-header">
          <h3 className="square-worldwide-title">{country.title}</h3>
          <p className="square-worldwide-location">
            <MapPin size={14} />
            {country.location}
          </p>
        </div>
        <p className="square-worldwide-description">{country.desc}</p>
        <div className="square-worldwide-stats">
          {country.stats.map((stat, statIdx) => (
            <div key={statIdx} className="square-worldwide-stat">
              <span className="square-worldwide-stat-value">{stat.value}</span>
              <span className="square-worldwide-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Optimized Review Card
function ReviewCard({ review, idx, isMobile }) {
  return (
    <motion.div
      className="square-review-card"
      initial="visible"
      animate="visible"
      variants={fadeInScale}
      transition={{ delay: (idx % 7) * 0.05 }}
      whileHover={!isMobile ? { 
        y: -4, 
        scale: 1.02,
        transition: { duration: 0.2 }
      } : {}}
    >
      <div onClick={() => window.open('https://www.google.com/maps/search/ChorEscape', '_blank')}>
        <div className="square-review-header">
          <div className="square-review-avatar">
            {review.name.charAt(0)}
          </div>
          <div className="square-review-info">
            <h4 className="square-review-name">{review.name}</h4>
            <p className="square-review-time">{review.time}</p>
          </div>
        </div>
        <div className="square-review-stars">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="#FFB800" color="#FFB800" />
          ))}
        </div>
        <p className="square-review-text">{review.text}</p>
      </div>
    </motion.div>
  );
}

// Mobile-only carousel for popular tasks
function MobileTaskCarousel({ tasks, onTaskClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartXRef = useRef(null);

  useEffect(() => {
    if (!tasks || tasks.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tasks.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [tasks]);

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current == null) return;
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;
    const threshold = 40;
    if (Math.abs(diff) > threshold) {
      setCurrentIndex((prev) => {
        if (diff < 0) {
          return (prev + 1) % tasks.length;
        }
        return (prev - 1 + tasks.length) % tasks.length;
      });
    }
    touchStartXRef.current = null;
  };

  const currentTask = tasks[currentIndex];

  return (
    <div
      className="square-mobile-task-carousel"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <TaskCard
        task={currentTask}
        idx={currentIndex}
        onClick={() => onTaskClick(currentTask.title)}
        isMobile={true}
      />
      <div className="square-mobile-task-dots">
        {tasks.map((_, idx) => (
          <span
            key={idx}
            className={
              "square-mobile-task-dot" +
              (idx === currentIndex ? " square-mobile-task-dot-active" : "")
            }
          />
        ))}
      </div>
    </div>
  );
}
