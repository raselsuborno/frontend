import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Briefcase, LayoutGrid, Bell, User } from "lucide-react";
import "../styles/dashboard-bottom-nav.css";

/**
 * Mobile app-style bottom navigation
 * - Shown globally (mounted in App shell)
 * - Uses routing (not dashboard-local state)
 *
 * Tabs:
 * 1) Home → "/"
 * 2) Services → "/services"
 * 3) Bookings (Dashboard overview) → "/dashboard"
 * 4) Notifications (Inbox) → "/dashboard" with state { tab: "inbox" }
 * 5) Profile → "/dashboard" with state { tab: "profile" }
 */
export function DashboardBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const tabState = location.state && location.state.tab;

  let activeId = "home";
  if (pathname.startsWith("/services")) {
    activeId = "services";
  } else if (pathname.startsWith("/dashboard")) {
    if (tabState === "inbox") {
      activeId = "notifications";
    } else if (tabState === "profile") {
      activeId = "profile";
    } else {
      activeId = "dashboard";
    }
  }

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      onClick: () => navigate("/"),
    },
    {
      id: "services",
      label: "Services",
      icon: Briefcase,
      onClick: () => navigate("/services"),
    },
    {
      id: "dashboard",
      label: "Bookings",
      icon: LayoutGrid,
      onClick: () => navigate("/dashboard", { state: { tab: "overview" } }),
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      onClick: () => navigate("/dashboard", { state: { tab: "inbox" } }),
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      onClick: () => navigate("/dashboard", { state: { tab: "profile" } }),
    },
  ];

  return (
    <nav className="dashboard-bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            className={`bottom-nav-item ${isActive ? "active" : ""}`}
            onClick={item.onClick}
            aria-label={item.label}
          >
            <Icon size={22} />
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
