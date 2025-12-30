// src/pages/ServicesPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageWrapper } from "../components/page-wrapper.jsx";

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
} from "lucide-react";


export function ServicesPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("residential"); // "residential" | "corporate"

  // ---------------- RESIDENTIAL CONFIG ----------------
  const RESIDENTIAL_SERVICES = [
  {
    id: "cleaning",
    title: "Cleaning",
    icon: Brush,
    tag: "Most booked",
    description: "From quick tidy-ups to deep cleaning that resets your home.",
    bullets: [
      "Home & apartment cleaning",
      "After-party & post-renovation",
      "Carpet and exterior cleaning",
    ],
  },
  {
    id: "airbnb",
    title: "Vacation Home / Airbnb",
    icon: Home,
    description: "Turnovers that keep your guests happy and ratings high.",
    bullets: [
      "Per-stay clean & reset",
      "Restocking condiments & essentials",
      "Bedsheets / towel laundry help",
    ],
  },
  {
    id: "move",
    title: "Move-In / Move-Out",
    icon: Truck,
    description: "Stress-free moves with proper cleaning and lifting help.",
    bullets: [
      "Deep move-in / move-out clean",
      "Packing and light loading help",
      "Garbage / clutter removal",
    ],
  },
  {
    id: "pest",
    title: "Pest Control",
    icon: Bug,
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
    description: "Saskatchewan winters, handled for you.",
    bullets: [
      "Driveways & walkways cleared",
      "Small parking areas",
      "Subscription passes (weekly / monthly)",
    ],
  },
  {
    id: "laundry",
    title: "Laundry Service",
    icon: Shirt,
    description: "Drop the baskets, keep the fresh clothes.",
    bullets: [
      "Pickup & delivery",
      "Folding and sorting",
      "Monthly laundry passes",
    ],
  },
  {
    id: "handyman",
    title: "Handyman",
    icon: Wrench,
    description: "Small jobs done right without calling five different people.",
    bullets: [
      "Furniture assembly & mounting",
      "Blind & curtain install",
      "Appliance install help",
    ],
  },
  {
    id: "lawn",
    title: "Lawn Care",
    icon: Trees,
    description: "Keep the yard as clean as the inside.",
    bullets: [
      "Lawn mowing & edging",
      "Weed control",
      "Sodding and light landscaping",
    ],
  },
  {
    id: "maid",
    title: "Maid Service",
    icon: UserCheck,
    description: "Regular help to keep life moving smoothly.",
    bullets: [
      "Tidy, dishes, mop & vacuum",
      "Surface dusting & light organizing",
      "Hourly or recurring visits",
    ],
  },
  {
    id: "reno",
    title: "Home Renovation",
    icon: Hammer,
    description: "Bigger projects with the right pros.",
    bullets: [
      "Kitchen & bathroom upgrades",
      "Basement finishing",
      "Flooring, painting, repairs",
    ],
  },
  {
    id: "auto",
    title: "Automotive",
    icon: Car,
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
    description: "Trusted trades for the systems that matter.",
    bullets: [
      "Heating & cooling support",
      "Plumbing & minor electrical",
      "Water heater service",
    ],
  },
];

  const CORPORATE_SERVICES = [
  {
    id: "corp-cleaning",
    title: "Commercial Cleaning",
    icon: Brush,
    tag: "For offices & buildings",
    description: "Scheduled cleaning tailored for offices, stores, and common areas.",
    bullets: [
      "Office & retail cleaning",
      "Janitorial & common area care",
      "Post-construction / turnover cleans",
    ],
  },
  {
    id: "corp-move",
    title: "Move-In / Move-Out",
    icon: Truck,
    description: "Professional cleaning & light assistance during tenant turnover.",
    bullets: [
      "Deep cleaning for vacated units",
      "Post-renovation cleanup",
      "Debris & garbage removal",
    ],
  },
  {
    id: "corp-snow",
    title: "Commercial Snow Removal",
    icon: Snowflake,
    description: "Keep access safe for staff, tenants, and customers.",
    bullets: [
      "Lots, walkways & entrances",
      "Seasonal contracts",
      "Salt/sanding add-ons",
    ],
  },
  {
    id: "corp-landscape",
    title: "Commercial Landscaping",
    icon: Trees,
    description: "Clean, consistent outdoor presentation for your property.",
    bullets: [
      "Groundskeeping & mowing",
      "Weed care & trimming",
      "Seasonal cleanups",
    ],
  },
  {
    id: "corp-pest",
    title: "Commercial Pest Control",
    icon: Bug,
    description: "Discreet, reliable pest management for your buildings.",
    bullets: [
      "Office & building inspections",
      "Rodent & insect treatment",
      "Preventative service plans",
    ],
  },
  {
    id: "corp-facility",
    title: "Facility Maintenance",
    icon: ClipboardList,
    description: "One point of contact for everyday fixes and upkeep.",
    bullets: [
      "Handyman and fixture repairs",
      "Appliance installs & minor trades",
      "HVAC, plumbing & electrical partners",
    ],
  },
  {
    id: "corp-reno",
    title: "Commercial Renovation",
    icon: Hammer,
    description: "Refresh workspaces and tenant areas with minimal disruption.",
    bullets: [
      "Office & retail refresh",
      "Flooring and repainting",
      "Light reconfiguration work",
    ],
  },
  {
    id: "corp-management",
    title: "Property & Building Management",
    icon: Building2,
    description: "Bundle cleaning, snow, and maintenance under one umbrella.",
    bullets: [
      "Multi-unit buildings & portfolios",
      "Custom service bundles",
      "Single contact for all site needs",
    ],
  },
];


  const isResidential = mode === "residential";
  const cards = isResidential ? RESIDENTIAL_SERVICES : CORPORATE_SERVICES;

  // ---------------- HANDLERS ----------------
  const handleResidentialBook = (serviceId, title) => {
    navigate("/pricing-booking", {
      state: {
        segment: "residential",
        serviceId,
        title,
      },
    });
  };

  const handleCorporateQuote = (serviceId, title) => {
    // You can change /pricing-booking to /corporate-quote later if you want.
    navigate("/pricing-booking", {
      state: {
        segment: "corporate",
        mode: "quote",
        serviceId,
        title,
      },
    });
  };

  return (
    <PageWrapper>
      <div className="services-shell">
        {/* HEADER */}
        <header className="services-header">
          <h1 className="services-title">Services</h1>
          <p className="services-sub">
            One platform for everyday chores, seasonal work, and long-term partners —{" "}
            <span className="services-highlight">for homes and businesses.</span>
          </p>
        </header>

        {/* TOGGLE */}
        <div className="services-toggle">
          <button
            className={`services-toggle-btn ${
              isResidential ? "active" : ""
            }`}
            onClick={() => setMode("residential")}
          >
            For Home
          </button>
          <button
            className={`services-toggle-btn ${
              !isResidential ? "active" : ""
            }`}
            onClick={() => setMode("corporate")}
          >
            For Business
          </button>
        </div>

        {/* SMALL LABEL */}
        <p className="services-mode-label">
          {isResidential
            ? "Residential services · Book online in a few taps."
            : "Corporate & building services · Tell us what you need and we’ll follow up with a quote."}
        </p>

        {/* GRID */}
        <section className="services-grid">
          {cards.map((card) => {
            const Icon = card.icon || SparkleIcon;
            return (
              <article key={card.id} className="service-card">
                <div className="service-card-top">
                  <div className="service-icon-badge">
                    <Icon size={22} color="#0b5c28" />
                  </div>
                  <div className="service-headline">
                    <h2 className="service-title">{card.title}</h2>
                    {card.tag && (
                      <span className="service-tag">{card.tag}</span>
                    )}
                  </div>
                </div>

                <p className="service-description">{card.description}</p>

                <ul className="service-bullets">
                  {card.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>

                <div className="service-footer">
                  {isResidential ? (
                    <button
                      className="service-cta"
                      onClick={() =>
                        handleResidentialBook(card.id, card.title)
                      }
                    >
                      Book this service
                    </button>
                  ) : (
                    <button
                      className="service-cta service-cta-outline"
                      onClick={() =>
                        handleCorporateQuote(card.id, card.title)
                      }
                    >
                      Request a quote
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </PageWrapper>
  );
}
