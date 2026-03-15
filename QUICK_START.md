# Quick Start Guide

## Starting the Application

### Method 1: Start Everything Manually

**Terminal 1 - Start the Backend:**
```bash
cd server
npm install
npm run dev
```

Wait for: `🚀 Backend server running on http://localhost:5000`

**Terminal 2 - Start the Frontend:**
```bash
npm install
npm run dev
```

Open: `http://localhost:5173`

### Method 2: Quick Commands
```bash
# Install everything
npm install
cd server && npm install && cd ..

# Then start each in separate terminals
npm run dev
npm run dev:backend
```

## Login

1. Go to `http://localhost:5173`
2. Select a role (Admin, Teacher, Student, or Parent)
3. Click one of the quick-login buttons to fill test credentials
4. Click "Sign In"

## Test Credentials

```
Admin   → admin@smartedu.com / admin123
Teacher → teacher@smartedu.com / teacher123
Student → student@smartedu.com / student123
Parent  → parent@smartedu.com / parent123
```

---

**See `BACKEND_SETUP.md` for complete documentation**
