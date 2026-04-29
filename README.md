Here’s a **clean, professional README.md** you can paste directly into your GitHub repo.

---

# 🏠 Property Dealer CRM System

A full-stack **Customer Relationship Management (CRM)** system built using **Next.js (App Router)** and **MongoDB** for managing property leads, agent assignments, and analytics.

---

## 🚀 Features

### 🔐 Authentication

* User Signup & Login
* Password hashing using **bcrypt**
* JWT-based authentication (stored in cookies)

### 👤 Role-Based Access Control (RBAC)

* **Admin**

    * Create leads
    * Assign leads to agents
    * View all leads
    * Access analytics dashboard
* **Agent**

    * View assigned leads only
    * Interact with leads
    * Cannot create or assign leads

---

### 📋 Lead Management

* Create, view, and manage leads
* Lead information includes:

    * Name
    * Email
    * Phone
    * Property interest
    * Budget

---

### ⭐ Lead Scoring

Leads are automatically categorized based on budget:

* High Priority
* Medium Priority
* Low Priority

---

### 🔄 Lead Assignment

* Admin can assign leads to agents
* Agents only see their assigned leads

---

### 💬 WhatsApp Integration

* One-click WhatsApp chat with leads

---

### 📜 Activity Timeline

* Track all actions:

    * Lead creation
    * Assignment updates
    * Follow-up changes

---

### ⏰ Follow-Up System

* Set follow-up dates
* Overdue leads highlighted in red

---

### 📊 Analytics Dashboard (Admin)

* Total leads
* Priority distribution
* Status distribution
* Agent performance overview

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), Tailwind CSS
* **Backend:** Next.js API Routes
* **Database:** MongoDB + Mongoose
* **Authentication:** JWT + Cookies
* **Security:** bcrypt
* **Version Control:** Git & GitHub
* **Deployment:** Vercel

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── leads/
│   │   ├── users/
│   │   └── analytics/
│   ├── leads/
│   ├── dashboard/
│   ├── login/
│   └── signup/
├── lib/
│   ├── db.js
│   └── auth.js
├── models/
│   ├── User.js
│   └── Lead.js
```

---

## ⚙️ Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## ▶️ Running Locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🌐 Deployment

Deployed using **Vercel**:

1. Push project to GitHub
2. Import repo into Vercel
3. Add environment variables
4. Deploy

---

## 🧠 Future Improvements

* Email notifications on lead assignment
* Real-time updates (polling / sockets)
* API rate limiting
* Export reports (CSV/PDF)

---

## 📌 Git Workflow

* Feature-based branching
* Regular commits
* Proper merges into `main`

Example:

```bash
git checkout -b feature/feature-name
git add .
git commit -m "Feature description"
git push -u origin feature/feature-name
```

---

## 👨‍💻 Author

**Salman Umar**
BS Computer Science

---

## 📄 License

This project is for academic purposes.

---

## ⭐ Final Note

This project demonstrates:

* Full-stack development
* Secure authentication
* Role-based systems
* Real-world CRM functionality
* Data-driven analytics

---

