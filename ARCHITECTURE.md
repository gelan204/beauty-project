# Elaris — Salon Booking System
## Project Architecture & Implementation Plan

> **Status:** Greenfield project — design prototype exists in `mekdi.html`  
> **Brand assets:** `photo_2026-08-17_06-32-24.jpg` (logo), Canva UI in `mekdi.html`

---

## 1. Current Project State

| Asset | Purpose |
|-------|---------|
| `mekdi.html` | Canva design prototype — primary UI reference |
| `photo_2026-08-17_06-32-24.jpg` | Elaris brand logo |
| Backend | **To be created** |
| Frontend | **To be created** |
| Database | **To be created** |

Nothing is implemented yet. The Canva HTML is the source of truth for visual design — colors, typography, layouts, and UX patterns should be preserved when building the React apps.

---

## 2. Design System (from Canva)

### Colors (CSS variables)

```css
:root {
  --ink: #24201d;
  --cream: #fbf8f3;
  --paper: #fffdf9;
  --sand: #eee5d8;
  --bronze: #a16e45;
  --line: #e8dfd4;
  --muted: #716a63;
  --green: #437a58;
  --red: #a45345;
}
```

### Typography

- **Body:** DM Sans (400, 500, 600, 700)
- **Headings:** Fraunces (500, 600)

### Core UI Components

| Component | Usage |
|-----------|-------|
| `soft-card` | Cards with paper background, subtle border/shadow |
| `btn-primary` | Dark pill button (`#29231f`), bronze hover |
| `btn-secondary` | Outlined pill button |
| `portal-sidebar` | Dark sidebar for owner/admin/staff (`#29231f`) |
| `portal-link` | Sidebar navigation items |
| `stat` | Dashboard statistic cards |
| `status` | Appointment badges (confirmed, pending, cancelled, completed) |
| `choice` | Selectable service/option cards |
| `chart-bars` | Simple bar charts for analytics |
| Toast | Bottom notification bar |

### Icons

- **Lucide** (`lucide-react` in React apps)

---

## 3. Repository Structure

```
elaris/
├── backend/                    # Node.js + Express + MongoDB
├── packages/
│   └── shared-ui/              # Shared design tokens + components
├── frontend/
│   ├── customer-app/           # Public site + customer portal
│   ├── owner-app/              # Salon owner dashboard
│   ├── staff-app/              # Staff dashboard
│   └── admin-app/              # Platform admin dashboard
├── assets/
│   └── logo.jpg
├── uploads/                    # Backend-served images
├── mekdi.html                  # Design reference (keep)
├── ARCHITECTURE.md             # This file
└── package.json                # npm workspaces root
```

---

## 4. Tech Stack

### Frontend (each app)

- React 18
- Vite
- JavaScript (or TypeScript if preferred later)
- Tailwind CSS
- React Router
- Redux Toolkit (auth, user, notifications)
- lucide-react
- axios (with `credentials: 'include'` for cookies)

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (httpOnly cookies)
- bcrypt
- Joi validation
- Helmet
- CORS
- dotenv
- multer (image uploads)

---

## 5. Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
├──────────────┬──────────────┬──────────────┬────────────────┤
│ Customer App │  Owner App   │  Staff App   │   Admin App    │
│   :5173      │   :5174      │   :5175      │    :5176       │
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬───────┘
       │              │              │                │
       └──────────────┴──────────────┴────────────────┘
                              │
                    shared-ui package
                              │
                              ▼
                    ┌─────────────────┐
                    │  Express API    │
                    │     :5000       │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
          MongoDB        JWT Auth      uploads/
```

---

## 6. Role-Based Interfaces

### 6.1 Customer App

**Public pages (from Canva):**

| Route | Canva section | Features |
|-------|---------------|----------|
| `/` | `#home` | Hero, service categories, featured salons |
| `/services` | `#services` | Browse all services |
| `/salons` | `#salons` | Browse salons |
| `/salons/:id` | *new* | Salon detail, services, staff, reviews |
| `/book` | `#booking` | Multi-step booking wizard |
| `/portal` | `#role-entry` | Role selection / login entry |

**Authenticated customer:**

| Route | Canva section | Features |
|-------|---------------|----------|
| `/login` | *new* | Login |
| `/register` | *new* | Register |
| `/dashboard` | `#customer` | Upcoming appointments, notifications |
| `/appointments` | *new* | Upcoming + past appointments |
| `/appointments/:id` | *new* | Detail, cancel, reschedule |
| `/favorites` | *new* | Favorite salons |
| `/profile` | *new* | Customer profile |

