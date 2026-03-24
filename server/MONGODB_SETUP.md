# Backend Setup Guide - MongoDB Integration

## Overview
The backend now supports MongoDB for storing login data and user information. It maintains backward compatibility with test credentials for development.

## Features

✅ **MongoDB Integration** - Store user data persistently
✅ **User Authentication** - Secure login with JWT tokens
✅ **User Registration** - Create new users
✅ **Fallback Mode** - Works without MongoDB for testing
✅ **Password Hashing** - Secure password storage with bcryptjs
✅ **Role-based Access** - Support for Admin, Teacher, Student, Parent roles

## Prerequisites

- Node.js (v16 or higher)
- npm or bun
- MongoDB instance (local or MongoDB Atlas)

## Installation

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure MongoDB

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Then edit `.env` with your MongoDB connection string:

#### Option A: MongoDB Atlas (Cloud)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-school-hub
PORT=5000
SECRET_KEY=your-production-secret-key
```

#### Option B: Local MongoDB
```env
MONGODB_URI=mongodb://localhost:27017/smart-school-hub
PORT=5000
SECRET_KEY=your-production-secret-key
```

### 3. Start the Backend

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The backend will start on `http://localhost:5000`

## API Endpoints

### Authentication Endpoints

#### Login
```bash
POST /api/login
Content-Type: application/json

{
  "emailOrMobile": "student@smartedu.com",
  "password": "student123",
  "role": "Student"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Alex Student",
    "email": "student@smartedu.com",
    "role": "Student"
  }
}
```

#### Register (New User)
```bash
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "1234567890",
  "password": "securePassword123",
  "role": "Student"
}
```

Response:
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Student"
  }
}
```

#### Verify Token
```bash
POST /api/verify-token
Content-Type: application/json

{
  "token": "eyJhbGc..."
}
```

### Development Endpoints

#### Get Test Credentials (Testing Only)
```bash
GET /api/test-credentials
```

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
    "Teacher": {...},
    "Student": {...},
    "Parent": {...}
  }
}
```

#### Health Check
```bash
GET /api/health
```

Response:
```json
{
  "success": true,
  "message": "Backend is running",
  "database": "MongoDB connected"
}
```

## Test Credentials (Always Available)

These credentials work even without MongoDB configured:

| Role    | Email                      | Mobile     | Password    |
|---------|----------------------------|-----------|-------------|
| Admin   | admin@smartedu.com         | 9876543210| admin123    |
| Teacher | teacher@smartedu.com       | 9876543211| teacher123  |
| Student | student@smartedu.com       | 9876543212| student123  |
| Parent  | parent@smartedu.com        | 9876543213| parent123   |

## Database Initialization

When you start the backend with MongoDB configured:

1. The app connects to MongoDB
2. If the database is empty, it automatically creates 4 default test users
3. These users are stored in the database and available for login
4. New users can be registered via the `/api/register` endpoint

## Modes of Operation

### Mode 1: With MongoDB Connected ✅
- Users are stored in MongoDB
- All login attempts check the database first
- New users can be registered
- User data persists across restarts
- Last login timestamp is recorded

### Mode 2: Without MongoDB (Test Mode) ⚠️
- Falls back to hardcoded test credentials
- Test credentials always work
- No new user registration available
- Useful for development/testing

## Environment Variables

| Variable     | Description                    | Default                               |
|-------------|--------------------------------|---------------------------------------|
| MONGODB_URI | MongoDB connection string      | mongodb://localhost:27017/smart-school-hub |
| PORT        | Server port                    | 5000                                  |
| SECRET_KEY  | JWT signing key               | your-secret-key-change-in-production  |

⚠️ **Important**: Change `SECRET_KEY` in production!

## Setting Up MongoDB Locally

### Using Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Using Homebrew (macOS)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Using apt (Ubuntu/Debian)
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

## Setting Up MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Click "Connect" and get your connection string
5. Add your connection string to `.env`

## Troubleshooting

### "MongoDB connection failed"
- Ensure MongoDB service is running
- Check connection string in `.env`
- Verify network access (if using MongoDB Atlas)

### "MongoServerError: connect ECONNREFUSED"
- MongoDB is not running locally
- Install and start MongoDB or configure MongoDB Atlas

### Password not updating
- Ensure the password is not already hashed before comparing
- Use the `matchPassword` method for comparisons

## Security Considerations

1. **Change SECRET_KEY** in production
2. **Use strong passwords** for MongoDB access
3. **Enable authentication** in MongoDB
4. **Use HTTPS** in production
5. **Never commit `.env`** file (already in .gitignore)
6. **Rotate JWT tokens** periodically
7. **Validate all inputs** on the backend

## Next Steps

- Implement user profile endpoints
- Add email verification
- Implement password reset functionality
- Add role-based authorization middleware
- Set up logging and monitoring
