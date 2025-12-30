import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import BookingTracker from "./BookingTracker";
import BookingServicesCard from "./BookingServicesCard";
import BookingDetailsCard from "./BookingDetailsCard";
import BookingScheduleCard from "./BookingScheduleCard";
import BookingAddressCard from "./BookingAddressCard";
import BookingSummaryCard from "./BookingSummaryCard";
import BookingReviewCard from "./BookingReviewCard";

import { SERVICE_DEFS } from "./serviceDefs";
import "./booking.layout.css";

export default function BookingLayout() {
  const TOTAL_STEPS = 5;

  const location = useLocation();

  const [step, setStep] = useState(1);
  const [service, setService] = useState(null);

  const [details, setDetails] = useState({
    subService: "",
    frequency: "",
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
  });

  /* =========================================
     PRESELECT SERVICE (FROM SERVICES PAGE)
  ========================================= */
useEffect(() => {
  const incoming = location.state?.preselectedService;
  const mapped = mapServiceKey(incoming);

  if (mapped) {
    setService(mapped);
    setStep(2);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  /* =========================
     NAVIGATION
  ========================= */
  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleServiceSelect = (svc) => {
    setService(svc);
    setDetails({
      subService: "",
      frequency: "",
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
    });
if (!location.state?.preselectedService) {
  setStep(1);
}
  };
const mapServiceKey = (id) => {
  if (!id) return null;
  return Object.keys(SERVICE_DEFS).find(
    (key) => key.toLowerCase() === id.toLowerCase()
  );
};
  const serviceConfig = service ? SERVICE_DEFS[service] : null;

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

            {step === 2 && serviceConfig && (
              <motion.div key="details">
                <BookingDetailsCard
                  serviceConfig={serviceConfig}
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
            {step !== 5 ? (
              <BookingSummaryCard
                service={service}
                details={details}
                step={step}
              />
            ) : (
              <BookingReviewCard
                service={service}
                details={details}
                onEditService={() => setStep(1)}
                onEditSchedule={() => setStep(3)}
                onEditAddress={() => setStep(4)}
                onBack={() => setStep(4)}
              />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