**Customer features:**

- Register, login, logout
- Browse, search, filter salons
- View salon details, services, staff, prices, duration
- Book appointment (salon → service → staff → date → time)
- View confirmation
- View upcoming / previous appointments
- Cancel / reschedule
- Favorite salons
- Profile + notifications

---

### 6.2 Owner App

**Portal layout:** Dark sidebar + cream content (from `#owner`)

| View | Canva ID | Features |
|------|----------|----------|
| Overview | `owner-overview` | Stats, today's schedule, insights |
| Schedule | `owner-schedule` | Accept/reject/cancel/complete bookings |
| Staff | `owner-staff` | Add/edit/delete staff, assign services |
| Services | `owner-services` | Add/edit/delete services, prices, duration |
| Gallery | `owner-gallery` | Upload salon images |
| Reviews | `owner-reviews` | View and reply to reviews |
| Profile | `owner-profile` | Salon name, phone, hours, social |

**Owner features:**

- Register / login (separate from customer UI)
- Dashboard: appointments, revenue, customers, stats
- Manage salon profile, location, hours, images
- Manage services and staff
- Manage appointment schedule
- Accept/reject/cancel/complete appointments
- View customer info and reviews
- Notifications + profile settings

---

### 6.3 Staff App

> **Note:** Not in Canva design — build using the same portal shell as owner/admin.

| View | Features |
|------|----------|
| Dashboard | Today's + upcoming appointments |
| Appointments | Detail view, mark completed |
| Availability | Update personal schedule |
| Profile | Staff profile settings |
| Notifications | Alerts |

**Staff features:**

- Staff login (linked to Staff record + User account)
- Personal dashboard
- View assigned appointments and customer info
- Mark appointments completed
- Update availability

---

### 6.4 Admin App

**Portal layout:** From `#admin`

| View | Canva ID | Features |
|------|----------|----------|
| Overview | `admin-overview` | Platform stats, charts, alerts |
| Appointments | `admin-appointments` | All appointments, status filters |
| Salons | `admin-salons` | Approve/reject salon registrations |
| Services | `admin-services` | Platform service management |
| Users | `admin-users` | Manage customers, owners, admins |
| Analytics | `admin-analytics` | Peak hours, service popularity |

**Admin features:**

- Admin login
- Dashboard statistics
- Manage customers, owners, salons, staff, services
- View all appointments
- Review reported salons
- Platform analytics

---

## 7. Backend API

### 7.1 Folder Structure

```
backend/
├── config/
│   ├── db.js
│   └── env.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── salonController.js
│   ├── serviceController.js
│   ├── staffController.js
│   ├── appointmentController.js
│   ├── notificationController.js
│   └── adminController.js
├── middleware/
│   ├── auth.js              # Verify JWT from httpOnly cookie
│   ├── authorize.js           # Role-based access (from req.user only)
│   ├── validate.js            # Joi validation wrapper
│   ├── upload.js              # Multer for images
│   └── errorHandler.js
├── models/
│   ├── User.js
│   ├── Salon.js
│   ├── Service.js
│   ├── Staff.js
│   ├── Appointment.js
│   ├── Notification.js
│   ├── Favorite.js
│   └── Review.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── salonRoutes.js
│   ├── serviceRoutes.js
│   ├── staffRoutes.js
│   ├── appointmentRoutes.js
│   ├── notificationRoutes.js
│   └── adminRoutes.js
├── services/
│   ├── authService.js
│   ├── appointmentService.js  # Availability + double-booking prevention
│   ├── notificationService.js
│   └── analyticsService.js
├── utils/
│   ├── ApiError.js
│   ├── catchAsync.js
│   └── timeSlots.js
├── validators/
├── uploads/
├── app.js
├── server.js
├── .env.example
└── package.json
```

### 7.2 API Routes

| Prefix | Endpoints |
|--------|-----------|
| `/api/auth` | POST register, login, logout · GET me |
| `/api/users` | GET/PATCH profile · admin: list/manage users |
| `/api/salons` | GET list/detail (public) · owner: CRUD own · admin: approve |
| `/api/services` | GET by salon · owner: CRUD · admin: toggle |
| `/api/staff` | GET by salon · owner: CRUD · staff: update availability |
| `/api/appointments` | POST create · GET (role-scoped) · PATCH cancel/reschedule/status |
| `/api/notifications` | GET list · PATCH mark read |
| `/api/admin` | GET stats/analytics · manage platform resources |

### 7.3 Authentication & Authorization

**Flow:**

