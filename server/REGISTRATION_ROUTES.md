# 🔐 User Registration & Authentication Routes

All comprehensive registration and user management routes for MongoDB.

## 📋 Overview

- **Public Routes** (No authentication required): Registration, Email/Mobile check
- **Protected Routes** (Authentication required): Profile, Password change
- **Admin Routes** (Admin only): User management, Activation/Deactivation

## 🚀 Base URL

```
http://localhost:5000/api/auth
```

---

## 📝 Public Routes (No Auth Required)

### 1. Register New User

**Endpoint:** `POST /api/auth/register`

**Description:** Create a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543214",
  "password": "SecurePass123",
  "role": "Student"
}
```

**Validation Rules:**
- `name`: Required, 2-100 characters
- `email`: Required, valid email format, unique
- `mobile`: Required, 10-15 digits, unique
- `password`: Required, minimum 6 characters
- `role`: Required, one of: Admin, Teacher, Student, Parent

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543214",
    "role": "Student"
  }
}
```

**Error Responses:**
- `400` - Validation failed
- `400` - Email already exists
- `400` - Mobile already exists

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543214",
    "password": "SecurePass123",
    "role": "Student"
  }'
```

---

### 2. Check Email Availability

**Endpoint:** `GET /api/auth/check-email/:email`

**Description:** Check if an email is available for registration

**Example:** `GET /api/auth/check-email/john@example.com`

**Response (200 OK):**
```json
{
  "success": true,
  "available": true,
  "email": "john@example.com"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/auth/check-email/john@example.com
```

---

### 3. Check Mobile Availability

**Endpoint:** `GET /api/auth/check-mobile/:mobile`

**Description:** Check if a mobile number is available for registration

**Example:** `GET /api/auth/check-mobile/9876543214`

**Response (200 OK):**
```json
{
  "success": true,
  "available": true,
  "mobile": "9876543214"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/auth/check-mobile/9876543214
```

---

## 🔒 Protected Routes (Requires Authentication)

All protected endpoints require a valid JWT token. Send the token in one of these ways:

**Option 1 - Authorization Header:**
```
Authorization: Bearer <token>
```

**Option 2 - Custom Header:**
```
X-Auth-Token: <token>
```

### 4. Get Current User Profile

**Endpoint:** `GET /api/auth/profile`

**Description:** Get the authenticated user's profile

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543214",
    "role": "Student",
    "isActive": true,
    "lastLogin": "2026-03-15T10:30:00.000Z",
    "createdAt": "2026-03-15T09:00:00.000Z",
    "updatedAt": "2026-03-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `401` - No token provided
- `401` - Invalid or expired token
- `404` - User not found

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <token>"
```

---

### 5. Update User Profile

**Endpoint:** `PUT /api/auth/profile`

**Description:** Update the authenticated user's profile

**Request Body (at least one field required):**
```json
{
  "name": "John Doe Updated",
  "mobile": "9876543215"
}
```

**Validation Rules:**
- `name`: Optional, 2-100 characters
- `mobile`: Optional, 10-15 digits, must be unique

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe Updated",
    "email": "john@example.com",
    "mobile": "9876543215",
    "role": "Student",
    "isActive": true,
    "lastLogin": "2026-03-15T10:30:00.000Z",
    "createdAt": "2026-03-15T09:00:00.000Z",
    "updatedAt": "2026-03-15T10:35:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Mobile number already in use
- `401` - Invalid token

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "mobile": "9876543215"
  }'
```

---

### 6. Change Password

**Endpoint:** `POST /api/auth/change-password`

**Description:** Change the authenticated user's password

**Request Body:**
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass456"
}
```

**Validation Rules:**
- `currentPassword`: Required, must match current password
- `newPassword`: Required, minimum 6 characters, must be different from current

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Responses:**
- `400` - Current password is incorrect
- `401` - Invalid token

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "OldPass123",
    "newPassword": "NewPass456"
  }'
```

---

## 👨‍💼 Admin Routes (Admin Only)

All admin routes require a valid JWT token with `role: "Admin"`

### 7. Get All Users

**Endpoint:** `GET /api/auth/users`

**Description:** Get all users with optional filters

**Query Parameters:**
- `role` (optional): Filter by role (Admin, Teacher, Student, Parent)
- `status` (optional): Filter by status (active, inactive)

**Example:** `GET /api/auth/users?role=Student&status=active`

**Response (200 OK):**
```json
{
  "success": true,
  "count": 45,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "9876543214",
      "role": "Student",
      "isActive": true,
      "lastLogin": "2026-03-15T10:30:00.000Z",
      "createdAt": "2026-03-15T09:00:00.000Z",
      "updatedAt": "2026-03-15T10:30:00.000Z"
    },
    // ... more users
  ]
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/auth/users?role=Student&status=active" \
  -H "Authorization: Bearer <admin-token>"
