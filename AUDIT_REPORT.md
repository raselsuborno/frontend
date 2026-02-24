# 🔍 FRONTEND AUDIT REPORT
## "Fresh to Saskatchewan" App-Like Revamp

**Date:** 2025-01-15  
**Scope:** Frontend-only refactor (backend untouched)

---

## STEP 1: AUDIT SUMMARY

### 📁 Project Structure

```
frontend/src/
├── components/          # Reusable UI components
│   ├── booking/        # Booking flow (6-step wizard)
│   ├── quote/          # Corporate quote flow
│   ├── ui/             # UI primitives (buttons, cards, etc.)
│   └── ...
├── pages/              # Page-level components
├── contexts/           # React contexts (Auth, Location)
├── lib/                # API client, Supabase
├── styles/             # CSS files (33 files)
└── utils/              # Helpers (API, pricing)
```

### 🔌 API Service Files

**Primary API Client:** `lib/api.js`
- Base URL: `import.meta.env.VITE_API_BASE_URL`
- Auth: Uses Supabase session token (Bearer token)
- Interceptor: Auto-attaches `Authorization` header from Supabase session

**Key API Endpoints Mapped:**

#### Public Endpoints
- `GET /api/public/services?type={RESIDENTIAL|CORPORATE}` - Services list
- `GET /api/public/services/:id` - Single service details
- `GET /api/public/reviews` - Reviews

#### Auth Endpoints
- `GET /api/profile/me` - Current user profile
- Uses Supabase auth (no direct API calls for login/signup)

#### Booking Endpoints
- `POST /api/bookings` - Create booking (authenticated)
- `POST /api/bookings/guest` - Create booking (guest)
- `GET /api/bookings/mine` - User's bookings

#### Dashboard Endpoints
- `GET /api/bookings/mine` - User bookings
- `GET /api/chores` - User chores
- `GET /api/quotes/mine` - User quotes
- `GET /api/addresses` - User addresses

