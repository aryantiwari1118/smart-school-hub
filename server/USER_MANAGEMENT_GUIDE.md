# User Management System - Implementation Guide

## Overview
This document describes the new user management system that allows admins to create users with temporary passwords, and users to set their own passwords on first login. Each user also has a dedicated profile section.

## Key Features

### 1. Admin User Creation
**Endpoint:** `POST /api/auth/admin/create-user`
**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@school.com",
  "mobile": "9876543210",
  "role": "Teacher"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully. Temporary password has been set.",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@school.com",
    "mobile": "9876543210",
    "role": "Teacher",
    "temporaryPassword": "A1b2Cd3Ef4Gh",
    "passwordSet": false
  }
}
```

**Important:** The admin should securely share the temporary password with the user. The user will be required to set a new password on first login.

---

### 2. User Login with Password Check
**Endpoint:** `POST /api/login`
**Authentication:** Not required

**Request Body:**
```json
{
  "emailOrMobile": "john@school.com",
  "password": "A1b2Cd3Ef4Gh"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@school.com",
    "role": "Teacher",
    "passwordSet": false
  }
}
```

**Frontend Logic:**
- If `passwordSet` is `false`, redirect user to password setup screen
- If `passwordSet` is `true`, user can proceed to dashboard

---

### 3. Set Password on First Login
**Endpoint:** `POST /api/auth/set-password`
**Authentication:** Required

**Request Body:**
```json
{
  "tempPassword": "A1b2Cd3Ef4Gh",
  "newPassword": "SecurePass123"
}
```

**Password Requirements:**
- Minimum 6 characters
- Maximum 100 characters
- Must contain uppercase letter, lowercase letter, and number

**Response:**
```json
{
  "success": true,
  "message": "Password set successfully. You can now login with your new password."
}
```

**Flow:**
1. User logs in with temporary password
2. Frontend checks `passwordSet` flag
3. If `false`, shows password setup form
4. User enters new password
5. Frontend calls `/api/auth/set-password` with both passwords
6. Backend verifies temporary password and updates to new password
7. User can now login with new password

---

### 4. User Profile Management

#### Get Current User Profile
**Endpoint:** `GET /api/auth/profile-details`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "profile": {
    "_id": "profile_id",
    "userId": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@school.com",
      "mobile": "9876543210",
      "role": "Teacher"
    },
    "bio": "Experienced teacher",
    "dateOfBirth": "1990-05-15",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "pinCode": "10001",
    "phoneAlternate": "9876543211",
    "qualification": "B.Tech",
    "specialization": "Computer Science",
    "experience": 5,
    "department": "IT"
  }
}
```

#### Update User Profile
**Endpoint:** `PUT /api/auth/profile-details`
**Authentication:** Required

**Request Body:**
```json
{
  "bio": "Experienced teacher",
  "dateOfBirth": "1990-05-15",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "pinCode": "10001",
  "phoneAlternate": "9876543211",
  "qualification": "B.Tech",
  "specialization": "Computer Science",
  "experience": 5,
  "department": "IT"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "profile": { /* updated profile object */ }
}
```

#### Get Any User Profile (Admin or Self)
**Endpoint:** `GET /api/auth/profile-details/:userId`
**Authentication:** Required

**Response:** Same as Get Current User Profile

---

### 5. User Model Updates

The `User` model now includes:

```javascript
{
  // ... existing fields ...
  
  passwordSet: {
    type: Boolean,
    default: false // Tracks if user has set their own password
  },
  
  passwordChangedAt: {
    type: Date,
    default: null
  }
}
```

---

### 6. Profile Model

New `Profile` model stores detailed user information:

```javascript
{
  userId: ObjectId,           // Reference to User
  bio: String,                // User biography
  dateOfBirth: Date,          // Date of birth
  address: String,            // Home address
  city: String,               // City
  state: String,              // State/Province
  country: String,            // Country
  pinCode: String,            // Postal code
  phoneAlternate: String,     // Alternative phone number
  
  // Teacher/Staff specific fields
  parentName: String,         // For students: parent name
  parentPhone: String,        // For students: parent phone
  qualification: String,      // Educational qualification
  specialization: String,     // Area of specialization
  experience: Number,         // Years of experience
  department: String          // Department/Subject
}
```

