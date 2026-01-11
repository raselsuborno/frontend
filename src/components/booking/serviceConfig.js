/**
 * Service Configuration Schema & Normalization
 * 
 * This module defines the clean, schema-driven architecture for booking flows.
 * All legacy/compatibility logic exists ONLY here in the normalization layer.
 */

/**
 * Booking Block Types
 * Each block represents a single input field/choice in the booking flow
 */
export const BookingBlockType = {
  SUB_SERVICE: "subService",
  FREQUENCY: "frequency",
  HOME_SIZE: "homeSize",
  JOB_DESCRIPTION: "jobDescription",
  PHOTO_UPLOAD: "photoUpload",
  SIMPLE_NOTE: "simpleNote",
  VEHICLE_TYPE: "vehicleType",
  SNOW_OPTIONS: "snowOptions",
  LAUNDRY_UNITS: "laundryUnits",
  HANDYMAN_JOB_TYPE: "handymanJobType",
};

/**
 * @typedef {Object} BookingBlock
 * @property {string} type - One of BookingBlockType values
 * @property {string[]} [options] - For select/choice blocks
 * @property {boolean} [required] - Whether this field is required
 * @property {string} [label] - Custom label override
 * @property {string} [placeholder] - Placeholder text for inputs
 */

/**
 * @typedef {Object} ServiceConfig
 * @property {string} slug - Service identifier
 * @property {string} title - Display name
 * @property {string} [icon] - Icon name
 * @property {number} [basePrice] - Base price
 * @property {BookingBlock[]} bookingBlocks - Ordered list of booking blocks
 */

/**
 * SERVICES WITH FREQUENCY
 * Services that support recurring bookings
 */
const FREQUENCY_ENABLED_SLUGS = [
  "snow",
  "cleaning",
  "airbnb",
  "laundry",
  "lawn",
  "maid",
];

/**
 * NORMALIZATION LAYER
 * 
 * Converts raw backend service data OR legacy SERVICE_DEFS into clean ServiceConfig.
 * This is the ONLY place where legacy compatibility exists.
 * 
 * TODO: Remove legacy SERVICE_DEFS mapping after admin migration is complete.
 */
export function normalizeServiceToConfig(rawService) {
  if (!rawService) {
    return null;
  }

  try {
    const slug = rawService.slug || rawService.id || "";
    const title = rawService.title || rawService.name || "Service";
    const icon = rawService.iconName || rawService.icon || null;
    const basePrice = rawService.basePrice || null;

    // If service has configured bookingBlocks, use them directly
    // Handle both array format and JSON string format (Prisma returns parsed JSON)
    let bookingBlocks = rawService.bookingBlocks;
    if (typeof bookingBlocks === 'string') {
      try {
        bookingBlocks = JSON.parse(bookingBlocks);
      } catch (e) {
        console.warn('[ServiceConfig] Failed to parse bookingBlocks JSON:', e);
        bookingBlocks = null;
      }
    }

    if (bookingBlocks && Array.isArray(bookingBlocks) && bookingBlocks.length > 0) {
      // Enrich SUB_SERVICE blocks with actual options from service
      const enrichedBlocks = bookingBlocks.map(block => {
        if (block.type === BookingBlockType.SUB_SERVICE || block.type === 'subService') {
          const subServices = extractSubServices(rawService);
          return {
            ...block,
            type: BookingBlockType.SUB_SERVICE, // Ensure consistent type format
            options: block.options && Array.isArray(block.options) && block.options.length > 0 
              ? block.options 
              : subServices,
          };
        }
        // Ensure block type matches BookingBlockType enum
        return block;
      });

      return {
        slug,
        title,
        icon,
        basePrice,
        bookingBlocks: enrichedBlocks,
      };
    }
    
    // Fallback to inference if no configured blocks
    // Fallback: Infer blocks from service data (legacy behavior)
    const inferredBlocks = [];

    // 1. SUB-SERVICE BLOCK (from bullets or options)
    const subServices = extractSubServices(rawService);
    if (subServices.length > 0) {
      inferredBlocks.push({
        type: BookingBlockType.SUB_SERVICE,
        options: subServices,
        required: true,
      });
    }

    // 2. FREQUENCY BLOCK (if service supports it)
    if (shouldIncludeFrequency(slug, rawService)) {
      inferredBlocks.push({
        type: BookingBlockType.FREQUENCY,
        required: false,
      });
    }

    // 3. SERVICE-SPECIFIC BLOCKS (infer from slug/type)
    const serviceSpecificBlocks = inferServiceSpecificBlocks(slug, rawService);
    inferredBlocks.push(...serviceSpecificBlocks);

    // 4. NOTES BLOCK (always last, always optional)
    inferredBlocks.push({
      type: BookingBlockType.SIMPLE_NOTE,
      required: false,
      label: "Additional notes (optional)",
      placeholder: "Access notes, issues, pets, special requests, etc.",
    });

    return {
      slug,
      title,
      icon,
      basePrice,
      bookingBlocks: inferredBlocks,
    };
  } catch (error) {
    console.error('[ServiceConfig] Error in normalizeServiceToConfig:', error, rawService);
    // Return a minimal fallback config
    return {
      slug: rawService.slug || rawService.id || "",
      title: rawService.title || rawService.name || "Service",
      icon: rawService.iconName || rawService.icon || null,
      basePrice: rawService.basePrice || null,
      bookingBlocks: [],
    };
  }
}

/**
 * Extract sub-services from various backend shapes
 * TODO: Remove after admin schema migration
 */
