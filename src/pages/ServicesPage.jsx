// src/pages/ServicesPage.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageWrapper } from "../components/page-wrapper.jsx";
import { PostChoreModal } from "../components/PostChoreModal.jsx";
import "../styles/services.page.css";
import { IMAGES } from "../components/serviceImages";
import toast from "react-hot-toast";

import {
  Brush,
  Home,
  Truck,
  Bug,
  Snowflake,
  Shirt,
  Wrench,
  Trees,
  UserCheck,
  Hammer,
  Car,
  Thermometer,
  Sparkles,
  Building2,
  ClipboardList,
  ArrowRight,
  Check,
  X,
  Plus,
} from "lucide-react";

export function ServicesPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("residential");
  const [postChoreModalOpen, setPostChoreModalOpen] = useState(false);

  const isResidential = mode === "residential";

const handleResidentialBook = (serviceId, title) => {
  navigate("/pricing-booking", {
    state: {
      preselectedService: serviceId,
      title,
    },
  });
};
const handleCorporateQuote = (serviceId, title) => {
  navigate("/request-quote", {
    state: {
      preselectedService: serviceId,
      title,
    },
  });
};

  /* =========================
     SERVICES (FLAT LIST)
  ========================= */
  const RESIDENTIAL_SERVICES = useMemo(
    () => [
      {
        id: "cleaning",
        title: "Cleaning",
        icon: Brush,
        tag: "Most booked",
        image: IMAGES.cleaning,
        description:
          "From quick tidy-ups to deep cleaning that resets your home.",
        bullets: [
          "Home & apartment cleaning",
          "After-party & post-renovation",
          "Carpet and exterior cleaning",
        ],
      },
      {
        id: "maid",
        title: "Maid Service",
        icon: UserCheck,
        image: IMAGES.maid,
        description: "Regular help to keep life moving smoothly.",
        bullets: [
          "Tidy, dishes, mop & vacuum",
          "Surface dusting & light organizing",
          "Hourly or recurring visits",
        ],
      },
      {
        id: "laundry",
        title: "Laundry Service",
        icon: Shirt,
        image: IMAGES.laundry,
        description: "Drop the baskets, keep the fresh clothes.",
        bullets: [
          "Pickup & delivery",
          "Folding and sorting",
          "Monthly laundry passes",
        ],
      },
      {
        id: "lawn",
        title: "Lawn Care",
        icon: Trees,
        image: IMAGES.lawn,
        description: "Keep the yard as clean as the inside.",
        bullets: [
          "Lawn mowing & edging",
          "Weed control",
          "Sodding and light landscaping",
        ],
      },
      {
        id: "handyman",
        title: "Handyman",
        icon: Wrench,
        image: IMAGES.handyman,
        description:
          "Small jobs done right without calling five different people.",
        bullets: [
          "Furniture assembly & mounting",
          "Blind & curtain install",
          "Appliance install help",
        ],
      },
      {
        id: "reno",
        title: "Home Renovation",
        icon: Hammer,
        image: IMAGES.renovation,
        description: "Bigger projects with the right pros.",
        bullets: [
          "Kitchen & bathroom upgrades",
          "Basement finishing",
          "Flooring, painting, repairs",
        ],
      },
      {
        id: "pest",
        title: "Pest Control",
        icon: Bug,
        image: IMAGES.pest,
        description: "Keep your home clear of unwanted guests.",
        bullets: [
          "Inspection & assessment",
          "Ants, spiders, crawling insects",
          "Rodent treatment plans",
        ],
      },
      {
        id: "snow",
        title: "Snow Removal",
        icon: Snowflake,
        image: IMAGES.snow,
        description: "Saskatchewan winters, handled for you.",
        bullets: [
          "Driveways & walkways cleared",
          "Small parking areas",
          "Subscription passes",
        ],
      },
      {
        id: "move",
        title: "Move-In / Move-Out",
        icon: Truck,
        image: IMAGES.move,
        description:
          "Stress-free moves with proper cleaning and lifting help.",
        bullets: [
          "Deep move-in / move-out clean",
          "Packing and light loading help",
          "Garbage / clutter removal",
        ],
      },
      {
        id: "airbnb",
        title: "Vacation Home / Airbnb",
        icon: Home,
        image: IMAGES.airbnb,
        description:
          "Turnovers that keep your guests happy and ratings high.",
        bullets: [
          "Per-stay clean & reset",
          "Restocking condiments & essentials",
          "Bedsheets / towel laundry help",
        ],
      },
      {
        id: "auto",
        title: "Automotive",
        icon: Car,
        image: IMAGES.auto,
        description: "Car chores handled without waiting rooms.",
        bullets: [
          "Inside–out detailing",
          "Seasonal tire change at home",
          "Oil change & basic tune-up",
        ],
      },
      {
        id: "trades",
        title: "Heating, Cooling & Plumbing",
        icon: Thermometer,
        image: IMAGES.trades,
        description: "Trusted trades for the systems that matter.",
        bullets: [
          "Heating & cooling support",
          "Plumbing & minor electrical",
          "Water heater service",
        ],
      },
    ],
    []
  );

  const CORPORATE_SERVICES = useMemo(
    () => [
      {
        id: "corp-cleaning",
        title: "Commercial Cleaning",
        icon: Brush,
        image: IMAGES.cleaning,
        description:
          "Scheduled cleaning tailored for offices, stores, and common areas.",
        bullets: [
          "Office & retail cleaning",
          "Janitorial & common area care",
          "Post-construction / turnover cleans",
        ],
      },
      {
        id: "corp-snow",
        title: "Commercial Snow Removal",
        icon: Snowflake,
        image: IMAGES.snow,
        description:
          "Keep access safe for staff, tenants, and customers.",
        bullets: [
          "Lots, walkways & entrances",
          "Seasonal contracts",
          "Salt & sanding add-ons",
        ],
      },
      {
        id: "corp-landscape",
        title: "Commercial Landscaping",
        icon: Trees,
        image: IMAGES.lawn,
        description:
          "Clean, consistent outdoor presentation for your property.",
        bullets: [
          "Groundskeeping & mowing",
          "Weed care & trimming",
          "Seasonal cleanups",
        ],
      },
      {
        id: "corp-facility",
        title: "Facility Maintenance",
        icon: ClipboardList,
        image: IMAGES.FacilityMaintenance,
        description:
          "One point of contact for everyday fixes and upkeep.",
        bullets: [
          "Handyman and fixture repairs",
          "Appliance installs & minor trades",
          "HVAC, plumbing & electrical partners",
        ],
      },
      {
        id: "corp-reno",
        title: "Commercial Renovation",
        icon: Building2,
        image: IMAGES.renovation,
        description:
          "Refresh workspaces and tenant areas with minimal disruption.",
        bullets: [
          "Office & retail refresh",
          "Flooring and repainting",
          "Light reconfiguration work",
        ],
      },
    ],
    []
  );

  const services = isResidential
    ? RESIDENTIAL_SERVICES
    : CORPORATE_SERVICES;

  return (
    <PageWrapper>
      <div className="svc-shell">
        {/* HERO */}
        <header className="svc-hero">
          <div className="shop-header fade-in-up">
            <div className="shop-hero-badge">
              <Sparkles size={14} />
              <span>Professional services for every need</span>
            </div>

            <h1 className="shop-title">Our Services</h1>

            <p className="shop-subtitle">
              One platform for everyday chores, seasonal work, and long-term
              partners — for homes and businesses.
            </p>

            <div className="svc-toggle">
              <button
                className={`svc-toggle-btn ${isResidential ? "active" : ""}`}
                onClick={() => setMode("residential")}
              >
                For Home
              </button>
              <button
                className={`svc-toggle-btn ${!isResidential ? "active" : ""}`}
                onClick={() => setMode("corporate")}
              >
                For Business
              </button>
            </div>

            <p className="svc-mode-line">
              {isResidential
                ? "Residential services · Book online in a few taps."
                : "Corporate services · Request a custom quote."}
            </p>
          </div>
        </header>

        {/* GRID */}
        <div className="svc-grid">
          {services.map((card) => {
            const Icon = card.icon || Sparkles;

            return (
              <article key={card.id} className="svc-card">
                <div className="svc-card-media">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="svc-card-img"
                    loading="lazy"
                  />
                  <div className="svc-card-overlay" />
                  <div className="svc-card-image">
                        <h3 className="svc-card-title">{card.title}</h3>
                  </div>
                  {card.tag && <div className="svc-tag">{card.tag}</div>}
                </div>

                {/* HOVER REVEAL */}
                <div className="svc-card-reveal">
                  <div className="svc-card-body">
                    <h3 className="svc-card-title">{card.title}</h3>
                    <p className="svc-card-desc">{card.description}</p>

                    <ul className="svc-bullets">
                      {card.bullets.map((b) => (
                        <li key={b}>
                          <Check size={16} />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="svc-card-footer">
                    {isResidential ? (
                      <button
                        className="svc-cta"
                        onClick={() =>
                          handleResidentialBook(card.id, card.title)
                        }
                      >
                        Book this service <ArrowRight size={18} />
                      </button>
                    ) : (
                      <button
                        className="svc-cta outline"
                        onClick={() =>
                          handleCorporateQuote(card.id, card.title)
                        }
                      >
                        Request a quote <ArrowRight size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Post a Chore Section - Only for Residential */}
        {isResidential && (
          <section className="svc-custom-chore-section">
            <div className="svc-custom-chore-card" onClick={() => setPostChoreModalOpen(true)}>
              <div className="svc-custom-chore-left">
                <div className="svc-custom-chore-icon">
                  <Sparkles size={24} />
                </div>
                <div className="svc-custom-chore-content">
                  <p className="svc-custom-eyebrow">Can't find what you're looking for?</p>
                  <h3 className="svc-custom-title">Post a Custom Chore</h3>
                  <p className="svc-custom-sub">
                    Tell us what you need — we'll match you with the right helper ASAP.
                  </p>
                </div>
              </div>
              <button className="svc-custom-cta" onClick={(e) => { e.stopPropagation(); setPostChoreModalOpen(true); }}>
                Post Your Chore <ArrowRight size={18} />
              </button>
            </div>
          </section>
        )}
      </div>

      {/* ========== POST CHORE MODAL ========== */}
      <PostChoreModal 
        isOpen={postChoreModalOpen} 
        onClose={() => setPostChoreModalOpen(false)} 
      />
    </PageWrapper>
  );
}
