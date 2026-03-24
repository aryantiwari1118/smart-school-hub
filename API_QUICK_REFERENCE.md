# API Quick Reference - User Management System

## Base URL
```
http://localhost:5000/api
```

## Authentication
Use Bearer token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### 1. **Login**
```
POST /login
```
**No authentication required**

**Request:**
```json
{
  "emailOrMobile": "user@school.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@school.com",
    "role": "Teacher",
    "passwordSet": false
  }
}
```

---

## 👤 User Management Endpoints

### 2. **Create User (Admin Only)**
```
POST /auth/admin/create-user
```
**Authentication:** Required (Admin role)

**Request:**
```json
{
  "name": "Jane Smith",
  "email": "jane@school.com",
  "mobile": "9876543210",
  "role": "Teacher"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "user_id",
    "name": "Jane Smith",
    "email": "jane@school.com",
    "mobile": "9876543210",
    "role": "Teacher",
    "temporaryPassword": "A1b2Cd3Ef4Gh",
    "passwordSet": false
  }
}
```

**Status Codes:**
- `201` - User created successfully
- `400` - Validation error or user already exists
- `403` - Not admin
- `401` - Not authenticated

---

### 3. **Set Password (First Time)**
```
POST /auth/set-password
```
**Authentication:** Required

**Request:**
```json
{
  "tempPassword": "A1b2Cd3Ef4Gh",
  "newPassword": "MySecure123"
}
```

**Password Requirements:**
- Minimum 6 characters
- Maximum 100 characters
- Must contain: uppercase, lowercase, number

**Response:**
```json
{
  "success": true,
  "message": "Password set successfully"
}
```

**Status Codes:**
- `200` - Password set successfully
- `400` - Validation error
- `401` - Incorrect temporary password
- `404` - User not found

---

### 4. **Change Password**
```
POST /auth/change-password
```
**Authentication:** Required

**Request:**
```json
{
  "currentPassword": "MySecure123",
  "newPassword": "NewSecure456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 👥 Profile Endpoints

### 5. **Get Current User Profile**
```
GET /auth/profile-details
```
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
    "phoneAlternate": "",
    "qualification": "M.Sc",
    "specialization": "Physics",
    "experience": 5,
    "department": "Science"
  }
}
```

---

### 6. **Update User Profile**
```
PUT /auth/profile-details
```
**Authentication:** Required

**Request Body (all fields optional):**
```json
{
  "bio": "Updated bio",
  "dateOfBirth": "1990-05-15",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "pinCode": "10001",
  "phoneAlternate": "9876543211",
  "qualification": "M.Sc",
  "specialization": "Physics",
  "experience": 5,
  "department": "Science"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "profile": { /* updated profile */ }
}
```

---

### 7. **Get Any User Profile**
```
GET /auth/profile-details/:userId
```
**Authentication:** Required (Admin or self)

**URL Parameters:**
- `userId` - The ID of the user whose profile to retrieve

**Response:**
```json
{
  "success": true,
  "profile": { /* profile object */ }
}
```

**Status Codes:**
- `200` - Success
- `403` - Access denied (not admin and not self)
- `404` - Profile not found

---

## 👨‍💼 User List Endpoints

### 8. **Get All Users**
```
GET /auth/users
```
**Authentication:** Required (Admin only)

**Query Parameters (all optional):**
- `role` - Filter by role (Teacher, Student, Parent, Admin)
- `status` - Filter by status (active, inactive)

**Examples:**
```
GET /auth/users?role=Teacher
GET /auth/users?status=active
GET /auth/users?role=Student&status=active
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "users": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@school.com",
      "mobile": "9876543210",
      "role": "Teacher",
      "isActive": true,
      "passwordSet": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 9. **Get User by ID**
```
GET /auth/users/:id
```
**Authentication:** Required (Admin or self)

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@school.com",
    "mobile": "9876543210",
    "role": "Teacher",
    "isActive": true,
    "passwordSet": true,
    "lastLogin": "2024-03-24T15:45:00Z",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 10. **Update User**
```
PUT /auth/users/:id
```
**Authentication:** Required (Admin only)

**Request:**
```json
{
  "name": "John Doe Updated",
  "mobile": "9876543211",
  "role": "Teacher",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": { /* updated user */ }
}
```

---

### 11. **Delete User**
```
DELETE /auth/users/:id
```
**Authentication:** Required (Admin only)

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "deletedUser": {
    "id": "user_id",
    "email": "john@school.com",
    "name": "John Doe"
  }
}
```

---

### 12. **Deactivate User**
```
POST /auth/users/:id/deactivate
```
**Authentication:** Required (Admin only)

**Response:**
```json
{
  "success": true,
  "message": "User deactivated successfully",
  "user": { /* user object */ }
}
```

---

### 13. **Activate User**
```
POST /auth/users/:id/activate
```
**Authentication:** Required (Admin only)

**Response:**
```json
{
  "success": true,
  "message": "User activated successfully",
  "user": { /* user object */ }
}
```

---

## 🔍 Verification Endpoints

### 14. **Check Email Availability**
```
GET /auth/check-email/:email
```
**No authentication required**

**Response:**
```json
{
  "success": true,
  "available": true,
  "email": "newuser@school.com"
}
```

---

### 15. **Check Mobile Availability**
```
GET /auth/check-mobile/:mobile
```
**No authentication required**

**Response:**
```json
{
  "success": true,
  "available": true,
  "mobile": "9876543210"
}
```

---

## 📊 Dashboard Endpoints

### 16. **Get Admin Dashboard Data**
```
GET /dashboard/admin
```
**No authentication required (for now)**

**Response:**
```json
{
  "adminStats": [
    { "label": "Total Students", "value": "150", "trend": "+12%" },
    { "label": "Total Teachers", "value": "25", "trend": "+3%" }
  ],
  "recentActivity": [],
  "usersTableData": [],
  "attendanceTrendData": []
}
```

---

## ❌ Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    "Validation error 1",
    "Validation error 2"
  ]
}
```

---

## 🔑 HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK - Request succeeded |
| `201` | Created - Resource created successfully |
| `400` | Bad Request - Validation error |
| `401` | Unauthorized - Missing or invalid token |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource not found |
| `500` | Server Error - Internal server error |

---

## 🧪 Testing with cURL

### Create a User
```bash
curl -X POST http://localhost:5000/api/auth/admin/create-user \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@school.com", "mobile": "9876543210", "role": "Teacher"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrMobile": "test@school.com", "password": "tempPassword123"}'
```

### Set Password
```bash
curl -X POST http://localhost:5000/api/auth/set-password \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"tempPassword": "tempPassword123", "newPassword": "NewPass123"}'
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/auth/profile-details \
  -H "Authorization: Bearer <token>"
```

### Update Profile
```bash
curl -X PUT http://localhost:5000/api/auth/profile-details \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"bio": "Updated bio", "city": "New York"}'
```

---

## 📝 Notes

1. All string fields should be trimmed and validated
2. Email is case-insensitive but stored in lowercase
3. Mobile and email must be unique
4. Passwords are hashed with bcrypt (never sent in plain text)
5. Tokens expire after 24 hours
6. Use HTTPS in production
7. Store tokens securely in frontend (httpOnly cookies recommended)

---

## 🔗 Related Documentation

- `USER_MANAGEMENT_GUIDE.md` - Detailed backend documentation
- `FRONTEND_INTEGRATION_GUIDE.md` - Frontend implementation guide
- `IMPLEMENTATION_SUMMARY.md` - Complete implementation overview