#### Admin Endpoints
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/bookings` - All bookings
- `GET /api/admin/users` - All users
- `GET /api/admin/workers` - All workers
- `GET /api/admin/services` - Manage services
- `GET /api/admin/contact` - Contact messages
- `GET /api/admin/quotes` - All quotes
- `GET /api/admin/chores` - All chores
- `GET /api/admin/orders` - All orders
- `GET /api/admin/analytics/*` - Analytics endpoints

#### Worker Endpoints
- `GET /api/worker/bookings` - Worker's assigned bookings
- `POST /api/worker/apply` - Worker application
- `POST /api/worker/documents` - Upload documents
- `PATCH /api/worker/bookings/:id/:action` - Booking actions

#### Other Endpoints
- `POST /api/contact` - Contact form
- `GET /api/addresses` - User addresses
- `POST /api/addresses` - Create address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

### 🔐 Authentication & Session Handling

**AuthContext** (`contexts/AuthContext.jsx`):
- **Source of Truth:** Supabase session
- **State:** `user`, `session`, `profile`, `role`, `loading`
- **Methods:** `logout()`, `refreshProfile()`
- **Flow:**
  1. Loads session from Supabase on mount
  2. Listens to Supabase `onAuthStateChange`
  3. Fetches profile from `/api/profile/me` using session token
  4. Derives `role` from `profile.role` (CUSTOMER, WORKER, ADMIN)

**API Client Auth:**
- Interceptor gets token from Supabase session
- Auto-attaches `Authorization: Bearer {token}` header
- No localStorage token storage (Supabase is source of truth)

### 📋 Booking Flow Logic

**BookingLayout** (`components/booking/BookingLayout.jsx`):
- **6 Steps:** Services → Details → Schedule → Address → Review → Payment
- **State:** `step`, `service`, `serviceData`, `details`
- **Details Structure:**
  - `details.blocks` - Schema-driven (new)
  - `details.subService`, `details.frequency` - Legacy (backward compat)
  - `details.schedule`, `details.address` - Step data

**Booking Submission:**
- **Authenticated:** `POST /api/bookings`
- **Guest:** `POST /api/bookings/guest`
- **Data Shape:** `{ serviceName, subService, frequency, date, timeSlot, addressLine, city, province, postal, country, notes, paymentMethod, paymentStatus }`

**Service Configuration:**
- `serviceConfig.js` - Normalizes backend service data
- `serviceDefs.js` - Service definitions (legacy)
- `BookingBlockRenderer.jsx` - Renders schema-driven blocks

### 📊 State Management

**Contexts:**
- `AuthContext` - Auth state, user, profile, role
- `LocationContext` - Selected location (Regina, White City, Lumsden)

**Local State:**
- Pages use `useState` for local data
- No global state management library (Redux, Zustand, etc.)

### 🗺️ Pages → API Calls Mapping

| Page | API Calls |
|------|-----------|
| **HomePage** | None (static) |
| **ServicesPage** | `GET /api/public/services?type={RESIDENTIAL\|CORPORATE}` |
| **DashboardPage** | `GET /api/profile/me`, `GET /api/bookings/mine`, `GET /api/chores`, `GET /api/quotes/mine` |
| **AdminDashboardPage** | `GET /api/admin/stats`, `GET /api/admin/bookings`, `GET /api/admin/users`, `GET /api/admin/workers`, `GET /api/admin/services`, `GET /api/admin/contact`, `GET /api/admin/quotes`, `GET /api/admin/chores`, `GET /api/admin/orders`, `GET /api/admin/analytics/*` |
| **WorkerDashboardPage** | `GET /api/worker/bookings`, `GET /api/worker/documents`, `POST /api/worker/documents`, `PATCH /api/worker/bookings/:id/:action` |
| **BookingLayout** | `GET /api/public/services/:id`, `POST /api/bookings` or `POST /api/bookings/guest` |
| **ContactPage** | `POST /api/contact` |
| **MyChoresPage** | `GET /api/chores`, `POST /api/chores`, `PUT /api/chores/:id`, `DELETE /api/chores/:id` |
| **PostChorePage** | `POST /api/chores` |
| **ShopPage** | Shop-related endpoints (to be mapped) |
| **CartPage** | Cart-related endpoints (to be mapped) |

### 🧩 Shared Components

**Layout Components:**
- `Navbar` - Top navigation
- `Footer` - Bottom footer
- `PageWrapper` - Page container
- `ProtectedRoute` - Auth guard
- `DashboardBottomNav` - Mobile bottom nav (NEW)

**Booking Components:**
- `BookingLayout` - Main orchestrator
- `BookingTracker` - Step indicator
- `BookingServicesCard` - Step 1
- `BookingDetailsCard` - Step 2
- `BookingScheduleCard` - Step 3
- `BookingAddressCard` - Step 4
- `BookingReviewCard` - Step 5
- `BookingPaymentCard` - Step 6
- `BookingSummaryCard` - Sidebar summary

**UI Components:**
- `ServiceDetailModal` - Service details popup
- `BookingDetailModal` - Booking details popup
- `AddressManagement` - Address CRUD
- `PostChoreModal` - Post chore form
- `AuthModal` - Login/signup modal

**UI Primitives** (`components/ui/`):
- `Badge`, `Breadcrumbs`, `EmptyState`, `LoadingSpinner`, `StatCard`, `Tooltip`, etc.

### 📱 Mobile Breakpoints Currently Used

**CSS Files with Media Queries:**
- `mobile-enhancements.css` - 768px, 480px
- `dashboard-simplified.css` - 768px, 480px
- `dashboard-modern.css` - 768px, 1024px
- `booking.layout.css` - 768px, 900px, 480px
- `theme.css` - Various breakpoints
- `global-unified.css` - 768px, 1024px

**Common Breakpoints:**
- `768px` - Tablet/mobile boundary
- `480px` - Small mobile
- `1024px` - Desktop/tablet boundary
- `900px` - Custom (booking review mode)

### 🎨 Current Design System

**Colors:**
- Primary: `#0b5c28` (Brand Green)
- Secondary: `#E6B65C` (Wheat Gold) - NEW
- Background: `#FFFFFF` / `#F6F7F9`
- Text: `#2E3440` (Dark Slate)
- Success: `#2ECC71`
- Error: `#E74C3C`

**Typography:**
- Font: Inter / SF Pro / system sans-serif
- H1: 28px / Bold
- H2: 20px / Semibold
- Body: 16px / Regular
- Senior Mode Body: 18px / Regular
- Caption: 13px / Muted
- Button: 16px / Semibold

**Spacing:**
- Base unit: 8px
- Section padding: 16-24px

**Border Radius:**
- Card: 12px
- Image: 8px

### ⚠️ Critical Notes

1. **Backend is READ-ONLY** - No API endpoint changes allowed
2. **Auth uses Supabase** - Session management via Supabase, not custom
3. **Booking flow is complex** - 6-step wizard with schema-driven Step 2
4. **Multiple dashboard types** - Customer, Worker, Admin (different routes)
5. **Location context exists** - But currently not used in navbar (removed due to issues)
6. **Design system tokens** - Already updated to "Fresh to Saskatchewan" theme

---

## STEP 2: UI ARCHITECTURE PLAN

### 🏗️ Proposed Structure

```
components/
├── layout/
│   ├── AppShell.jsx          # Main app container
│   ├── BottomNav.jsx         # Mobile bottom navigation
│   ├── SidebarNav.jsx        # Desktop sidebar navigation
│   └── Header.jsx            # Top header (simplified navbar)
├── cards/
│   ├── ServiceCard.jsx       # Service display card
│   ├── BookingCard.jsx      # Booking list item
│   └── DashboardCard.jsx    # Dashboard stat card
├── booking/
│   └── BookingWizard.jsx     # Wrapper around existing BookingLayout
└── senior/
    └── SeniorModeToggle.jsx  # Senior mode toggle
```

### 📄 Page Mapping

**Current → Proposed:**

| Current Page | App Section | Navigation Tab |
|--------------|-------------|----------------|
| `HomePage` | Home | Home |
| `ServicesPage` | Services | Services |
| `PricingBookingPage` | Booking | Services → Book |
| `DashboardPage` | Dashboard | Bookings (mobile) / Overview (desktop) |
| `DashboardPage` (inbox tab) | Inbox | Inbox |
| `DashboardPage` (profile tab) | Profile | Profile |
| `AdminDashboardPage` | Admin Dashboard | (Admin only) |
| `WorkerDashboardPage` | Worker Dashboard | (Worker only) |

### 🎯 Navigation Structure

**Mobile (Bottom Nav):**
- Home
- Services
- Bookings
- Inbox
- Profile

**Desktop (Sidebar):**
- Overview
- Bookings
- Inbox
- Profile
- (Settings, Logout)

### 🎨 Senior Mode Implementation

**Toggle Location:** Header/Settings
**Effects (CSS-only):**
- Font size multiplier: 1.125x
- Contrast: Higher (darker text, lighter backgrounds)
- Icons: Always show labels (no icon-only buttons)
- Touch targets: 48px minimum (already implemented)
- Spacing: Increased padding

**Implementation:**
- Add `data-senior-mode="true"` to `<html>` or `<body>`
- CSS variables adjust based on attribute
- No backend changes needed

---

## STEP 3: REFACTOR PLAN (Incremental)

### Phase 1: AppShell & Navigation
1. Create `AppShell.jsx` - Main layout wrapper
2. Create `BottomNav.jsx` - Mobile bottom nav (enhance existing)
3. Create `SidebarNav.jsx` - Desktop sidebar
4. Update `app.jsx` to use AppShell
5. Test: All routes still work

### Phase 2: Home & Services
1. Refactor `HomePage` - App-like layout
2. Refactor `ServicesPage` - Card grid, mobile-optimized
3. Test: Navigation, API calls unchanged

### Phase 3: Booking Flow
1. Wrap `BookingLayout` in `BookingWizard`
2. Ensure mobile buttons work (already fixed)
3. Test: Booking submission unchanged

### Phase 4: Dashboard
1. Refactor `DashboardPage` - App-like cards
2. Integrate bottom nav (already done)
3. Test: All dashboard tabs work

### Phase 5: Senior Mode
1. Create `SeniorModeToggle` component
2. Add CSS variables for senior mode
3. Test: Toggle works, no backend calls

### Phase 6: Polish & Safety
1. Test all routes
2. Test deep links
3. Verify no API changes
4. Mobile testing

---

## ✅ SAFETY CHECKLIST

- [ ] All API endpoints preserved
- [ ] Auth flow unchanged
- [ ] Booking submission works
- [ ] All routes accessible
- [ ] Deep links work
- [ ] Mobile responsive
- [ ] Senior mode toggle works
- [ ] No backend code modified

---

**Next Step:** Wait for approval to proceed with Step 2 (AppShell creation)
