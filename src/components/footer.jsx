// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/chorebunny.png";

export function Footer() {
  return (
    <footer className="modern-footer">
      <div className="footer-container">
        {/* Left Column - Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={logo} alt="ChorEscape Logo" className="footer-logo-img" />
            <span className="footer-logo-text">ChorEscape</span>
          </div>
          <p className="footer-tagline">
            Get your time back. Professional services booked in minutes.
          </p>
        </div>

        {/* Services Column */}
        <div className="footer-column">
          <h3 className="footer-column-title">Services</h3>
          <ul className="footer-links">
            <li>
              <Link to="/services">All Services</Link>
            </li>
            <li>
              <Link to="/pricing-booking">Book a Service</Link>
            </li>
            <li>
              <Link to="/request-quote">Corporate Quote</Link>
            </li>
            <li>
              <Link to="/shop">Shop Products</Link>
            </li>
          </ul>
        </div>

        {/* Company Column */}
        <div className="footer-column">
          <h3 className="footer-column-title">Company</h3>
          <ul className="footer-links">
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/careers">Careers</Link>
            </li>
            <li>
              <Link to="/apply/worker">Become a Worker</Link>
            </li>
          </ul>
        </div>

        {/* Account Column */}
        <div className="footer-column">
          <h3 className="footer-column-title">Account</h3>
          <ul className="footer-links">
            <li>
              <Link to="/auth">Login / Sign Up</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/post-chore">Post a Chore</Link>
            </li>
            <li>
              <Link to="/my-chores">My Chores</Link>
            </li>
          </ul>
        </div>

        {/* Legal Column */}
        <div className="footer-column">
          <h3 className="footer-column-title">Legal</h3>
          <ul className="footer-links">
            <li>
              <Link to="/legal/disclaimer">Legal Disclaimer</Link>
            </li>
            <li>
              <Link to="/legal/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/legal/terms">Terms of Service</Link>
            </li>
            <li>
              <Link to="/legal/booking-terms">Booking Terms</Link>
            </li>
            <li>
              <Link to="/legal/cookies">Cookie Policy</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          © {new Date().getFullYear()} ChorEscape. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
