# Booking Flow Architecture

## Overview

The booking flow uses a **schema-driven architecture** where Step 2 (Booking Details) is fully controlled by `bookingBlocks` configuration.

## Architecture Principles

1. **Single Normalization Layer**: All legacy/compatibility logic exists ONLY in `normalizeServiceToConfig()`
2. **No Service-Specific Logic**: Step 2 components never check service slugs, names, or types
3. **Block-Based Rendering**: Each input field is a `BookingBlock` that renders predictably
4. **State Structure**: `details.blocks` stores values by block type

## Key Files

- `serviceConfig.js` - Normalization layer & block type definitions
- `BookingBlockRenderer.jsx` - Renders individual blocks (no business logic)
- `BookingDetailsCard.jsx` - Step 2 component (iterates blocks only)
- `BookingLayout.jsx` - Orchestrates the 6-step flow

## Booking Block Types

```javascript
{
  subService: "Service variant selection",
  frequency: "Recurring booking option",
  homeSize: "Property size selection",
  jobDescription: "Text input for work description",
  photoUpload: "Image upload field",
  simpleNote: "Additional notes textarea",
  vehicleType: "Vehicle selection",
  snowOptions: "Snow removal specific options",
  laundryUnits: "Laundry volume selection",
  handymanJobType: "Handyman job category",
}
```

## Data Flow

1. Backend service data → `normalizeServiceToConfig()` → `ServiceConfig`
2. `ServiceConfig.bookingBlocks` → `BookingDetailsCard` iterates blocks
3. Each block → `BookingBlockRenderer` renders based on type
4. User input → `details.blocks[blockType] = value`
5. Submission → Reads from `details.blocks` + legacy format for compatibility

## Migration Status

- ✅ Step 2 fully uses bookingBlocks
- ⚠️ Legacy format still maintained for Steps 3-6 compatibility
- ⚠️ Normalization layer includes temporary SERVICE_DEFS mapping
- 📋 TODO: Admin UI to configure bookingBlocks in database
- 📋 TODO: Remove legacy format once all steps migrated

## Example Normalized Config

```javascript
{
  slug: "cleaning",
  title: "Cleaning",
  basePrice: 80.0,
  bookingBlocks: [
    { type: "subService", options: [...], required: true },
    { type: "frequency" },
    { type: "homeSize" },
    { type: "simpleNote" },
  ]
}
```

## Adding New Service Types

1. Backend adds service with `bullets` or `options`
2. `normalizeServiceToConfig()` automatically converts to blocks
3. If special blocks needed, add inference in `inferServiceSpecificBlocks()`
4. Eventually: Admin configures blocks directly in database

## Deprecation Plan

1. ✅ Implement bookingBlocks architecture
2. ⏳ Migrate Steps 3-6 to read from blocks
3. ⏳ Admin UI for block configuration
4. ⏳ Remove `normalizeServiceToConfig()` legacy paths
5. ⏳ Remove SERVICE_DEFS entirely
