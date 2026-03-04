# 🚗 Rentit - Vehicle Rental Management System

A simple, beginner-friendly full-stack vehicle rental management system built with **React**, **Tailwind CSS**, **Node.js**, **Express**, and **MySQL**.

## Tech Stack

| Layer         | Technology              |
|---------------|-------------------------|
| Frontend      | React + Tailwind CSS    |
| Backend       | Node.js + Express.js    |
| Database      | MySQL                   |
| Auth          | bcrypt (password hash)  |

## Features

- 🔐 User registration & login (email/password)
- 👤 Role-based access (Admin / Customer)
- 🚗 Vehicle CRUD (Admin)
- 👨‍✈️ Driver management (Admin)
- 📋 Booking system with price calculation
- ❌ Booking cancellation
- 🎨 Modern dark-themed responsive UI

---

## 🛠️ Setup Instructions

### 1. Database Setup (MySQL)

1. Install and start **MySQL** on your machine.
2. Open MySQL terminal or a GUI tool (MySQL Workbench, phpMyAdmin, etc.)
3. Run the schema file:

```sql
source backend/schema.sql;
```

Or copy-paste the contents of `backend/schema.sql` into your MySQL client.

> **Note:** The schema creates a database called `rentit_db`.

4. Update database credentials in `backend/db.js`:

```js
host: 'localhost',
user: 'root',          // Your MySQL username
password: '',           // Your MySQL password
database: 'rentit_db',
```

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

The server will start at **http://localhost:5000**

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will open at **http://localhost:5173**

---

## 📁 Project Structure

```
rentit-v0/
├── backend/
│   ├── server.js          # Express entry point
│   ├── db.js              # MySQL connection
│   ├── schema.sql         # Database schema
│   ├── package.json
│   └── routes/
│       ├── auth.js        # Register & Login
│       ├── vehicles.js    # Vehicle CRUD
│       ├── bookings.js    # Booking management
│       └── drivers.js     # Driver management
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx              # Entry point
│   │   ├── App.jsx               # Router setup
│   │   ├── index.css             # Global styles
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Auth state
│   │   │   └── ToastContext.jsx  # Notifications
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   └── pages/
│   │       ├── Home.jsx
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── customer/
│   │       │   ├── Dashboard.jsx
│   │       │   ├── VehicleList.jsx
│   │       │   ├── BookVehicle.jsx
│   │       │   └── MyBookings.jsx
│   │       └── admin/
│   │           ├── AdminDashboard.jsx
│   │           ├── AddVehicle.jsx
│   │           ├── ManageVehicles.jsx
│   │           ├── ManageDrivers.jsx
│   │           └── AllBookings.jsx
│   └── package.json
│
└── README.md
```

---

## 🔑 Creating an Admin User

1. Register a new account through the app
2. Open your MySQL client and run:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

3. Log out and log back in — you'll see the Admin Dashboard!

---

## 📡 API Routes

| Method | Route                    | Description              | Access    |
|--------|--------------------------|--------------------------|-----------|
| POST   | `/api/register`          | Register user            | Public    |
| POST   | `/api/login`             | Login user               | Public    |
| GET    | `/api/vehicles`          | List all vehicles        | Public    |
| POST   | `/api/vehicles`          | Add vehicle              | Admin     |
| PUT    | `/api/vehicles/:id`      | Update vehicle           | Admin     |
| DELETE | `/api/vehicles/:id`      | Delete vehicle           | Admin     |
| GET    | `/api/drivers`           | List all drivers         | Public    |
| POST   | `/api/drivers`           | Add driver               | Admin     |
| POST   | `/api/bookings`          | Create booking           | Customer  |
| GET    | `/api/bookings/:userId`  | Get user's bookings      | Customer  |
| GET    | `/api/bookings`          | Get all bookings         | Admin     |
| PUT    | `/api/bookings/cancel/:id` | Cancel booking         | Any       |
