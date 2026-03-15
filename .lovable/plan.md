

# Smart Curriculum Activity & Attendance System — UI Plan

## Overview
A modern, responsive education management dashboard with four role-based views (Admin, Teacher, Student, Parent). All data will be mock/static for now. The design will use a clean, professional theme with white, blue, and soft green colors.

---

## 🎨 Design System
- **Color palette**: White background, blue primary (#3B82F6), soft green accents (#10B981), subtle grays for borders
- **Typography**: Clean, large readable fonts with clear hierarchy
- **Style**: Modern SaaS dashboard with rounded cards, subtle shadows, smooth animations
- **Layout**: Sidebar navigation + top navbar, fully responsive (mobile-first)

---

## 📄 Pages & Features

### 1. Login / Register Page
- Role selection tabs (Admin, Teacher, Student, Parent)
- Email/Mobile + Password login form
- "Forgot Password" link with a simple reset modal
- Register form with role-specific fields
- Clean centered layout with an education-themed illustration area

### 2. Admin Dashboard
- Overview stat cards: Total Students, Teachers, Classes, Attendance %
- Recent activity feed
- Quick action buttons (Add User, Create Class, etc.)
- Mini charts for attendance trends and enrollment
- User management table with search and filters

### 3. Teacher Dashboard
- Today's schedule overview
- "Start Attendance" button (opens manual marking UI)
- Class-wise attendance summary cards
- Curriculum activity upload area
- Recent class reports list

### 4. Student Dashboard
- Attendance summary with percentage ring/donut chart
- Subject-wise progress bars
- Activity timeline (recent submissions, grades)
- Upcoming deadlines / notifications list

### 5. Parent Dashboard
- Child's attendance overview card
- Performance summary with subject grades
- Attendance alerts / notifications
- Communication panel (message list from teachers)

### 6. Attendance Page
- Real-time attendance marking interface (class selector + student list with checkboxes)
- Calendar view showing attendance history (color-coded days)
- Export report button
- Attendance statistics summary

### 7. Curriculum Management Page
- Syllabus tracker with progress bars per subject
- Activity upload cards with status badges (Pending, Completed, Overdue)
- Completion status overview
- Filterable by class/subject

### 8. Analytics Page
- Attendance trend line charts
- Performance distribution bar charts
- Risk prediction indicators (students below 75% attendance highlighted)
- Summary insight cards with key metrics

---

## 🧩 Shared Components
- **Sidebar navigation** — collapsible, role-aware menu with icons
- **Top navbar** — profile avatar, search bar, notification bell with dropdown
- **Notification panel** — slide-out panel with categorized alerts
- **Data tables** — sortable, searchable tables for users, attendance records
- **Stat cards** — reusable cards with icon, value, label, and trend indicator
- **Charts** — attendance trends (line), performance (bar), summary (donut) using Recharts

---

## 🔀 Routing & Navigation
- `/login` — Login/Register page
- `/admin` — Admin Dashboard
- `/teacher` — Teacher Dashboard
- `/student` — Student Dashboard
- `/parent` — Parent Dashboard
- `/attendance` — Attendance marking & calendar
- `/curriculum` — Curriculum management
- `/analytics` — Analytics & insights
- Role switcher on login redirects to the appropriate dashboard

---

## 📱 Responsiveness
- Sidebar collapses to icons on tablet, becomes a hamburger menu on mobile
- Cards stack vertically on smaller screens
- Tables become scrollable cards on mobile
- Charts resize gracefully

