# Elaris — Salon Booking System (MERN)

Full-stack salon booking platform built from the Canva design in `mekdi.html`.

## Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Redux Toolkit
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth:** JWT in httpOnly cookies, bcrypt, role-based access

## Project structure

```
backend/                 # Express REST API
frontend/customer-app/   # Public site + customer portal  → :5173
frontend/owner-app/    # Salon owner dashboard          → :5174
frontend/staff-app/    # Staff dashboard                → :5175
frontend/admin-app/    # Admin dashboard                → :5176
packages/shared-ui/    # Shared Canva design components
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start MongoDB

Make sure MongoDB is running locally on `mongodb://127.0.0.1:27017`

### 3. Seed the database

```bash
npm run seed
```

### 4. Start the backend

```bash
npm run dev:backend
```

### 5. Start frontends (separate terminals)

```bash
npm run dev:customer
npm run dev:owner
npm run dev:staff
npm run dev:admin
```

## Demo accounts (after seed)

| Role     | Email                  | Password     |
|----------|------------------------|--------------|
| Admin    | admin@elaris.co        | admin123     |
| Customer | liya@elaris.co         | customer123  |
| Owner    | owner@maisonmuse.co    | owner123     |
| Staff    | sofia@maisonmuse.co    | staff123     |

## URLs

- Customer: http://localhost:5173
- Owner: http://localhost:5174
- Staff: http://localhost:5175
- Admin: http://localhost:5176
- API: http://localhost:5000/api

## API routes

- `/api/auth` — register, login, logout, me
- `/api/users` — profile management
- `/api/salons` — browse, favorites, owner salon CRUD
- `/api/services` — services CRUD
- `/api/staff` — staff management
- `/api/appointments` — booking with double-booking prevention
- `/api/notifications` — user notifications
- `/api/admin` — platform stats and analytics

## Design reference

UI follows the Canva prototype in `mekdi.html` — cream/bronze palette, DM Sans + Fraunces typography, portal sidebars for owner/staff/admin.

See `ARCHITECTURE.md` for full system documentation.
