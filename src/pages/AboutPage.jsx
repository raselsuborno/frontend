// src/pages/AboutPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PageWrapper } from "../components/page-wrapper.jsx";
import { Container, Section, Card, CardContent, Button } from "../components/ui";
import "../styles/unified-page-layout.css";
import { 
  Heart, 
  Users, 
  Target, 
  Award,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { WorkerCTACard } from "../components/WorkerCTACard.jsx";

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
      <div className="unified-page">
        {/* ========== HERO SECTION ========== */}
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
              <Sparkles size={14} />
              <span>Fresh to Saskatchewan • Committed to quality</span>
            </motion.div>
            <motion.h1 
              className="unified-hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Helping you reclaim your time
            </motion.h1>
            <motion.p 
              className="unified-hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Life's too short to spend it on chores. ChorEscape connects you with 
              trusted professionals who handle the tasks you don't have time for.
            </motion.p>
          </div>
        </motion.header>

      {/* ========== OUR STORY ========== */}
      <Section size="sm">
        <Container>
          <Card>
            <CardContent className="py-8">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles size={24} className="text-[var(--ce-primary)]" />
                <h2 className="text-2xl font-semibold">Our Story</h2>
              </div>
              <div className="space-y-4 text-[var(--ce-muted)]">
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
            </CardContent>
          </Card>
        </Container>
      </Section>

      {/* ========== WHAT WE STAND FOR ========== */}
      <Section size="sm">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--ce-primary-soft)] flex items-center justify-center">
                  <Heart size={24} className="text-[var(--ce-primary)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Customer First</h3>
                <p className="text-[var(--ce-muted)]">
                  Your time and satisfaction are our top priorities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--ce-primary-soft)] flex items-center justify-center">
                  <Users size={24} className="text-[var(--ce-primary)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Trusted Professionals</h3>
                <p className="text-[var(--ce-muted)]">
                  Every service provider is vetted and verified
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--ce-primary-soft)] flex items-center justify-center">
                  <Target size={24} className="text-[var(--ce-primary)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Simple & Fast</h3>
                <p className="text-[var(--ce-muted)]">
                  Book quality services in under 60 seconds
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--ce-primary-soft)] flex items-center justify-center">
                  <Award size={24} className="text-[var(--ce-primary)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
                <p className="text-[var(--ce-muted)]">
                  Not satisfied? We'll make it right, no questions asked
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      {/* ========== STATISTICS ========== */}
      <Section size="sm">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-4xl font-bold text-[var(--ce-primary)] mb-2">50K+</div>
                <div className="text-sm text-[var(--ce-muted)]">Happy Customers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-4xl font-bold text-[var(--ce-primary)] mb-2">98%</div>
                <div className="text-sm text-[var(--ce-muted)]">Satisfaction Rate</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-4xl font-bold text-[var(--ce-primary)] mb-2">150+</div>
                <div className="text-sm text-[var(--ce-muted)]">Cities Served</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-4xl font-bold text-[var(--ce-primary)] mb-2">24/7</div>
                <div className="text-sm text-[var(--ce-muted)]">Support</div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      {/* ========== HEAR FROM OUR CUSTOMERS ========== */}
      <Section size="sm">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Hear From Our Customers</h2>
          </div>
          <Card>
            <CardContent className="py-12">
              <div className="max-w-3xl mx-auto">
                <div className="text-6xl text-[var(--ce-primary-soft)] mb-4">"</div>
                <div className="flex gap-1 justify-center mb-6">
                  {[...Array(reviews[currentReview].rating)].map((_, i) => (
                    <Star key={i} size={20} fill="#FFB800" color="#FFB800" />
                  ))}
                </div>
                <p className="text-lg text-center text-[var(--ce-muted)] mb-6">
                  {reviews[currentReview].quote}
                </p>
                <div className="text-center mb-6">
                  <span className="inline-block px-3 py-1 bg-[var(--ce-primary-soft)] text-[var(--ce-primary)] rounded-full text-sm font-medium">
                    {reviews[currentReview].tag}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--ce-primary-soft)] flex items-center justify-center text-[var(--ce-primary)] font-semibold">
                    {reviews[currentReview].avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold flex items-center gap-2">
                      {reviews[currentReview].name}
                      <CheckCircle size={14} className="text-[var(--ce-primary)]" />
                    </div>
                    <div className="text-sm text-[var(--ce-muted)]">{reviews[currentReview].title}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mt-8">
                <button 
                  className="w-10 h-10 rounded-full border border-[var(--ce-border)] flex items-center justify-center hover:bg-[var(--ce-primary-soft)] transition-colors"
                  onClick={prevReview}
                  aria-label="Previous review"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-2">
                  {reviews.map((_, idx) => (
                    <button
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentReview 
                          ? "bg-[var(--ce-primary)]" 
                          : "bg-[var(--ce-border)]"
                      }`}
                      onClick={() => setCurrentReview(idx)}
                      aria-label={`Go to review ${idx + 1}`}
                    />
                  ))}
                </div>
                <button 
                  className="w-10 h-10 rounded-full border border-[var(--ce-border)] flex items-center justify-center hover:bg-[var(--ce-primary-soft)] transition-colors"
                  onClick={nextReview}
                  aria-label="Next review"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </Section>

      {/* ========== CTA SECTION ========== */}
      <Section>
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-lg text-[var(--ce-muted)] mb-8">
              Join thousands who've already reclaimed their time
            </p>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate("/pricing-booking")}
            >
              Book your first service
              <ArrowRight size={18} />
            </Button>
          </div>
        </Container>
      </Section>

      {/* Worker CTA - Growth Section */}
      <Section size="sm">
        <Container>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <WorkerCTACard variant="default" />
          </div>
        </Container>
      </Section>

      </div>
    </PageWrapper>
  );
}
