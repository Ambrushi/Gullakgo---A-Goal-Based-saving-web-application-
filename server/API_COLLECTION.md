# Gullakgo Backend REST API Collection & Documentation

**Base Server URL**: `http://localhost:5000/api`

---

## 1. System Health
### `GET /api/health`
Checks if the Express + Sequelize backend server is active.

**Response `200 OK`**:
```json
{
  "status": "ok",
  "message": "Gullakgo Backend Express + Sequelize ORM Server is running 🔥"
}
```

---

## 2. Authentication & User Profile
### `POST /api/auth/signup`
Creates a new user profile in PostgreSQL database.

**Request Body**:
```json
{
  "name": "Aarav Sharma",
  "mobile": "9876543210",
  "email": "aarav@example.com",
  "password": "password123"
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "user": {
    "id": "usr_1740000000000",
    "name": "Aarav Sharma",
    "mobile": "9876543210",
    "email": "aarav@example.com",
    "handle": "@aarav_sharma",
    "avatar": "⚡",
    "level": "Rookie Saver 🌟",
    "totalSaved": 0,
    "globalStreak": 1,
    "parentLinked": false
  }
}
```

---

### `POST /api/auth/login`
Authenticates a user via mobile number and password.

**Request Body**:
```json
{
  "mobile": "9876543210",
  "password": "password123"
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "user": {
    "id": "usr_1740000000000",
    "name": "Aarav Sharma",
    "mobile": "9876543210",
    "level": "Savings Champion 🏆"
  }
}
```

---

### `PUT /api/auth/profile/:id`
Updates user profile information or links parent account.

**Request Body**:
```json
{
  "parentLinked": true,
  "parentName": "Rajesh Sharma (Dad)",
  "parentEmail": "rajesh.sharma@example.com"
}
```

---

## 3. Savings Goals
### `GET /api/goals?userId=usr_1740000000000`
Fetches all savings goals for a user along with their deposit contributions.

---

### `POST /api/goals`
Creates a new savings goal.

**Request Body**:
```json
{
  "userId": "usr_1740000000000",
  "title": "PlayStation 5 Digital Edition",
  "category": "Product",
  "icon": "bi-controller",
  "targetAmount": 45000,
  "targetDate": "2026-10-15",
  "dailySavingRate": 215,
  "lockIn": true
}
```

---

### `POST /api/goals/:id/contributions`
Deposits money into a goal and increments streak counter.

**Request Body**:
```json
{
  "userId": "usr_1740000000000",
  "amount": 2000,
  "note": "Daily Pocket Money Top-up 🔥"
}
```

---

### `PUT /api/goals/:id`
Updates a goal's target amount, title, or status.

---

### `DELETE /api/goals/:id`
Deletes a goal.

---

## 4. Expenses
### `GET /api/expenses?userId=usr_1740000000000`
Lists all logged expenses for a user.

---

### `POST /api/expenses`
Logs a new expense.

**Request Body**:
```json
{
  "userId": "usr_1740000000000",
  "title": "Boba Milk Tea & Fries",
  "amount": 220,
  "category": "Snacks & Drinks",
  "icon": "bi-cup-straw"
}
```

---

### `DELETE /api/expenses/:id`
Deletes an expense record.

---

## 5. Payments & Transactions
### `GET /api/payments?userId=usr_1740000000000`
Retrieves transaction history.

---

### `POST /api/payments`
Records a new UPI or subscription payment.

**Request Body**:
```json
{
  "userId": "usr_1740000000000",
  "utr": "UPI/628491038472",
  "type": "Subscription",
  "description": "Weekly Saver Plan Upgrade",
  "amount": 49,
  "status": "SUCCESS",
  "app": "Google Pay"
}
```

---

## 6. Subscriptions & AI Limits
### `GET /api/subscription?userId=usr_1740000000000`
Gets active subscription tier and daily AI coach usage limits.

---

### `POST /api/subscription/upgrade`
Upgrades user subscription tier (`free`, `daily`, `weekly`, `monthly`).

**Request Body**:
```json
{
  "userId": "usr_1740000000000",
  "planId": "weekly"
}
```
