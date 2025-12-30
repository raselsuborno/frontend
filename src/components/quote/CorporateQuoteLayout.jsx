import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import CorporateQuoteTracker from "./CorporateQuoteTracker";
import CorporateServicesCard from "./CorporateServicesCard";
import CorporateDetailsCard from "./CorporateDetailsCard";
import CorporateInfoCard from "./CorporateInfoCard";
import CorporateReviewCard from "./CorporateReviewCard";
import CorporateSummaryCard from "./CorporateSummaryCard";

import { CORPORATE_SERVICE_DEFS } from "./corporateServiceDefs";
import "./corporateQuote.css";

export default function CorporateQuoteLayout() {
  const location = useLocation();

  const [step, setStep] = useState(1);
  const [service, setService] = useState(null);

  const [details, setDetails] = useState({
    subService: "",
    extras: {},
  });

  /* =========================================
     PRESELECT SERVICE (FROM SERVICES PAGE)
  ========================================= */
useEffect(() => {
  const incoming = location.state?.preselectedService;
  const mapped = mapCorporateServiceKey(incoming);

  if (mapped) {
    setService(mapped);
    setStep(2);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

const mapCorporateServiceKey = (id) => {
  if (!id) return null;

  const normalized = id.replace("corp-", "").toLowerCase();

  return Object.keys(CORPORATE_SERVICE_DEFS).find(
    (key) => key.toLowerCase() === normalized
  );
};


  const serviceConfig = service ? CORPORATE_SERVICE_DEFS[service] : null;

  const showSummary = !!service && step !== 4;
  const shrinkMain = !!service && step !== 4;
  const isReview = step === 4;

  return (
    <div className="quote-flow">
      <CorporateQuoteTracker step={step} />

      <div className={`quote-row ${isReview ? "review-mode" : ""}`}>
        {!isReview && (
          <div className={`quote-main ${shrinkMain ? "shrink" : ""}`}>
            <AnimatePresence mode="wait">
              <motion.div key={step}>
                {step === 1 && (
                  <CorporateServicesCard
                    selected={service}
                    onSelect={setService}
                    onNext={() => setStep(2)}
                  />
                )}

                {step === 2 && serviceConfig && (
                  <CorporateDetailsCard
                    serviceConfig={serviceConfig}
                    details={details}
                    setDetails={setDetails}
                    onBack={() => setStep(1)}
                    onNext={() => setStep(3)}
                  />
                )}

                {step === 3 && (
                  <CorporateInfoCard
                    details={details}
                    setDetails={setDetails}
                    onBack={() => setStep(2)}
                    onNext={() => setStep(4)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {showSummary && (
          <motion.div className="quote-summary">
            <CorporateSummaryCard service={service} details={details} />
          </motion.div>
        )}

        {isReview && (
          <div className="quote-summary expanded">
            <CorporateReviewCard
              service={service}
              details={details}
              onBack={() => setStep(3)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