---

## User Flow Example

### Admin Creates a New Teacher

1. Admin calls: `POST /api/auth/admin/create-user`
   ```json
   {
     "name": "Jane Smith",
     "email": "jane@school.com",
     "mobile": "9876543212",
     "role": "Teacher"
   }
   ```

2. System generates temporary password (e.g., `T1mP0rAry!`)

3. Admin receives response and securely shares credentials with Jane

### User (Jane) First Login

1. Jane receives email with credentials: jane@school.com / T1mP0rAry!

2. Jane logs in via frontend:
   ```
   POST /api/login with credentials
   ```

3. Backend responds with `passwordSet: false`

4. Frontend shows "Set Your Password" screen

5. Jane enters new password: `MySecure123`

6. Frontend validates and calls:
   ```json
   POST /api/auth/set-password
   {
     "tempPassword": "T1mP0rAry!",
     "newPassword": "MySecure123"
   }
   ```

7. Backend verifies, updates password, sets `passwordSet: true`

8. Jane now logs in normally with `jane@school.com / MySecure123`

### User Updates Profile

1. Jane calls: `PUT /api/auth/profile-details`
   ```json
   {
     "bio": "Mathematics teacher with 5 years experience",
     "qualification": "M.Sc Mathematics",
     "experience": 5,
     "department": "Mathematics",
     "city": "New York"
   }
   ```

2. System creates/updates profile and responds with updated profile data

---

## Backend Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/admin/create-user` | Admin | Create new user with temp password |
| POST | `/api/auth/set-password` | Required | User sets password on first login |
| GET | `/api/auth/profile-details` | Required | Get own profile |
| PUT | `/api/auth/profile-details` | Required | Update own profile |
| GET | `/api/auth/profile-details/:userId` | Required | Get user profile (admin or self) |
| POST | `/api/change-password` | Required | Change password after setup |
| POST | `/api/login` | None | Standard login (returns passwordSet flag) |

---

## Important Notes

1. **Password Security:** Temporary passwords are never stored in plain text. They're hashed using bcrypt.

2. **Unique Constraints:** Email and mobile number are unique at database level to prevent duplicates.

3. **Profile Lifecycle:** A profile is automatically created when an admin creates a user.

4. **Password Expiration:** There's no automatic password expiration. Admins can force password reset by updating the user's password field if needed.

5. **JWT Tokens:** All authenticated endpoints require a valid JWT token in the Authorization header.

6. **Error Handling:** All errors are returned with appropriate HTTP status codes and descriptive messages.

---

## Migration Notes

If you have existing users:

1. Set `passwordSet: true` for all existing users
2. Existing users can continue logging in normally
3. New users will follow the new flow with temporary passwords

SQL Migration Example:
```javascript
// In MongoDB
db.users.updateMany({}, { $set: { passwordSet: true } })
```

---

## Testing

### Create Admin User (Initial Setup)
```bash
curl -X POST http://localhost:5000/api/auth/admin/create-user \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Teacher",
    "email": "test@school.com",
    "mobile": "9876543220",
    "role": "Teacher"
  }'
```

### Login with Temporary Password
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrMobile": "test@school.com",
    "password": "<temporary_password_from_response>"
  }'
```

### Set New Password
```bash
curl -X POST http://localhost:5000/api/auth/set-password \
  -H "Authorization: Bearer <token_from_login>" \
  -H "Content-Type: application/json" \
  -d '{
    "tempPassword": "<temporary_password>",
    "newPassword": "NewSecure123"
  }'
```

---

## Security Considerations

1. **Admin Access:** Only admins can create users
2. **Profile Access:** Users can only view/edit their own profiles; admins can view any profile
3. **Password Reset:** Always require current password for changes (existing `/api/change-password` endpoint)
4. **Token Expiration:** Tokens expire after 24 hours
5. **HTTPS:** Always use HTTPS in production

