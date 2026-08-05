# 🎟️ Eventrix — Event Booking Platform

**Eventrix** is a full-stack event discovery and booking platform built with React, Node.js, Express, and MongoDB. Users can browse events, register with OTP email verification, book tickets, and track their bookings — while admins can manage events and confirm bookings.

> **Book. Discover. Experience.**

---

## ✨ Features

### 👤 User Features
- Register & login with **JWT authentication**
- **Email OTP verification** for account activation and secure login
- Browse and filter events by **category** and **search**
- View detailed event pages with seat availability and ticket pricing
- Book event tickets with a **booking OTP** sent to email
- View and cancel your own bookings
- Track payment status for each booking

### 🛡️ Admin Features
- Dedicated admin dashboard
- Create, update, and delete events
- Confirm / cancel user bookings
- Mark bookings as paid or unpaid
- View all bookings across all users
- Secure **role-based route protection** (admin middleware)

### ⚙️ General
- Email notifications via **Nodemailer** (Gmail)
- Automatic seat availability tracking (decrement on confirm, restore on cancel)
- OTP codes expire after **5 minutes**
- Responsive UI built with **Tailwind CSS**

---

## 🧰 Tech Stack

### Frontend (`client/`)
| Technology | Purpose |
|------------|---------|
| **React 19** | UI library |
| **Vite 8** | Build tool & dev server |
| **React Router 7** | Client-side routing |
| **Tailwind CSS 4** | Styling |
| **Axios** | HTTP client with JWT interceptor |
| **Context API** | Auth state management |
| **React Icons** | Icons |

### Backend (`server/`)
| Technology | Purpose |
|------------|---------|
| **Node.js + Express 5** | REST API server |
| **MongoDB + Mongoose 9** | Database & ODM |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Nodemailer** | OTP & booking emails |
| **dotenv** | Environment variables |
| **cors** | Cross-origin requests |

---

## 📁 Project Structure

```
Eventrix/
├── client/                     # React frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── App.jsx             # App entry + routes
│       ├── main.jsx            # React root render
│       ├── index.css           # Tailwind styles
│       ├── components/
│       │   └── Navbar.jsx      # Top navigation bar
│       ├── context/
│       │   └── AuthContext.jsx # Auth state management
│       ├── pages/
│       │   ├── Home.jsx            # Event listing
│       │   ├── EventDetail.jsx     # Single event view + booking
│       │   ├── Login.jsx           # Login (with OTP flow)
│       │   ├── Register.jsx        # Registration (with OTP flow)
│       │   ├── UserDashboard.jsx   # User bookings dashboard
│       │   ├── AdminDashboard.jsx  # Admin event & booking management
│       │   ├── PaymentSuccess.jsx  # Booking success page
│       │   └── PaymentFailed.jsx   # Booking failure page
│       └── utils/
│           └── axios.js        # Axios instance with JWT interceptor
│
└── server/                     # Node.js + Express backend
    ├── server.js               # Server entry point
    ├── seed.js                 # Demo data seeder
    ├── package.json
    ├── .env.example            # Environment variable template
    ├── controllers/
    │   ├── authController.js   # Register, login, verify OTP
    │   ├── eventController.js  # CRUD for events
    │   └── bookingController.js# Booking workflow logic
    ├── middleware/
    │   └── auth.js             # JWT protect + admin guards
    ├── models/
    │   ├── User.js             # User schema
    │   ├── Event.js            # Event schema
    │   ├── Booking.js          # Booking schema
    │   └── Otp.js              # OTP schema
    ├── routes/
    │   ├── auth.js             # /api/auth routes
    │   ├── events.js           # /api/events routes
    │   └── booking.js          # /api/bookings routes
    └── utils/
        └── email.js            # Nodemailer email helpers
```

---

## 🔧 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A Gmail account with an [app password](https://support.google.com/accounts/answer/185833) for sending emails

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/eventrix.git
cd Eventrix
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory (refer to `.env.example`):

```env
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/eventrix
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### 3. Seed the database (optional)

Populate the database with demo users, events, and bookings:

```bash
npm run seed
```

### 4. Start the backend server

```bash
npm run dev          # uses nodemon (auto-restart)
# or
npm start            # production start
```

The API will run at `http://localhost:5000`.

### 5. Set up the frontend

Open a **new terminal** and run:

```bash
cd client
npm install
npm run dev
```

The app will run at `http://localhost:5173`.

> **Note:** The frontend Axios instance points to `http://localhost:5000/api` by default (see `client/src/utils/axios.js`). Update this if your backend runs elsewhere.

---

## 🌍 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Port for the backend server (default: `5000`) |
| `MONGO_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `EMAIL_USER` | Gmail address used to send emails |
| `EMAIL_PASS` | Gmail app password (not your regular password) |

---

## 🔌 API Reference

Base URL: `http://localhost:5000/api`

### Auth Routes — `/api/auth`
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register a new user (sends OTP) | Public |
| POST | `/login` | Login (sends OTP if unverified) | Public |
| POST | `/verify-otp` | Verify email with OTP | Public |

### Event Routes — `/api/events`
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | List all events (filter by `category`, `search`) | Public |
| GET | `/:id` | Get a single event | Public |
| POST | `/` | Create an event | Admin |
| PUT | `/:id` | Update an event | Admin |
| DELETE | `/:id` | Delete an event | Admin |

### Booking Routes — `/api/bookings`
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/send-otp` | Send booking OTP to user email | User |
| POST | `/` | Submit a booking request (requires OTP) | User |
| PUT | `/:id/confirm` | Confirm a booking (optionally set payment) | Admin |
| GET | `/my` | Get my bookings (admins see all) | User/Admin |
| DELETE | `/:id` | Cancel a booking | User/Admin |

---

## 👤 Demo Accounts

After running `npm run seed`, the following accounts are available:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@eventrix.com` | `password123` |
| **User** | `user@eventrix.com` | `password123` |

Additional seeded users: `alice@eventrix.com`, `bob@eventrix.com`, `charlie@eventrix.com`, `diana@eventrix.com`, `ethan@eventrix.com`, `fiona@eventrix.com`, `george@eventrix.com`, `hannah@eventrix.com` — all with password `password123`.

---

## 🧠 How Booking Works

1. A user browses events and selects one to book.
2. The app requests a **booking OTP**, which is emailed to the user.
3. The user submits the OTP along with the event ID to create a booking.
4. The booking is created with status `pending` and payment `not_paid`.
5. An **admin** reviews and confirms the booking, optionally marking it `paid`.
6. On confirmation, the seat count is decremented and the user receives a confirmation email.
7. Users (or admins) can cancel bookings; cancelled confirmed bookings restore the seat.

---

## 📜 Available Scripts

### Backend (`server/package.json`)
| Script | Command | Description |
|--------|---------|-------------|
| `start` | `node server.js` | Start the server |
| `dev` | `nodemon server.js` | Start with auto-restart |
| `seed` | `node seed.js` | Seed demo data |

### Frontend (`client/package.json`)
| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start dev server |
| `build` | `vite build` | Production build |
| `preview` | `vite preview` | Preview production build |
| `lint` | `eslint .` | Lint the code |

---

## 📝 License

This project is licensed under the **ISC License**.

---

## 🙌 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.