1. User logs in → backend validates credentials
2. Backend sets JWT in **httpOnly, secure cookie**
3. Frontend sends requests with `credentials: 'include'`
4. `auth` middleware verifies token → attaches `req.user`
5. `authorize('owner')` checks `req.user.role` from token/DB

**Security rule:** Never trust role from frontend request body. Always use authenticated user from JWT.

**Role permissions:**

| Role | Can do |
|------|--------|
| `customer` | Own profile, create/view/cancel/reschedule own appointments |
| `owner` | Manage own salon, services, staff, salon appointments |
| `staff` | View assigned appointments, update availability, mark completed |
| `admin` | Full platform access |

---

## 8. MongoDB Models

### User

```js
{
  name: String,
  email: String,        // unique
  password: String,     // bcrypt hashed
  phone: String,
  role: String,         // customer | owner | staff | admin
  profileImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Salon

```js
{
  ownerId: ObjectId,    // ref User
  name: String,
  description: String,
  location: {
    address: String,
    city: String,
    coordinates: { lat: Number, lng: Number }
  },
  phone: String,
  email: String,
  images: [String],
  openingHours: {
    monday: { open: String, close: String, closed: Boolean },
    // ... other days
  },
  rating: Number,
  status: String,       // pending | approved | rejected | suspended
  createdAt: Date,
  updatedAt: Date
}
```

### Service

```js
{
  salonId: ObjectId,
  name: String,
  description: String,
  price: Number,
  duration: Number,     // minutes
  category: String,
  image: String,
  status: String,       // active | inactive
  createdAt: Date,
  updatedAt: Date
}
```

### Staff

```js
{
  userId: ObjectId,     // optional — for staff login
  salonId: ObjectId,
  name: String,
  profileImage: String,
  specialization: String,
  services: [ObjectId], // ref Service
  availability: {
    monday: { start: String, end: String, available: Boolean },
    // ... other days
  },
  status: String,       // active | away | inactive
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment

```js
{
  customerId: ObjectId,
  salonId: ObjectId,
  staffId: ObjectId,
  serviceId: ObjectId,
  date: Date,
  startTime: String,    // "10:30"
  endTime: String,      // computed from service duration
  status: String,       // pending | confirmed | rejected | cancelled | completed | no-show
  price: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Appointment statuses:** `pending`, `confirmed`, `rejected`, `cancelled`, `completed`, `no-show`

**Indexes:**

```js
Appointment: { staffId: 1, date: 1, status: 1 }
Appointment: { customerId: 1, date: -1 }
Appointment: { salonId: 1, date: 1 }
User: { email: 1 } unique
Favorite: { customerId: 1, salonId: 1 } unique
```

---

## 9. Booking Logic (Double-Booking Prevention)

Backend must validate before creating any appointment:

```
POST /api/appointments
  │
  ├─ 1. Validate salon, service, staff, date, startTime (Joi)
  ├─ 2. Load service → compute endTime from duration
  ├─ 3. Verify staff belongs to salon and offers the service
  ├─ 4. Verify date/time within staff availability
  ├─ 5. Verify date/time within salon opening hours
  ├─ 6. Query existing appointments:
  │      same staffId + same date
  │      status IN [pending, confirmed]
  │      time ranges overlap
  ├─ 7. If conflict → 409 Conflict
  └─ 8. Create appointment (status: pending or confirmed)
```

**Do not rely on frontend-only validation.**

---

## 10. Frontend App Structure (each app)

```
frontend/customer-app/
├── public/
├── src/
│   ├── app/
│   │   ├── store.js              # Redux store
│   │   └── router.jsx            # React Router + guards
│   ├── features/
│   │   ├── auth/
│   │   ├── salons/
│   │   ├── booking/
│   │   ├── appointments/
│   │   ├── profile/
│   │   └── notifications/
│   ├── layouts/
│   │   ├── PublicLayout.jsx      # Header + footer (Canva public pages)
│   │   └── CustomerLayout.jsx    # Logged-in layout
│   ├── pages/                    # Route-level components
│   ├── components/               # App-specific components
│   ├── hooks/
│   ├── api/                      # API client functions
│   ├── main.jsx
│   └── index.css                 # Tailwind + design tokens
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

Owner, staff, and admin apps follow the same pattern with portal layouts.

---

## 11. Shared UI Package

```
packages/shared-ui/
├── src/
│   ├── styles/
│   │   └── tokens.css            # CSS variables from Canva
│   ├── components/
│   │   ├── Button.jsx            # btn-primary, btn-secondary
│   │   ├── SoftCard.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── StatCard.jsx
│   │   ├── ChoiceCard.jsx
│   │   ├── PortalShell.jsx       # Sidebar + header layout
│   │   ├── PortalSidebar.jsx
│   │   ├── Toast.jsx
│   │   └── Logo.jsx
│   ├── api/
│   │   ├── client.js             # axios instance
│   │   └── auth.js
│   └── index.js
└── package.json
```

---

## 12. Environment Variables

### Backend `.env`

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elaris
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URLS=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176
UPLOAD_PATH=./uploads
```

### Frontend `.env` (each app)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 13. Canva → React Mapping

| Canva screen | React component | Data source |
|--------------|-----------------|-------------|
| `#home` | `HomePage` | GET /api/salons (featured) |
| `#services` | `ServicesPage` | GET /api/services |
| `#salons` | `SalonsPage` | GET /api/salons |
| `#booking` | `BookingPage` | POST /api/appointments |
| `#role-entry` | `PortalEntryPage` | — |
| `#customer` | `CustomerDashboard` | GET /api/appointments/me |
| `#owner` | Owner app routes | Owner-scoped APIs |
| `#admin` | Admin app routes | Admin APIs |

Static examples like "Maison Muse" become seed data in MongoDB.

---

## 14. UI States to Implement

Every data-driven view needs:

- **Loading** — skeleton or spinner matching design
- **Error** — friendly message + retry
- **Empty** — helpful CTA (e.g. "No appointments yet — book one")
- **Success** — toast confirmations (like Canva prototype)
- **Form validation** — inline errors on inputs
- **Confirmation dialogs** — cancel appointment, delete service, etc.

---

## 15. Implementation Phases

### Phase 1 — Foundation
- [ ] Monorepo scaffold (root package.json + workspaces)
- [ ] Backend: Express setup, MongoDB connection, User model
- [ ] Backend: Auth (register, login, logout, JWT cookies)
- [ ] shared-ui: Design tokens + Button, SoftCard, Logo
- [ ] customer-app: Vite + Tailwind + Home page from Canva

### Phase 2 — Customer MVP
- [ ] Salon, Service, Staff, Appointment models + seed data
- [ ] Public pages: Home, Services, Salons, Salon detail
- [ ] Search and filter salons
- [ ] Full booking wizard with backend availability check
- [ ] Customer register/login
- [ ] Customer dashboard + appointment list
- [ ] Cancel appointment

### Phase 3 — Owner Portal
- [ ] owner-app scaffold with portal layout
- [ ] All owner views from Canva wired to API
- [ ] Service CRUD, staff CRUD, schedule management
- [ ] Gallery upload, business profile
- [ ] Accept/reject/complete appointments

### Phase 4 — Staff + Admin
- [ ] staff-app with portal layout
- [ ] admin-app with all Canva admin views
- [ ] Salon approval workflow
- [ ] Platform analytics

### Phase 5 — Polish
- [ ] Notifications system
- [ ] Favorites
- [ ] Reschedule flow
- [ ] Reviews
- [ ] Responsive QA (mobile sidebar drawer)
- [ ] Error handling everywhere

---

## 16. Open Decisions

| Decision | Options | Recommendation |
|----------|---------|----------------|
| Four apps vs one SPA | 4 Vite apps / 1 app with route prefixes | **4 apps** — stronger role separation |
| Staff accounts | Staff as User with role `staff` / owner-created only | **User + Staff link** — enables staff login |
| Booking approval | Auto-confirm / owner confirms | **Pending until owner confirms** |
| Currency | ETB (from prototype) / configurable | **ETB** — matches Canva sample data |
| Logo on cream UI | Navy logo / light variant | Use provided logo; adjust size/padding |

---

## 17. Seed Data (from Canva prototype)

Use these as initial MongoDB seed values:

**Salons:**
- Maison Muse — Bole · Hair & beauty · ★ 4.9
- Soleil Studio — Kazanchis · Nails & skincare · ★ 4.8
- The Grooming Room — Old Airport · Grooming · ★ 4.9

**Services:**
- Signature Cut & Style — 650 ETB · 60 min
- Dimensional Color — 1,800 ETB · 150 min
- Glow Facial — 950 ETB · 60 min

**Staff (Maison Muse):**
- Sofia A. — Cut & styling
- Aster G. — Color specialist
- Eden T. — Makeup artist

---

## 18. Next Step

Start **Phase 1**:

1. Create monorepo root with npm workspaces
2. Scaffold backend with auth
3. Create `shared-ui` with design tokens from `mekdi.html`
4. Scaffold `customer-app` and port the Home page

---

*Generated for Elaris — Beauty, beautifully booked.*
