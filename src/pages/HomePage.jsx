// src/pages/HomePage.jsx - Square-style Minimalist Landing Page
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring, useAnimationFrame } from "framer-motion";
import { PageWrapper } from "../components/page-wrapper.jsx";
import { PostChoreModal } from "../components/PostChoreModal.jsx";
import CountryMap from "../components/CountryMap.jsx";
import { AnimatedSection, AnimatedItem, AnimatedCard } from "../components/AnimatedSection.jsx";
import { ParallaxSection, ScrollReveal, ScrollProgress } from "../components/ParallaxSection.jsx";
import { ScrollAnimatedCard, ScrollAnimatedReview } from "../components/ScrollAnimatedCard.jsx";
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

export function HomePage() {
  const navigate = useNavigate();
  const [postChoreModalOpen, setPostChoreModalOpen] = useState(false);

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

  // Scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Hero image parallax - use global scroll for simplicity
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -150]);

  return (
    <PageWrapper>
      {/* Scroll Progress Bar */}
      <motion.div
        className="scroll-progress-bar"
        style={{ scaleX }}
      />
      <div className="home-square-page">
        {/* Hero Section - Edge to Edge */}
        <section className="square-hero">
          <div className="square-container">
            <div className="square-hero-grid">
              <motion.div 
                className="square-hero-text"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <motion.div 
                  className="square-hero-badge"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span>Fresh to Saskatchewan • Committed to quality</span>
                </motion.div>
                <motion.h1 
                  className="square-hero-title"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  Give yourself a break & relax
                </motion.h1>
                <motion.p 
                  className="square-hero-description"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  Let us handle the chores Professional cleaning, handyman services, laundry & more — all booked in minutes.
                </motion.p>
                <motion.div 
                  className="square-hero-actions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <motion.button 
                    className="square-btn-primary"
                    onClick={() => navigate("/pricing-booking")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Book a Service
                  </motion.button>
                </motion.div>
                <motion.div 
                  className="square-hero-trust"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="square-trust-stars">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 1 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
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
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ y: heroY }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1763026227930-ec2c91d4e7f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbmluZyUyMHNlcnZpY2UlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY4MDQ0Mjg4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Professional cleaning service" 
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Reviews Section - Edge to Edge Scroll */}
        <section className="square-reviews">
          <div className="square-reviews-scroll">
            {[...reviews, ...reviews].map((review, idx) => (
              <ScrollAnimatedReview
                key={idx} 
                idx={idx}
                className="square-review-card"
              >
                <div onClick={() => window.open('https://www.google.com/maps/search/ChorEscape', '_blank')}>
                <div className="square-review-header">
                    <motion.div 
                      className="square-review-avatar"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                    {review.name.charAt(0)}
                    </motion.div>
                  <div className="square-review-info">
                    <h4 className="square-review-name">{review.name}</h4>
                    <p className="square-review-time">{review.time}</p>
                  </div>
                </div>
                <div className="square-review-stars">
                  {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.3, delay: (idx % reviews.length) * 0.1 + i * 0.05 }}
                      >
                        <Star size={14} fill="#FFB800" color="#FFB800" />
                      </motion.div>
                  ))}
                </div>
                <p className="square-review-text">{review.text}</p>
              </div>
              </ScrollAnimatedReview>
            ))}
          </div>
        </section>

        {/* Popular Tasks - 3 Column Grid */}
        <AnimatedSection className="square-section" parallax={true} speed={0.2}>
          <div className="square-container">
            <AnimatedItem>
            <div className="square-section-header">
              <h2 className="square-section-title">Need ideas?</h2>
              <p className="square-section-subtitle">
                Popular tasks people are booking this week
              </p>
            </div>
            </AnimatedItem>
            
            <motion.div 
              className="square-grid-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {popularTasks.map((task, idx) => (
                <ScrollAnimatedCard
                  key={idx} 
                  idx={idx}
                  type="task"
                  className="square-card"
                  delay={idx * 0.1}
                >
                  <motion.div
                  onClick={() => handleServiceClick(task.title)}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                >
                  <div className="square-card-image">
                      <motion.img 
                        src={task.image} 
                        alt={task.title}
                        whileHover={{ scale: 1.15, rotate: idx % 2 === 0 ? 1 : -1 }}
                        transition={{ duration: 0.4 }}
                      />
                  </div>
                  <div className="square-card-content">
                      <motion.h3 
                        className="square-card-title"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {task.title}
                      </motion.h3>
                    <p className="square-card-subtitle">{task.subtitle}</p>
                      <motion.div 
                        className="square-card-cta"
                        whileHover={{ x: 5, scale: 1.05 }}
                      >
                      Book now <ArrowRight size={14} />
                      </motion.div>
                    </div>
                  </motion.div>
                </ScrollAnimatedCard>
              ))}
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Custom Chore CTA - Full Width */}
        <AnimatedSection className="square-cta-section">
          <div className="square-container">
            <motion.div 
              className="square-cta-card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="square-cta-content">
                <motion.h2 
                  className="square-cta-title"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Can't find what you're looking for?
                </motion.h2>
                <motion.p 
                  className="square-cta-subtitle"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Tell us what you need — we're here to help and learn what matters to you.
                </motion.p>
                <motion.button 
                  className="square-btn-primary square-btn-large"
                  onClick={() => setPostChoreModalOpen(true)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Post Your Chore <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* How It Works - 3 Column */}
        <AnimatedSection className="square-section" parallax={true} speed={0.15}>
          <div className="square-container">
            <AnimatedItem>
            <div className="square-section-header">
              <h2 className="square-section-title">How It Works</h2>
              <p className="square-section-subtitle">
                Book your service in three simple steps
              </p>
            </div>
            </AnimatedItem>
            
            <motion.div 
              className="square-steps-container"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
            >
              {[
                { num: "1", icon: Sparkles, title: "Choose a service", desc: "Browse our services or describe what you need" },
                { num: "2", icon: CheckCircle2, title: "Pick a time", desc: "Select a date and time that works for you" },
                { num: "3", icon: ThumbsUp, title: "Relax", desc: "We handle it — you get your time back" },
              ].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <ScrollAnimatedCard
                    key={idx}
                    idx={idx}
                    type="step"
                    className="square-step-card"
                    delay={idx * 0.2}
                  >
                    <motion.div
                      whileHover={{ y: -15, scale: 1.05, z: 50 }}
                    >
                      <div className="square-step-indicator">
                        <motion.div 
                          className="square-step-number"
                          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.15 }}
                          transition={{ duration: 0.5 }}
                        >
                          {step.num}
                        </motion.div>
                        {idx < 2 && (
                          <motion.div 
                            className="square-step-connector"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                          />
                        )}
              </div>
                      <div className="square-step-content">
                        <motion.div 
                          className="square-step-icon-wrapper"
                          whileHover={{ rotate: 360, scale: 1.15, y: -5 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Icon className="square-step-icon" size={28} />
                        </motion.div>
                        <motion.h3 
                          className="square-step-title"
                          whileHover={{ x: 5, scale: 1.05 }}
                        >
                          {step.title}
                        </motion.h3>
                        <p className="square-step-description">{step.desc}</p>
              </div>
                    </motion.div>
                  </ScrollAnimatedCard>
                );
              })}
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Why Choose - 4 Column */}
        <AnimatedSection className="square-section square-section-alt" parallax={true} speed={-0.1}>
          <div className="square-container">
            <AnimatedItem>
            <div className="square-section-header">
              <h2 className="square-section-title">Why Choose ChorEscape</h2>
              <p className="square-section-subtitle">
                A fresh approach built on transparency and reliability
              </p>
            </div>
            </AnimatedItem>
            
            <motion.div 
              className="square-benefits-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
            >
              {[
                { icon: Shield, title: "Carefully Selected", desc: "We handpick our service providers and verify their credentials" },
                { icon: DollarSign, title: "Honest Pricing", desc: "No surprises. What you see is what you pay — upfront and clear" },
                { icon: MapPin, title: "Growing Locally", desc: "Building our network in Saskatchewan with quality, not quantity" },
                { icon: ThumbsUp, title: "Your Satisfaction Matters", desc: "We're here to help. If something's not right, we'll fix it" },
              ].map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <ScrollAnimatedCard
                    key={idx}
                    idx={idx}
                    type="benefit"
                    className="square-benefit-card"
                    delay={idx * 0.15}
                  >
                    <motion.div
                      whileHover={{ y: -15, scale: 1.05, z: 50 }}
                    >
                      <motion.div 
                        className="square-benefit-icon-wrapper"
                        whileHover={{ rotate: [0, -15, 15, -15, 0], scale: 1.2, y: -5 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="square-benefit-icon" size={28} />
                      </motion.div>
                      <motion.h3 
                        className="square-benefit-title"
                        whileHover={{ x: 5, scale: 1.05 }}
                      >
                        {benefit.title}
                      </motion.h3>
                      <motion.p 
                        className="square-benefit-description"
                        whileHover={{ x: 3 }}
                      >
                        {benefit.desc}
                      </motion.p>
                    </motion.div>
                  </ScrollAnimatedCard>
                );
              })}
            </motion.div>
                </div>
        </AnimatedSection>

        {/* Worker CTA - Subtle Placement */}
        <AnimatedSection className="square-section square-section-alt">
          <div className="square-container">
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              <WorkerCTACard variant="default" />
            </div>
          </div>
        </AnimatedSection>

        {/* Operating Worldwide */}
        <AnimatedSection className="square-section">
          <div className="square-container">
            <AnimatedItem>
            <div className="square-section-header">
              <h2 className="square-section-title">Growing Our Reach</h2>
              <p className="square-section-subtitle">
                Starting in Saskatchewan, expanding to serve more communities
              </p>
            </div>
            </AnimatedItem>
            
            <motion.div 
              className="square-worldwide-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
            >
              {[
                { country: "australia", flag: "🇦🇺", title: "Australia", location: "Sydney", desc: "Coming soon. We're expanding to bring quality services to Australian communities", stats: [{ value: "Coming", label: "Soon" }, { value: "Quality", label: "First" }] },
                { country: "canada", flag: "🇨🇦", title: "Canada", location: "Saskatchewan", desc: "Our home base. Starting here in Saskatchewan, building relationships with local service providers and communities", stats: [{ value: "New", label: "Startup" }, { value: "Local", label: "Focus" }], featured: true },
                { country: "uae", flag: "🇦🇪", title: "United Arab Emirates", location: "7 Emirates", desc: "Future expansion. We're planning to bring our transparent, quality-focused approach to the Emirates", stats: [{ value: "Future", label: "Plans" }, { value: "Quality", label: "Promise" }] },
              ].map((country, idx) => (
                <ScrollAnimatedCard
                  key={idx}
                  idx={idx}
                  type="worldwide"
                  className={`square-worldwide-card ${country.featured ? 'square-worldwide-card-featured' : ''}`}
                  delay={idx * 0.2}
                >
                  <motion.div
                    whileHover={{ y: -15, scale: 1.05, z: 200 }}
                  >
                <div className="square-worldwide-map-container">
                      <CountryMap country={country.country} color="#0b5c28" />
                      <div className="square-worldwide-map-overlay"></div>
                      <motion.div 
                        className={`square-worldwide-badge ${country.featured ? 'square-worldwide-badge-featured' : ''}`}
                        whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <span className="square-worldwide-flag">{country.flag}</span>
                        <span className="square-worldwide-badge-text">{country.featured ? 'Launching' : 'Coming Soon'}</span>
                      </motion.div>
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
                          <motion.div 
                            key={statIdx}
                            className="square-worldwide-stat"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.5, delay: statIdx * 0.1 }}
                          >
                            <span className="square-worldwide-stat-value">{stat.value}</span>
                            <span className="square-worldwide-stat-label">{stat.label}</span>
                          </motion.div>
                        ))}
                </div>
              </div>
                  </motion.div>
                </ScrollAnimatedCard>
              ))}
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Trusted Organizations */}
        <AnimatedSection className="square-section square-section-alt">
          <div className="square-container">
            <AnimatedItem>
            <div className="square-section-header">
              <p className="square-partners-label">Growing with local businesses</p>
              <p className="square-section-subtitle">
                Building partnerships with Saskatchewan organizations
              </p>
            </div>
            </AnimatedItem>
            
            <motion.div 
              className="square-partners-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {partners.map((partner, idx) => (
                <motion.div
                  key={idx}
                  className="square-partner-logo"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      },
                    },
                  }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  {partner.logo}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Final CTA */}
        <AnimatedSection className="square-section">
          <div className="square-container">
            <motion.div 
              className="square-final-cta"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2 
                className="square-final-cta-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Ready to get started?
              </motion.h2>
              <motion.p 
                className="square-final-cta-subtitle"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Be part of our journey. Let's make your life easier, together.
              </motion.p>
              <motion.button 
                className="square-btn-primary square-btn-large"
                onClick={() => navigate("/pricing-booking")}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Get started
              </motion.button>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>

      {/* Post Chore Modal */}
      <PostChoreModal 
        isOpen={postChoreModalOpen} 
        onClose={() => setPostChoreModalOpen(false)} 
      />
    </PageWrapper>
  );
}