function extractSubServices(service) {
  // Try bullets first (current backend format)
  if (service.bullets && Array.isArray(service.bullets)) {
    return service.bullets.map((b) => (typeof b === "string" ? b : b.name || b));
  }

  // Try options (alternative backend format)
  if (service.options && Array.isArray(service.options)) {
    return service.options
      .filter((opt) => opt.isActive !== false)
      .map((opt) => {
        if (typeof opt === "string") return opt;
        return opt.name || opt;
      });
  }

  // Legacy SERVICE_DEFS fallback
  // TODO: Remove this after migration
  if (service.subServices && Array.isArray(service.subServices)) {
    return service.subServices;
  }

  return [];
}

/**
 * Determine if frequency block should be included
 */
function shouldIncludeFrequency(slug, service) {
  const slugLower = slug.toLowerCase();
  return FREQUENCY_ENABLED_SLUGS.some((freqSlug) =>
    slugLower.includes(freqSlug)
  );
}

/**
 * Infer service-specific booking blocks from slug
 * TODO: Once admin can configure bookingBlocks, remove this inference logic
 */
function inferServiceSpecificBlocks(slug, service) {
  const slugLower = slug.toLowerCase();
  const blocks = [];

  // Home size for cleaning, maid, lawn, etc.
  if (
    slugLower.includes("cleaning") ||
    slugLower.includes("maid") ||
    slugLower.includes("lawn") ||
    slugLower.includes("airbnb") ||
    slugLower.includes("move")
  ) {
    blocks.push({
      type: BookingBlockType.HOME_SIZE,
      required: false,
    });
  }

  // Laundry-specific blocks
  if (slugLower.includes("laundry")) {
    blocks.push({
      type: BookingBlockType.LAUNDRY_UNITS,
      required: false,
    });
  }

  // Handyman job type
  if (slugLower.includes("handyman")) {
    blocks.push({
      type: BookingBlockType.HANDYMAN_JOB_TYPE,
      required: false,
    });
  }

  // Snow removal options
  if (slugLower.includes("snow")) {
    blocks.push({
      type: BookingBlockType.SNOW_OPTIONS,
      required: false,
    });
  }

  // Vehicle type for automotive
  if (slugLower.includes("auto") || slugLower.includes("automotive")) {
    blocks.push({
      type: BookingBlockType.VEHICLE_TYPE,
      required: false,
    });
  }

  // Job description for handyman, pest, renovation
  if (
    slugLower.includes("handyman") ||
    slugLower.includes("pest") ||
    slugLower.includes("reno") ||
    slugLower.includes("renovation")
  ) {
    blocks.push({
      type: BookingBlockType.JOB_DESCRIPTION,
      required: false,
    });
  }

  return blocks;
}

/**
 * OPTIONS FOR EACH BLOCK TYPE
 * These define the available choices for each block type
 */
export const BlockOptions = {
  [BookingBlockType.HOME_SIZE]: [
    "Apartment (1–2 rooms)",
    "Small Home (2–3 rooms)",
    "Medium Home (3–4 rooms)",
    "Large Home (4+ rooms)",
  ],
  [BookingBlockType.FREQUENCY]: ["One-Time", "Weekly", "Bi-weekly", "Monthly"],
  [BookingBlockType.LAUNDRY_UNITS]: ["1–2 loads", "3–4 loads", "5+ loads"],
  [BookingBlockType.HANDYMAN_JOB_TYPE]: [
    "Furniture assembly",
    "Mounting / TV",
    "Repairs",
    "Other small jobs",
  ],
  [BookingBlockType.SNOW_OPTIONS]: {
    propertyType: ["House driveway", "Parking pad", "Small lot"],
    includeWalkways: true, // Boolean option
  },
  [BookingBlockType.VEHICLE_TYPE]: ["Car", "SUV", "Truck / Van"],
};

/**
 * EXAMPLE NORMALIZED CONFIGS
 * 
 * These show what normalized ServiceConfigs look like for different services.
 * In the future, these will come directly from the admin-configured database.
 */

export const ExampleConfigs = {
  cleaning: {
    slug: "cleaning",
    title: "Cleaning",
    icon: "Brush",
    basePrice: 80.0,
    bookingBlocks: [
      {
        type: BookingBlockType.SUB_SERVICE,
        options: [
          "Home & apartment cleaning",
          "After-party & post-renovation",
          "Carpet and exterior cleaning",
        ],
        required: true,
      },
      {
        type: BookingBlockType.FREQUENCY,
        required: false,
      },
      {
        type: BookingBlockType.HOME_SIZE,
        required: false,
      },
      {
        type: BookingBlockType.SIMPLE_NOTE,
        required: false,
      },
    ],
  },

  handyman: {
    slug: "handyman",
    title: "Handyman",
    icon: "Wrench",
    basePrice: 75.0,
    bookingBlocks: [
      {
        type: BookingBlockType.SUB_SERVICE,
        options: [
          "Furniture assembly & mounting",
          "Blind & curtain install",
          "Appliance install help",
        ],
        required: true,
      },
      {
        type: BookingBlockType.HANDYMAN_JOB_TYPE,
        required: false,
      },
      {
        type: BookingBlockType.JOB_DESCRIPTION,
        required: false,
        placeholder: "Describe the work needed...",
      },
      {
        type: BookingBlockType.SIMPLE_NOTE,
        required: false,
      },
    ],
  },

  pestControl: {
    slug: "pest",
    title: "Pest Control",
    icon: "Bug",
    basePrice: 100.0,
    bookingBlocks: [
      {
        type: BookingBlockType.SUB_SERVICE,
        options: [
          "Inspection & assessment",
          "Ants, spiders, crawling insects",
          "Rodent treatment plans",
        ],
        required: true,
      },
      {
        type: BookingBlockType.JOB_DESCRIPTION,
        required: false,
        placeholder: "Describe the pest issue...",
      },
      {
        type: BookingBlockType.SIMPLE_NOTE,
        required: false,
      },
    ],
  },
};
