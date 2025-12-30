// src/booking/BookingPage.jsx
import React from "react";
import { motion } from "framer-motion";
import "./booking.layout.css";

export default function BookingPage() {
  return (
    <div className="booking-page">

      {/* Progress Tracker */}
      <div className="booking-tracker">
        Progress Tracker (placeholder)
      </div>

      {/* Main Row */}
      <div className="booking-row">

        {/* Services Card */}
        <motion.div
          layout
          className="booking-card services-card"
        >
          Services Card
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          layout
          className="booking-card main-card"
        >
          Main Step Content
        </motion.div>

        {/* Summary Card */}
        <motion.div
          layout
          className="booking-card summary-card"
        >
          Summary
        </motion.div>

      </div>
    </div>
  );
}
