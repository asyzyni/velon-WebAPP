# Velon Admin Dashboard & Fleet Schedule (Jadwal) Documentation

## Overview

On branch `version-2`, the Velon car rental administrative web interface has been upgraded from static placeholders to a fully data-driven dashboard and interactive Gantt-style fleet schedule view.

The application architecture consists of:
- **Backend**: Spring Boot (`Back-End/backend`) running on port `8081` with PostgreSQL (`velon_db`).
- **Frontend**: React 19 + TypeScript + Vite (`Front-End/App`) running on port `5173`.

---

## Component Architecture

```
Front-End/App/src/
├── components/
│   ├── AdminDashboard.tsx       # Main admin layout, header with user profile, nav tabs
│   ├── AdminOverview.tsx        # Dashboard Overview: real-time stat cards, recent bookings, revenue
│   ├── AdminSchedule.tsx        # Interactive fleet schedule (Gantt calendar) with booking details
│   ├── AdminBookings.tsx        # Booking management list, status transitions, proof verification
│   └── AuthContext.tsx          # Authentication state management (user role, login/logout)
├── lib/
│   ├── date.ts                  # Shared date helpers for local calendar parsing & formatting
│   └── bookingStatus.ts         # Shared BookingStatus mapping (labels, colors, badges)
└── api/
    ├── adminBookingApi.ts       # Endpoints: GET /admin/bookings, approve, cancel, complete
    └── carApi.ts                # Endpoints: GET /cars, GET /cars/:id
```

---

## Key Features & Specifications

### 1. Dashboard Overview (`AdminOverview.tsx`)
- **Real-Time Fleet & Booking Statistics**:
  - `Total Mobil`: Count of all fleet vehicles from `GET /cars`.
  - `Sedang Disewa`: Number of vehicles actively rented today (`CONFIRMED` status with current date falling between `startDate` and `endDate`).
  - `Mobil Tersedia`: Available vehicles excluding those actively rented.
  - `Total Booking`: Total count of bookings retrieved from `GET /admin/bookings`.
- **Month-over-Month Revenue Comparison**:
  - Automatically calculates current month's revenue vs. previous month's revenue (`CONFIRMED` or `COMPLETED`).
  - Gracefully handles zero/missing previous month data by showing `"Belum ada data bulan lalu untuk dibandingkan"` instead of dividing by zero or displaying `NaN`.
- **Booking Terbaru Table**:
  - Displays the 8 most recent bookings sorted chronologically by start date.
  - Renders gracefully with zero bookings (`"Belum ada booking."`).
  - Uses `bookingStatusMeta` for uniform badge styling.

### 2. Fleet Schedule ("Jadwal") (`AdminSchedule.tsx`)
- **Gantt Calendar Grid**:
  - Horizontal timeline view of each vehicle and its scheduled bookings across the selected month.
  - Calendar header with Indonesian day-of-week abbreviations (`Min`, `Sen`, `Sel`, `Rab`, `Kam`, `Jum`, `Sab`) and day numbers.
  - Weekends and today highlighted dynamically.
- **Month Navigation**:
  - Previous (`<`) and Next (`>`) month controls with boundary handling (e.g. December -> January transitions).
  - Quick **"Hari Ini"** button to jump directly back to the current month.
- **Daily Operations Strip**:
  - Real-time counters independent of selected view:
    - *Diambil Hari Ini* (Pickups today)
    - *Dikembalikan Hari Ini* (Returns today)
    - *Menunggu Konfirmasi* (Pending confirmation)
- **Interactive Booking Drawer / Detail Panel**:
  - Clicking any booking bar opens a side drawer with vehicle details, renter ID/name, date range, total price, and action buttons (`Konfirmasi`, `Tandai Selesai`, `Batalkan`).
  - Actions directly trigger backend endpoints (`/admin/bookings/{id}/approve`, `/admin/bookings/{id}/cancel`, `/admin/bookings/{id}/complete`) and refresh state automatically.

### 3. Shared Helpers (`lib/date.ts` & `lib/bookingStatus.ts`)
- **`lib/date.ts`**:
  - `parseISODate(s)`: Local calendar date parsing avoiding UTC off-by-one shifts. Hardened against null, undefined, empty strings, and ISO timestamp suffixes (`T...`).
  - `toISODate(d)`: Formats dates into `YYYY-MM-DD`.
  - `formatDateID(s)`: Localized Indonesian date formatter (`DD Bulan YYYY`).
  - `formatDateRangeID(start, end)`: Localized Indonesian date range string.
- **`lib/bookingStatus.ts`**:
  - Handles the 6 backend `BookingStatus` enum states:
    - `WAITING_PAYMENT` (Menunggu Pembayaran - Amber)
    - `WAITING_CONFIRMATION` (Menunggu Konfirmasi - Blue)
    - `CONFIRMED` (Terkonfirmasi - Green)
    - `COMPLETED` (Selesai - Gray)
    - `CANCELLED` (Dibatalkan - Red)
    - `REFUNDED` (Dana Dikembalikan - Purple)

---

## Edge Case & Safety Guarantees

1. **Unmount & Rapid Tab Switching**:
   - Both `AdminOverview` and `AdminSchedule` implement `isMounted` ref/guards to prevent React state updates after unmount during rapid tab navigation.
2. **Date Clamping**:
   - `clampToMonth` in `AdminSchedule` safely handles bookings spanning across previous/next months, invalid date strings, and inverted date ranges (`start > end`).
3. **Null / Undefined Field Safety**:
   - User profile initials generation safely falls back to `'A'` for empty/missing names.
   - User display falls back to `'Admin'`.
   - Prices fall back to `0` with `Number(totalPrice) || 0` before formatting to avoid `NaN`.
   - Backend list responses are verified with `Array.isArray()` before setting state.

---

## Build & Run Instructions

### Prerequisites
- Java 17+ and Maven
- Node.js 18+ and npm
- PostgreSQL running on `localhost:5432` with database `velon_db`

### Backend
```bash
cd Back-End/backend
mvn spring-boot:run
```
Backend runs on `http://localhost:8081`.

### Frontend
```bash
cd Front-End/App
npm install
npm run build   # Typechecks with tsc -b and bundles with Vite
npm run dev     # Starts Vite dev server
```
Frontend runs on `http://localhost:5173`.
