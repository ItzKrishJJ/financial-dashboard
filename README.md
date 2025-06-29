# 📈 Financial Dashboard

A modern full-stack financial analytics dashboard built with **React**, **Node.js (Express)**, **MongoDB**, and **TypeScript**. It allows users to authenticate, manage transactions, and visualize financial performance through charts and statistics.

---

## 📊 Features

* 🔐 User Authentication (Register/Login)
* 💰 Add, filter, and sort transactions (Revenue/Expenses)
* 📊 Interactive charts and dashboard insights
* 📱 Responsive UI built with modern UI libraries
* 📀 Backend powered by MongoDB with Mongoose

---

## 🛠️ Project Setup

### ✅ Prerequisites

* Node.js (v18 or later)
* MongoDB (local or cloud)
* Git

### ⚙️ Installation Steps

1. **Clone the repository:**

```bash
git clone https://github.com/ItzKrishJJ/financial-dashboard
cd financial-dashboard
```

2. **Install dependencies:**

At the root:

```bash
npm install
```

In the `client` directory:

```bash
cd client
npm install
```

In the `server` directory:

```bash
cd ../server
npm install
```

3. **Run the app:**

```bash
npm run dev
```

This will concurrently start the Vite React client and Express backend.

---

## 🔐 Using the Postman Collection

Use Postman to test all available API routes:

📁 [Download Postman Collection (Gist)](https://gist.github.com/ItzKrishJJ/ba44553e0a4bcac727e0bf2be6a2197e)

### ✅ Steps to Use:

1. **Download & Import the Collection:**

   * Download the `.json` file from the Gist link above.
   * Open **Postman**, click **"Import"**, and select the file.

2. **Start the application:**

   * Run the app using `npm run dev` and ensure it's running on `http://localhost:8082`.

3. **Login to get your JWT token:**

   * Visit `http://localhost:8080/login` in the browser.
   * Open DevTools → `Application` → `Local Storage` → Copy the value of `auth_token`.

4. **Set Bearer Token in Postman:**

   * Go to any request in the Postman collection.
   * Click **Authorization** → **Type: Bearer Token** → Paste your token.

✅ Now you can send authenticated requests to test all endpoints!

---

## 📡 API Endpoints

| Method | Endpoint                       | Description               | Auth Required | Payload / Params                     |
| ------ | ------------------------------ | ------------------------- | ------------- | ------------------------------------ |
| POST   | `/api/auth/register`           | Register a new user       | ❌ No          | `{ email, password, name }`          |
| POST   | `/api/auth/login`              | User login & get token    | ❌ No          | `{ email, password }`                |
| GET    | `/api/auth/me`                 | Get current user info     | ✅ Yes         | -                                    |
| POST   | `/api/auth/logout`             | Logout (client-side only) | ✅ Yes         | -                                    |
| GET    | `/api/transactions`            | Fetch transactions        | ✅ Yes         | `page, limit, sortBy, category, ...` |
| POST   | `/api/transactions`            | Add a new transaction     | ✅ Yes         | `{ date, amount, category, ... }`    |
| GET    | `/api/transactions/stats`      | Fetch dashboard stats     | ✅ Yes         | -                                    |
| GET    | `/api/transactions/chart-data` | Monthly/yearly chart data | ✅ Yes         | Optional: `period=12` or `period=24` |

---

## 🔄 Project Flow

### 1. User Journey

* Users can register or log in to receive a **JWT token**.
* This token is saved in `localStorage` and used to authenticate further API requests.

### 2. Dashboard Behavior

* Once authenticated, the user dashboard fetches transactions, calculates totals, and displays charts.

### 3. MongoDB Integration

* All user and transaction data is stored in **MongoDB**.
* Mongoose schemas ensure structure, validation, and indexing.

### 4. Frontend Stack

* Built with **React + Vite**.
* Styled using **TailwindCSS**.
* Charts powered by **Recharts**.
* Data fetching with **React Query**.

---

## 📆 Sample Transaction Format

```json
{
  "date": "2025-02-10",
  "amount": 200,
  "category": "Expense",
  "status": "Paid",
  "user_id": "demo-user-id2",
  "user_profile": "Demo User2",
  "description": "Electricity bill"
}
```

You can add multiple such entries using Postman or seed them in your database.

---

## 🛠️ Technologies Used

| Layer     | Stack                              |
| --------- | ---------------------------------- |
| Frontend  | React, Vite, TailwindCSS, Recharts |
| Backend   | Node.js, Express.js, TypeScript    |
| Database  | MongoDB, Mongoose                  |
| Auth      | JWT-based Authentication           |
| Dev Tools | TSX, Concurrently, Postman         |

---
## PROJECT DEMO VIDEO : https://drive.google.com/file/d/1bomqqmxu-Ydm-svuiBszK1l_ugI61C6N/view?usp=drive_link

## 👤 Author

**@ItzKrishJJ** — [GitHub](https://github.com/ItzKrishJJ)

---

## 📄 License

This project is **open-source** and free to use
