// src/components/booking/BookingScheduleCard.jsx
import React, { useMemo, useState, useEffect } from "react";

export default function BookingScheduleCard({ details, setDetails, onBack, onNext }) {
  const today = new Date();

  const [month, setMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [date, setDate] = useState(null);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  // ✅ LIVE UPDATE INTO DETAILS (wire to summary)
  useEffect(() => {
    if (!setDetails) return;

    setDetails((prev) => ({
      ...prev,
      schedule: {
        date: date ? date.toISOString().slice(0, 10) : "",
        timeFrom: fromTime,
        timeTo: toTime,
      },
    }));
  }, [date, fromTime, toTime, setDetails]);

  /* =========================
     CALENDAR LOGIC (SMALL)
  ========================= */
  const days = useMemo(() => {
    const year = month.getFullYear();
    const m = month.getMonth();
    const firstDay = new Date(year, m, 1).getDay();
    const totalDays = new Date(year, m + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) {
      cells.push(new Date(year, m, d));
    }
    return cells;
  }, [month]);

  const monthLabel = month.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const changeMonth = (dir) => {
    setMonth(new Date(month.getFullYear(), month.getMonth() + dir, 1));
  };

  /* =========================
     TIME OPTIONS (30 MIN)
  ========================= */
  const timeOptions = [];
  for (let h = 7; h <= 20; h++) {
    ["00", "30"].forEach((m) => {
      const hour12 = h % 12 || 12;
      const ampm = h < 12 ? "AM" : "PM";
      timeOptions.push(`${hour12}:${m} ${ampm}`);
    });
  }

  const canNext = date && fromTime && toTime;

  return (
    <div className="booking-card">
      <h2 className="details-title">Date & Time</h2>

      {/* CALENDAR */}
      <div className="calendar-wrapper">
        <div className="calendar-header">
          <button onClick={() => changeMonth(-1)}>‹</button>
          <span>{monthLabel}</span>
          <button onClick={() => changeMonth(1)}>›</button>
        </div>

        <div className="calendar-weekdays">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {days.map((d, i) =>
            !d ? (
              <div key={i} />
            ) : (
              <div
                key={d.toISOString()}
                className={`calendar-day ${
                  date?.toDateString() === d.toDateString() ? "active" : ""
                }`}
                onClick={() => setDate(d)}
              >
                {d.getDate()}
              </div>
            )
          )}
        </div>
      </div>

      {/* TIME */}
      <div className="details-section">
        <div className="details-label">Preferred time window</div>

        <div className="time-row">
          <select value={fromTime} onChange={(e) => setFromTime(e.target.value)}>
            <option value="">From</option>
            {timeOptions.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <span className="time-sep">to</span>

          <select value={toTime} onChange={(e) => setToTime(e.target.value)}>
            <option value="">To</option>
            {timeOptions.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <p className="time-note">
          We’ll reach out to confirm your exact time based on availability.
        </p>
      </div>

      {/* ACTIONS */}
      <div className="service-footer">
        <button className="btn-secondary" onClick={onBack}>
          Back
        </button>
        <button className="btn-primary" disabled={!canNext} onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
}
