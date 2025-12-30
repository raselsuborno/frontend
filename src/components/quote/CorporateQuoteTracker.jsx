// src/quote/CorporateQuoteTracker.jsx
import React from "react";
import "../quote/corporateQuote.css";

const STEPS = ["Service", "Details", "Company", "Review"];

export default function CorporateQuoteTracker({ step }) {
  const percent = Math.round((step / STEPS.length) * 100);

  return (
    <>
      {/* MOBILE */}
      <div className="tracker-mobile">
        <div className="tracker-mobile-header">
          <span>Step {step} of {STEPS.length}</span>
          <span>{percent}%</span>
        </div>
        <div className="tracker-mobile-bar">
          <div className="tracker-mobile-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {/* DESKTOP */}
      <div className="tracker-desktop">
        {STEPS.map((label, index) => {
          const s = index + 1;
          const state =
            s < step ? "done" : s === step ? "active" : "todo";

          return (
            <React.Fragment key={label}>
              <div className={`tracker-step ${state}`}>
                {s}. {label}
              </div>
              {s < STEPS.length && (
                <div
                  className={`tracker-line ${s < step ? "done" : ""}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
}
