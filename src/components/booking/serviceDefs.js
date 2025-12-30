// src/components/booking/serviceDefs.js

export const SERVICE_DEFS = {
  Cleaning: {
    id: "Cleaning",
    title: "Cleaning",
    subServices: [
      "Standard Clean",
      "Deep Clean",
      "Move-In / Move-Out Clean",
      "Post-Renovation Clean",
      "Hourly Help",
    ],
    extrasType: "homeSize",
  },

  Airbnb: {
    id: "Airbnb",
    title: "Airbnb or Rental",
    subServices: [
      "Turnover Clean",
      "Restocking & Setup",
      "Laundry (Bedsheets / Towels)",
    ],
    extrasType: "homeSize",
  },

  Move: {
    id: "Move",
    title: "Move-In or Out",
    subServices: ["Move-In Clean", "Move-Out Clean", "Packing Help"],
    extrasType: "homeSize",
  },

  Pest: {
    id: "Pest",
    title: "Pest Control",
    subServices: [
      "Inspection",
      "Ants / Spiders / Crawlers",
      "Rodent Treatment",
      "Preventative Plan",
    ],
    extrasType: "simpleNote",
  },

  Snow: {
    id: "Snow",
    title: "Snow Removal",
    subServices: [
      "Driveway & Walkways",
      "Small Parking Area",
      "Seasonal Pass",
    ],
    extrasType: "snowOptions",
  },

  Laundry: {
    id: "Laundry",
    title: "Laundry",
    subServices: [
      "Wash & Fold",
      "Wash Only",
      "Bedding & Linens",
      "Pickup & Delivery",
    ],
    extrasType: "laundryUnits",
  },

  Handyman: {
    id: "Handyman",
    title: "Handyman",
    subServices: [
      "Furniture Assembly",
      "Mounting / TV",
      "Repairs",
      "Other",
    ],
    extrasType: "handymanJob",
  },

  Lawn: {
    id: "Lawn",
    title: "Lawn Care",
    subServices: [
      "Lawn Mowing",
      "Weed Care",
      "Sodding",
      "Seasonal Cleanup",
    ],
    extrasType: "homeSize",
  },

  Maid: {
    id: "Maid",
    title: "Maid Service",
    subServices: [
      "Tidy & Reset",
      "Full Home Reset",
      "Hourly Help",
    ],
    extrasType: "homeSize",
  },

  Renovation: {
    id: "Renovation",
    title: "Home Renovation",
    subServices: [
      "Kitchen Update",
      "Bathroom Refresh",
      "Basement Finish",
      "Flooring / Paint",
    ],
    extrasType: "simpleNote",
  },

  Automotive: {
    id: "Automotive",
    title: "Automotive",
    subServices: [
      "Inside-Out Detail",
      "Seasonal Tire Change",
      "Oil Change & Basic Tune-Up",
    ],
    extrasType: "autoType",
  },

  HVAC: {
    id: "HVAC",
    title: "HVAC & Plumbing",
    subServices: [
      "Heating & Furnace",
      "AC / Cooling",
      "Plumbing Repair",
      "Water Heater",
    ],
    extrasType: "simpleNote",
  },
};
