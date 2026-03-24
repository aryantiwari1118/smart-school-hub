# 🚀 MongoDB Backend - Quick Reference

## What's New

✅ **MongoDB Integration** - Store login data persistently in MongoDB
✅ **User Registration** - New `/api/register` endpoint to create users
✅ **Secure Password Storage** - bcryptjs hashing for all passwords
✅ **Backward Compatible** - Works without MongoDB for testing
✅ **Test Mode** - Falls back to hardcoded credentials if MongoDB unavailable
✅ **Database Initialization** - Auto-creates default test users

## Files Created/Modified

### New Files
- `server/models/User.js` - MongoDB User schema with validation
- `server/.env.example` - Configuration template
- `server/MONGODB_SETUP.md` - Comprehensive setup guide
- `server/SETUP_MONGODB.sh` - Setup script for Linux/macOS
- `server/SETUP_MONGODB.bat` - Setup script for Windows

### Modified Files
- `server/package.json` - Added mongoose and bcryptjs
- `server/server.js` - Complete rewrite with MongoDB support

## Quick Start (5 minutes)

### 1️⃣ Install Dependencies
```bash
cd server
npm install
```

### 2️⃣ Configure MongoDB
```bash
# Copy the template
cp .env.example .env

# Edit .env and add your MongoDB connection string
# MONGODB_URI=mongodb://localhost:27017/smart-school-hub
# or use MongoDB Atlas for cloud
```

### 3️⃣ Start Backend
```bash
npm run dev
```

### 4️⃣ Test Login (Frontend)
```bash
npm run dev  # in root directory
```

## Test Credentials (Always Work)

```
Admin    → admin@smartedu.com / admin123
Teacher  → teacher@smartedu.com / teacher123
Student  → student@smartedu.com / student123
Parent   → parent@smartedu.com / parent123
```

## API Endpoints

| Method | Endpoint           | Purpose                |
|--------|-------------------|------------------------|
| POST   | `/api/login`      | Login with credentials |
| POST   | `/api/register`   | Create new user        |
| POST   | `/api/verify-token` | Verify JWT token      |
| GET    | `/api/health`     | Server health check    |
| GET    | `/api/test-credentials` | Get test credentials  |

## Database Status

After starting with MongoDB:

```
✅ MongoDB connected
✅ Default test users initialized (auto-created on first run)
```

Without MongoDB:

```
⚠️  Test Mode (Hardcoded Credentials)
    All test credentials still work
```

## Key Features

### Login Flow
1. POST `/api/login` with email/mobile + password
2. Server checks MongoDB first (if available)
3. Falls back to test credentials if needed
4. Returns JWT token + user info
5. Token stored in localStorage (frontend)

### Registration Flow (MongoDB only)
1. POST `/api/register` with name, email, mobile, password, role
2. Server validates and checks for duplicates
3. Password auto-hashed before storage
4. Returns JWT token + user info

### Password Security
- Passwords are hashed with bcrypt (10 salt rounds)
- Never stored in plain text
- Compared using secure `matchPassword` method
- Never returned in API responses

## Troubleshooting

### MongoDB Connection Failed?
- ✅ Still works! Falls back to test credentials
- ⚠️ Registration endpoint will be disabled
- Fix: Check MongoDB URI in `.env`

### Can't connect to MongoDB locally?
```bash
# Start MongoDB with Docker
docker run -d -p 27017:27017 mongo:latest
```

### Deployed to production?
1. Set environment variables on server (don't push .env)
2. Update MongoDB URI to production database
3. Change SECRET_KEY to a strong random string
4. Enable HTTPS
5. Configure CORS for production domain

## Testing the API

### Using VS Code REST Client
Install "REST Client" extension and create `test.http`:

```
### Login
POST http://localhost:5000/api/login
Content-Type: application/json

{
  "emailOrMobile": "student@smartedu.com",
  "password": "student123",
  "role": "Student"
}

### Register New User
POST http://localhost:5000/api/register
Content-Type: application/json

{
  "name": "New User",
  "email": "newuser@example.com",
  "mobile": "1234567890",
  "password": "password123",
  "role": "Student"
}
```

### Using cURL
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrMobile":"student@smartedu.com","password":"student123","role":"Student"}'
```

## Important Notes

⚠️ **Testing Section Preserved**
- The original test credentials endpoint remains unchanged
- Test credentials always available for development
- Hardcoded test data acts as fallback

📌 **No Breaking Changes**
- Frontend code doesn't need changes
- All existing API calls work as before
- New features are opt-in (registration)

🔒 **Security Reminders**
- Change SECRET_KEY in production
- Use strong MongoDB password
- Never commit .env file
- Use HTTPS in production
- Validate all inputs

## Need Help?

See detailed documentation:
- [server/MONGODB_SETUP.md](MONGODB_SETUP.md) - Full setup guide
- [server/models/User.js](models/User.js) - Schema definition
- [server/server.js](server.js) - Source code with comments
