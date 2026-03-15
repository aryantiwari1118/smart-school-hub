# Smart School Hub - Backend Authentication Setup

## Overview

This project includes a simple Node.js/Express backend authentication system that **requires no database**. Authentication is handled through **hardcoded credentials** that you can easily customize.

## Test Credentials

The backend comes with pre-configured test credentials for all user roles:

| Role   | Email                  | Password    | Mobile     |
|--------|------------------------|-------------|------------|
| Admin  | admin@smartedu.com     | admin123    | 9876543210 |
| Teacher| teacher@smartedu.com   | teacher123  | 9876543211 |
| Student| student@smartedu.com   | student123  | 9876543212 |
| Parent | parent@smartedu.com    | parent123   | 9876543213 |

**Note:** These credentials are displayed automatically on the login page for testing purposes.

## Getting Started

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

Or use the shortcut from the root directory:
```bash
npm run dev:backend
```

### 2. Start the Backend Server

From the `server` directory:
```bash
npm run dev
```

Output:
```
🚀 Backend server running on http://localhost:5000

Test Credentials:
================
Admin   | Email: admin@smartedu.com   | Password: admin123
Teacher | Email: teacher@smartedu.com | Password: teacher123
Student | Email: student@smartedu.com | Password: student123
Parent  | Email: parent@smartedu.com  | Password: parent123
```

### 3. Start the Frontend (in another terminal)

From the root directory:
```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints

### Login Endpoint
**POST** `/api/login`

Request body:
```json
{
  "emailOrMobile": "admin@smartedu.com",
  "password": "admin123",
  "role": "Admin"
}
```

Response on success (200):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "Admin_1707000000000",
    "name": "Admin User",
    "email": "admin@smartedu.com",
    "role": "Admin"
  }
}
```

Response on error (401):
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Verify Token Endpoint
**POST** `/api/verify-token`

Request body:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Response on success (200):
```json
{
  "success": true,
  "user": {
    "id": "Admin_1707000000000",
    "email": "admin@smartedu.com",
    "name": "Admin User",
    "role": "Admin",
    "iat": 1707000000,
    "exp": 1707086400
  }
}
```

### Health Check Endpoint
**GET** `/api/health`

Response:
```json
{
  "success": true,
  "message": "Backend is running"
}
```

### Test Credentials Endpoint (Development Only)
**GET** `/api/test-credentials`

Response:
```json
{
  "success": true,
  "message": "Test credentials (for development only)",
  "credentials": {
    "Admin": {
      "email": "admin@smartedu.com",
      "mobile": "9876543210",
      "password": "admin123"
    },
    ...
  }
}
```

## How to Customize Credentials

Edit `server/server.js` and modify the `VALID_CREDENTIALS` object:

```javascript
const VALID_CREDENTIALS = {
  admin: {
    email: 'your-email@example.com',
    mobile: '1234567890',
    password: 'your-password',
    name: 'Admin Name',
    role: 'Admin'
  },
  // ... other roles
};
```

## Features

✅ **No Database Required** - All credentials are hardcoded
✅ **JWT Token Authentication** - Uses JWT for session management
✅ **CORS Enabled** - Works with frontend on different ports
✅ **Role-Based Access** - Different credentials for each role
✅ **Test Credentials UI** - Quick-fill buttons on login page
✅ **Error Handling** - Clear error messages for debugging
✅ **Token Expiration** - Tokens expire after 24 hours

## Backend File Structure

```
server/
├── server.js       # Main backend server
├── package.json    # Backend dependencies
└── README.md       # This file
```

## Environment Configuration

The frontend uses the `.env.local` file to configure the API URL:

```
VITE_API_BASE_URL=http://localhost:5000
```

To change the backend URL, edit this file (useful for production deployment).

## Frontend API Integration

The frontend API utility is located at `src/lib/api.ts` and provides:

- `login(email, password, role)` - Authenticate user
- `verifyToken(token)` - Verify JWT token
- `getAuthToken()` - Get stored token from localStorage
- `getUser()` - Get stored user info from localStorage
- `logout()` - Clear authentication data

## Security Notes

⚠️ **Important for Production:**

1. **Change the JWT Secret Key:**
   Edit `server/server.js` line 7 and change:
   ```javascript
   const SECRET_KEY = 'your-secret-key-change-in-production';
   ```

2. **Use HTTPS in Production:**
   Set up proper SSL/TLS certificates

3. **Implement a Real Database:**
   Replace `VALID_CREDENTIALS` with actual database queries

4. **Hash Passwords:**
   Use bcrypt or similar to hash passwords

5. **Add Rate Limiting:**
   Implement rate limiting to prevent brute force attacks

6. **Remove Test Credentials Endpoint:**
   Remove or secure the `/api/test-credentials` endpoint

7. **Set Proper CORS:**
   Restrict CORS to only your frontend domain

## Frontend Login Page Features

- **Quick Credential Fill:**  Click any role button to auto-fill test credentials
- **Password Toggle:** Show/hide password visibility
- **Loading States:** Visual feedback during login
- **Error Messages:** Clear error notifications
- **Role Selection:** Easy role switching via tabs
- **Token Storage:** Automatic JWT token storage in localStorage
- **User Info Storage:** Stores logged-in user information

## Troubleshooting

### Backend not connecting
- Ensure backend is running on port 5000
- Check that VITE_API_BASE_URL in `.env.local` is correct
- Check browser console for CORS errors

### Login fails with "Invalid credentials"
- Double-check email/mobile and password
- Verify they match the values in `server/server.js`
- Check backend console for error messages

### Token expired
- Tokens expire after 24 hours
- User needs to login again
- You can modify the expiration in `server/server.js` line 64

## Next Steps

1. ✅ Backend is set up and running
2. ✅ Frontend login page is ready
3. 🔧 Connect other pages (AdminDashboard, StudentDashboard, etc.) to use auth token
4. 🔧 Add protected routes that verify authentication
5. 🔧 Implement logout functionality
6. 🔧 Add "Remember Me" functionality
7. 🔧 Implement password reset (optional)

---

For questions or issues, check the console logs in both browser (frontend) and terminal (backend).