```

---

### 8. Get User by ID

**Endpoint:** `GET /api/auth/users/:id`

**Description:** Get a specific user (Admin can get any user, others can only get themselves)

**Example:** `GET /api/auth/users/507f1f77bcf86cd799439011`

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543214",
    "role": "Student",
    "isActive": true,
    "lastLogin": "2026-03-15T10:30:00.000Z",
    "createdAt": "2026-03-15T09:00:00.000Z",
    "updatedAt": "2026-03-15T10:30:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/auth/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <admin-token>"
```

---

### 9. Update User (Admin)

**Endpoint:** `PUT /api/auth/users/:id`

**Description:** Update any user (Admin only)

**Request Body:**
```json
{
  "name": "Jane Doe",
  "mobile": "9876543220",
  "role": "Teacher",
  "isActive": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "john@example.com",
    "mobile": "9876543220",
    "role": "Teacher",
    "isActive": true,
    "lastLogin": "2026-03-15T10:30:00.000Z",
    "createdAt": "2026-03-15T09:00:00.000Z",
    "updatedAt": "2026-03-15T10:40:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/auth/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "role": "Teacher"
  }'
```

---

### 10. Delete User (Admin)

**Endpoint:** `DELETE /api/auth/users/:id`

**Description:** Delete a user permanently (Admin only)

**Example:** `DELETE /api/auth/users/507f1f77bcf86cd799439011`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "deletedUser": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Error Responses:**
- `400` - Cannot delete your own account
- `404` - User not found

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/auth/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <admin-token>"
```

---

### 11. Deactivate User (Admin)

**Endpoint:** `POST /api/auth/users/:id/deactivate`

**Description:** Deactivate a user account (Admin only)

**Example:** `POST /api/auth/users/507f1f77bcf86cd799439011/deactivate`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deactivated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543214",
    "role": "Student",
    "isActive": false,
    "lastLogin": "2026-03-15T10:30:00.000Z",
    "createdAt": "2026-03-15T09:00:00.000Z",
    "updatedAt": "2026-03-15T10:45:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/users/507f1f77bcf86cd799439011/deactivate \
  -H "Authorization: Bearer <admin-token>"
```

---

### 12. Activate User (Admin)

**Endpoint:** `POST /api/auth/users/:id/activate`

**Description:** Activate a deactivated user account (Admin only)

**Example:** `POST /api/auth/users/507f1f77bcf86cd799439011/activate`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User activated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543214",
    "role": "Student",
    "isActive": true,
    "lastLogin": "2026-03-15T10:30:00.000Z",
    "createdAt": "2026-03-15T09:00:00.000Z",
    "updatedAt": "2026-03-15T10:50:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/users/507f1f77bcf86cd799439011/activate \
  -H "Authorization: Bearer <admin-token>"
```

---

## 🔐 Legacy Endpoints (Backward Compatible)

These endpoints maintain backward compatibility with the original API:

```
POST   /api/login              - Login with email/mobile and password
POST   /api/register           - Register new user
POST   /api/verify-token       - Verify JWT token
GET    /api/health             - Server health check
GET    /api/test-credentials   - Test credentials (development only)
```

---

## 📊 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request (validation error) |
| 401  | Unauthorized (invalid credentials/token) |
| 403  | Forbidden (insufficient permissions) |
| 404  | Not Found |
| 500  | Server Error |
| 503  | Service Unavailable (DB not connected) |

---

## 🛠️ Testing with Postman/VS Code REST Client

### Import Collection
Save this as `test.http`:

```http
### Register New User
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "testuser@example.com",
  "mobile": "9999999999",
  "password": "TestPass123",
  "role": "Student"
}

### Check Email Availability
GET http://localhost:5000/api/auth/check-email/testuser@example.com

### Check Mobile Availability
GET http://localhost:5000/api/auth/check-mobile/9999999999

### Get Profile (Protected)
GET http://localhost:5000/api/auth/profile
Authorization: Bearer <token>

### Update Profile
PUT http://localhost:5000/api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "mobile": "8888888888"
}

### Get All Users (Admin)
GET http://localhost:5000/api/auth/users?role=Student&status=active
Authorization: Bearer <admin-token>

### Delete User (Admin)
DELETE http://localhost:5000/api/auth/users/<user-id>
Authorization: Bearer <admin-token>
```

---

## 🔗 Related Documentation

- [MongoDB Setup Guide](MONGODB_SETUP.md)
- [Quick Reference](QUICK_REFERENCE.md)
- [User Model](models/User.js)
- [Auth Middleware](middleware/auth.js)
- [Validation Middleware](middleware/validation.js)
