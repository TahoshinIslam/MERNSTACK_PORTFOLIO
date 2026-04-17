# Portfolio CMS — MERN Stack

A modern admin dashboard for managing your portfolio content, built with **React + Vite** (frontend) connecting to the existing **Express + MongoDB** backend.

---

## 🗂 Structure

```
portfolio-cms/
├── frontend/               ← React 18 + Vite admin UI
│   ├── src/
│   │   ├── api/index.js        ← Axios service layer
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  ← Auth state (login/register/logout)
│   │   │   └── ToastContext.jsx ← Global toast notifications
│   │   ├── components/
│   │   │   ├── Sidebar.jsx      ← Navigation sidebar
│   │   │   └── CrudPage.jsx     ← Reusable CRUD table + modal
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx     ← Login / Register
│   │   │   ├── Dashboard.jsx    ← Stats overview
│   │   │   ├── BlogPage.jsx     ← Blog with pagination
│   │   │   ├── Sections.jsx     ← Portfolio, Services, Experience,
│   │   │   │                       Education, Advantages, Testimonials,
│   │   │   │                       Contacts, Comments
│   │   │   └── SettingsPage.jsx ← Account + file upload
│   │   ├── App.jsx              ← Router + protected routes
│   │   ├── index.css            ← Full design system (dark editorial)
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js          ← Dev proxy → localhost:5005
│   └── package.json
│
├── backend-src/            ← Your original backend source (reference)
├── app.js                  ← Your Express app
├── index.js                ← Server entry
└── .env.example
```

---

## 🚀 Running

### 1. Start the backend (your existing server)

```bash
# In your backend directory:
npm install
node index.js
# Runs on http://localhost:5005
```

### 2. Start the React frontend

```bash
cd frontend
npm install
npm run dev
# Opens http://localhost:5173
```

The Vite dev server proxies all `/api/*` requests to `localhost:5005` — no CORS issues.

---

## ✨ Features

| Section         | View | Create | Edit | Delete |
|-----------------|------|--------|------|--------|
| Dashboard       | ✅ stats | — | — | — |
| Portfolio       | ✅ | ✅ | ✅ | ✅ |
| Blog            | ✅ paginated | ✅ | ✅ | ✅ |
| Services        | ✅ | ✅ | ✅ | ✅ |
| Experience      | ✅ | ✅ | ✅ | ✅ |
| Education       | ✅ | ✅ | ✅ | ✅ |
| Advantages/Skills | ✅ progress bars | ✅ | ✅ | ✅ |
| Testimonials    | ✅ | ✅ | ✅ | ✅ |
| Contacts        | ✅ read-only | — | — | ✅ |
| Comments        | ✅ read-only | — | — | ✅ |
| Settings        | ✅ | ✅ file upload | ✅ password | — |

---

## 🎨 Design

**Dark editorial luxury** theme:
- **Font**: Playfair Display (serif display) + DM Sans (body) + DM Mono (labels)
- **Color**: Deep charcoal backgrounds with gold accent (`#c9a84c`)
- **Style**: Precise typography, subtle borders, gold highlights, smooth animations

---

## 🔌 API Endpoints Used

All under `/api/v1/`:

| Auth | `POST /register`, `POST /login`, `GET /logout`, `GET /user`, `PUT /update` |
|------|---|
| File | `POST /file-upload` |
| CRUD | `POST/GET/PUT/DELETE` for portfolio, blog, service, experience, education, advantage, testimonial, contact, comment |
