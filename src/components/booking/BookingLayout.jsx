import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import BookingTracker from "./BookingTracker";
import BookingServicesCard from "./BookingServicesCard";
import BookingDetailsCard from "./BookingDetailsCard";
import BookingScheduleCard from "./BookingScheduleCard";
import BookingAddressCard from "./BookingAddressCard";
import BookingSummaryCard from "./BookingSummaryCard";
import BookingReviewCard from "./BookingReviewCard";
import BookingPaymentCard from "./BookingPaymentCard";

import "./booking.layout.css";
import api from "../../lib/api.js";

export default function BookingLayout() {
  const TOTAL_STEPS = 6;
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(1);
  const [service, setService] = useState(null);

  const [serviceData, setServiceData] = useState(null);
  const [details, setDetails] = useState({
    // New schema-driven structure
    blocks: {},
    // Legacy format (maintained for backward compatibility with other steps)
    subService: "",
    frequency: "",
    customFields: {},
    extraNotes: "",
    extras: {
      homeSize: "",
      laundryUnits: "",
      laundryFold: "",
      handymanJobType: "",
      snowPropertyType: "",
      snowIncludeWalkways: false,
      autoVehicleType: "",
      extraNotes: "",
    },
    schedule: {},
    address: {},
  });

  /* =========================================
     PRESELECT SERVICE (FROM SERVICES PAGE)
  ========================================= */
  useEffect(() => {
    const preselectedId = location.state?.preselectedService;
    if (preselectedId) {
      // Fetch service data from backend
      const fetchService = async () => {
        try {
          const response = await api.get(`public/services?type=RESIDENTIAL`);
          const found = (response.data || []).find(
            (s) => s.id === preselectedId || s.slug === preselectedId
          );
          if (found) {
            setService(found);
            setServiceData(found);
            setStep(2);
          }
        } catch (error) {
          console.error("Failed to fetch preselected service:", error);
        }
      };
      fetchService();
    }
  }, [location.state]);

  /* =========================
     NAVIGATION
  ========================= */
  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleServiceSelect = async (svc) => {
    setService(svc);
    setServiceData(svc); // Set immediately for UI
    
    try {
      // Fetch full service data with options if we have an id or slug
      if (svc.id || svc.slug) {
        const response = await api.get(`public/services/${svc.id || svc.slug}`);
        setServiceData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch service details:", error);
      // Keep the service data we already set
    }
    
    setDetails({
      blocks: {},
      subService: "",
      frequency: "",
      customFields: {},
      extraNotes: "",
      extras: {
        homeSize: "",
        laundryUnits: "",
        laundryFold: "",
        handymanJobType: "",
        snowPropertyType: "",
        snowIncludeWalkways: false,
        autoVehicleType: "",
        extraNotes: "",
      },
      schedule: {},
      address: {},
    });
    
    // Don't reset step if we're navigating forward
    if (!location.state?.preselectedService && step === 1) {
      // Stay on step 1, wait for user to click Next
    }
  };

  return (
    <div className="booking-layout">
      <BookingTracker step={step} total={TOTAL_STEPS} />

      <div className={`booking-row ${step === 5 ? "review-mode" : ""}`}>
        <motion.div
          className={`booking-main ${service && step !== 5 ? "shrink" : ""}`}
          layout
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="services">
                <BookingServicesCard
                  selected={service}
                  onSelect={handleServiceSelect}
                  onNext={() => service && setStep(2)}
                />
              </motion.div>
            )}

            {step === 2 && (serviceData || service) && (
              <motion.div key="details">
                <BookingDetailsCard
                  service={serviceData || service}
                  details={details}
                  setDetails={setDetails}
                  onBack={back}
                  onNext={next}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="schedule">
                <BookingScheduleCard
                  details={details}
                  setDetails={setDetails}
                  onBack={back}
                  onNext={next}
                />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="address">
                <BookingAddressCard
                  details={details}
                  setDetails={setDetails}
                  onBack={back}
                  onNext={next}
                  isAuthenticated={!!localStorage.getItem("token")}
                />
              </motion.div>
            )}

            {step === 5 && serviceData && (
              <motion.div key="review">
                <BookingReviewCard
                  service={serviceData.title || serviceData.name}
                  details={details}
                  onEditService={() => setStep(1)}
                  onEditSchedule={() => setStep(3)}
                  onEditAddress={() => setStep(4)}
                  onBack={back}
                />
              </motion.div>
            )}

            {step === 6 && (
              <motion.div key="payment">
                <BookingPaymentCard
                  service={serviceData}
                  details={details}
                  onBack={back}
                  onComplete={(bookingData) => {
                    // Handle booking completion
                    navigate("/dashboard", { state: { bookingCreated: true } });
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {service && (
          <motion.div
            className={`booking-summary ${
              step === 5 ? "review-expanded" : ""
            }`}
          >
            {step < 5 && (
              <BookingSummaryCard
                service={serviceData || service}
                details={details}
                step={step}
              />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
