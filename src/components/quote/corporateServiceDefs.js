// src/quote/corporateServiceDefs.js
export const CORPORATE_SERVICE_DEFS = {
  Cleaning: {
    title: "Commercial Cleaning",
    icon: "Brush",
    subServices: [
      "Office Cleaning",
      "Retail Cleaning",
      "Post-Construction Clean",
      "Common Area Janitorial",
    ],
    extrasType: "propertySize",
  },

  Snow: {
    title: "Commercial Snow Removal",
    icon: "Snowflake",
    subServices: [
      "Parking Lots",
      "Walkways & Entrances",
      "Seasonal Contract",
    ],
    extrasType: "lotSize",
  },

  Landscaping: {
    title: "Commercial Landscaping",
    icon: "Trees",
    subServices: [
      "Groundskeeping",
      "Mowing",
      "Seasonal Cleanup",
    ],
    extrasType: "propertySize",
  },

  Facility: {
    title: "Facility Maintenance",
    icon: "Wrench",
    subServices: [
      "Handyman Repairs",
      "Fixture Replacement",
      "Minor Trades",
    ],
    extrasType: "simpleNote",
  },

  Automotive: {
    title: "Fleet / Automotive",
    icon: "Car",
    subServices: [
      "Inside-Out Detail",
      "Seasonal Tire Change",
      "Oil Change & Basic Tune-Up",
    ],
    extrasType: "vehicleCount",
  },
};
