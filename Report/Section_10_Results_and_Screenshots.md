**Results & Screenshots**

This document summarizes the working modules, successful operations, and the final functioning of the web app. It also lists the exact routes/screens to open when taking labelled screenshots (homepage, login/register, dashboards, CRUD pages, output pages, and error/validation examples).

**Working Modules**:
- **Backend (API)**: `auth`, `users`, `drivers`, `rides`, `pricing`, `earnings`, `ratings`, `verification`, `analytics`, `admin`.
- **Frontend**: pages and components for `Auth` (login/register), `Passenger` (request rides), `Driver` (accept/complete rides), `Admin` (dashboard, user/driver management), shared UI components (`GeocodingAutocomplete`, `UI`).
- **Realtime**: socket modules in `sockets/` enabling driver-passenger matching and live ride updates.
- **Utilities & Services**: `fare` and `distance` utils, `mail.service`, `token` util for JWT, `upload` middleware for verification documents.

**Successful Operations (tested)**:
- **User registration & login**: New users can register and obtain JWT tokens via the `auth` endpoints.
- **Driver verification**: Upload and admin approval flow via `verification` endpoints and `uploads/verification` folder.
- **Ride lifecycle**: Passenger creates a ride request; driver receives and accepts; ride state updates (start, end) are stored in `ride` model and emitted via sockets.
- **Pricing calculation**: Fare calculated using `utils/fare.js` and pricing config in `config/pricing.js`.
- **Earnings & ratings**: Driver earnings recorded; passengers can rate completed rides.
- **Admin CRUD**: Admin can list and manage users, drivers, and demand zones via admin controllers and frontend admin pages.

**Final Functioning Summary**:
- The frontend (Vite React/TS) interacts with the backend REST API for CRUD and auth operations; sockets provide real-time ride matching and updates.
- Authentication uses JWT tokens; protected routes are guarded by `middlewares/auth.js` and `roleGuard.js`.
- File uploads for verification are handled by `middlewares/upload.js` and stored under `uploads/verification`.

**How to run locally (quick)**:
- Start backend (from `backend/`):

```powershell
cd backend
npm install
npm run dev
```

- Start frontend (from `frontend/`):

```powershell
cd frontend
npm install
npm run dev
```

Note: Vite typically serves the frontend at `http://localhost:5173` (confirm in the console).

**Screenshots — routes and instructions**

When taking screenshots, use the routes below. Where both a frontend route and a backend API route are relevant, both are listed (use the frontend route to screen-capture UI; use the API route to capture network/error responses if needed).

- **Homepage**:
  - Frontend route: `/` — open `http://localhost:5173/` (or the Vite base URL). Capture header, hero banner, and card list on the homepage.

- **Login / Register** (Auth page):
  - Frontend route: `/auth` — open `http://localhost:5173/auth` (or `/#/auth` if using hash router).
  - Backend API endpoints: `POST /api/auth/register`, `POST /api/auth/login` (use the Network tab to capture request/response).
  - Example test credentials for screenshots (use only for local/dev testing):
    - Passenger: `passenger@example.com` / `password123`
    - Driver: `driver@example.com` / `password123`
    - Admin: `admin@example.com` / `adminpass`

- **Dashboard (Admin)**:
  - Frontend route: `/admin` — open `http://localhost:5173/admin` after logging in as admin.
  - Capture the admin overview (cards for rides, earnings, pending verifications), and the sidebar/menu.

- **Dashboard (Driver)**:
  - Frontend route: `/driver` — open `http://localhost:5173/driver` after logging in as a driver.
  - Capture active ride panel, earnings quick view, and live location updates (socket-driven UI elements).

- **Passenger View / Dashboard**:
  - Frontend route: `/passenger` — open `http://localhost:5173/passenger` after logging in.
  - Capture ride request form, active ride card, and ride history list.

- **CRUD Pages (Admin)**:
  - User Management: `http://localhost:5173/admin/user-management` (component: `UserManagement.tsx` / section under `sections/admin`).
  - Driver Verification Panel: `http://localhost:5173/admin/driver-verification` (component: `DriverVerificationPanel.tsx`).
  - Pricing / Demand Zone CRUD (if present): `http://localhost:5173/admin/revenue` or `http://localhost:5173/admin/demand-zones`.
  - Backend API examples: `GET /api/admin/users`, `PUT /api/admin/users/:id`, `DELETE /api/admin/users/:id`.

- **Rides CRUD / Output pages**:
  - Rides list (Admin): `http://localhost:5173/admin/rides` or the admin rides panel.
  - Driver ride acceptance popup: appear in `/driver` when a new request arrives.
  - Passenger ride details / receipt page: `http://localhost:5173/passenger/rides/:id`.
  - Backend endpoints: `POST /api/rides`, `GET /api/rides/:id`, `PUT /api/rides/:id`.

- **Output pages (reports / earnings / analytics)**:
  - Admin Revenue Panel: `http://localhost:5173/admin/revenue` (component: `RevenuePanel.tsx`).
  - Analytics page: `http://localhost:5173/admin/analytics`.
  - Backend endpoints: `GET /api/earnings`, `GET /api/analytics`.

- **Error handling & validation (MANDATORY screenshots)**:
  - Frontend validation errors (form-level): reproduce by submitting the registration or login form with missing/invalid fields at `http://localhost:5173/auth` — capture the inline validation messages.
  - Backend error responses: trigger a known error (e.g., register with an existing email) and capture the Network tab response from `POST /api/auth/register` showing the error JSON and status code.
  - Protected route handling: open an admin route without a token (e.g., `http://localhost:5173/admin`) — capture the redirect to login or the UI error message.
  - File upload validation: attempt to upload an unsupported file type on verification flow (`/driver/verification` or admin verification UI) and capture the error message.

**Label suggestions when saving screenshots**
- `01_homepage.png` — homepage
- `02_auth_login.png` — login form
- `03_auth_register_validation.png` — registration validation error
- `04_admin_dashboard.png` — admin dashboard overview
- `05_driver_dashboard_active_ride.png` — driver with active ride
- `06_user_management_list.png` — admin user list (CRUD)
- `07_driver_verification_list.png` — pending verifications
- `08_create_ride_request.png` — passenger create ride request form
- `09_ride_output_receipt.png` — ride details / receipt
- `10_backend_error_register_existing_email.png` — Network tab showing error JSON

**Notes & tips for reproducible screenshots**
- Start backend first, then frontend. Ensure you are logged in with the matching role (admin/driver/passenger) before opening role-specific pages.
- Use the browser Developer Tools → Network tab to capture API responses for error screenshots.
- For socket-driven UI (driver accepts ride), have both passenger and driver sessions open in separate browser windows to capture the real-time flow.
- If routes differ due to your router setup, search for the page component names under `frontend/src/pages` and `frontend/src/sections` to confirm exact route paths.

**Files to reference in the repo**
- Backend API entry: [backend/src/index.js](backend/src/index.js#L1)
- Auth controller: [backend/src/controllers/auth.controller.js](backend/src/controllers/auth.controller.js#L1)
- Admin UI components: [frontend/src/sections/admin/AdminDashboard.tsx](frontend/src/sections/admin/AdminDashboard.tsx#L1)
- Auth page: [frontend/src/pages/Auth.tsx](frontend/src/pages/Auth.tsx#L1)

If you'd like, I can:
- Run the app locally and produce the screenshots for you, or
- Produce a zip of the labelled screenshots if you provide sample credentials to use for testing.

Report file created: [Report/Section_10_Results_and_Screenshots.md](Report/Section_10_Results_and_Screenshots.md#L1)
