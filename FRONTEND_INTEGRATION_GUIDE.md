# Frontend Integration Guide - User Management System

## Overview
This guide explains how to integrate the new user management system in the frontend (React/TypeScript).

---

## 1. Login Flow with Password Check

### Current Login Component Update

**File:** `src/pages/LoginPage.tsx`

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    passwordSet: boolean;  // NEW: Check if password has been set
  };
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrMobile,
          password
        })
      });

      const data: LoginResponse = await response.json();

      if (data.success) {
        // Store token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // NEW: Check if user needs to set password
        if (!data.user.passwordSet) {
          // Redirect to password setup screen
          navigate('/setup-password', { 
            state: { tempPassword: password } 
          });
        } else {
          // Regular login flow
          navigate('/dashboard');
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email or Mobile"
          value={emailOrMobile}
          onChange={(e) => setEmailOrMobile(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};
```

---

## 2. New Password Setup Page

**File:** `src/pages/SetPasswordPage.tsx` (NEW FILE)

```typescript
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SetPasswordState {
  tempPassword: string;
}

export const SetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tempPassword } = (location.state as SetPasswordState) || {};

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validatePassword = () => {
    // Validate password requirements
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (newPassword.length > 100) {
      setError('Password must not exceed 100 characters');
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setError('Password must contain uppercase, lowercase, and numbers');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tempPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to set password. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!tempPassword) {
    return <div>Invalid access. Please login first.</div>;
  }

  return (
    <div className="setup-password-container">
      <h2>Set Your Password</h2>
      <p>Welcome! Please set a new password for your account.</p>

      {success ? (
        <div className="success-message">
          ✓ Password set successfully! Redirecting to dashboard...
        </div>
      ) : (
        <form onSubmit={handleSetPassword}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
            <small>
              Must contain: uppercase, lowercase, numbers (min 6 characters)
            </small>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Setting Password...' : 'Set Password'}
          </button>
        </form>
      )}
    </div>
  );
};
```

---

## 3. User Profile Component

**File:** `src/pages/ProfilePage.tsx` (NEW FILE)

```typescript
import { useState, useEffect } from 'react';

interface Profile {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    role: string;
  };
  bio: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  phoneAlternate: string;
  qualification: string;
  specialization: string;
  experience: number;
  department: string;
}

export const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/profile-details', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setProfile(data.profile);
        setFormData(data.profile);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience' ? parseInt(value) : value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/profile-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setProfile(data.profile);
        setEditing(false);
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Error updating profile: ' + data.message);
      }
    } catch (err) {
      setMessage('Failed to update profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {!editing ? (
        <div className="profile-view">
          <div className="profile-header">
            <h3>{profile.userId.name}</h3>
            <p>{profile.userId.role}</p>
            <p>{profile.userId.email}</p>
            <button onClick={() => setEditing(true)}>Edit Profile</button>
          </div>

          <div className="profile-grid">
            <section>
              <h4>Personal Information</h4>
              <p><strong>Bio:</strong> {profile.bio || 'Not set'}</p>
              <p><strong>Date of Birth:</strong> {profile.dateOfBirth || 'Not set'}</p>
              <p><strong>Address:</strong> {profile.address || 'Not set'}</p>
              <p><strong>City:</strong> {profile.city || 'Not set'}</p>
              <p><strong>State:</strong> {profile.state || 'Not set'}</p>
              <p><strong>Country:</strong> {profile.country || 'Not set'}</p>
              <p><strong>Pin Code:</strong> {profile.pinCode || 'Not set'}</p>
              <p><strong>Alternate Phone:</strong> {profile.phoneAlternate || 'Not set'}</p>
            </section>

            {profile.userId.role === 'Teacher' && (
              <section>
                <h4>Professional Information</h4>
                <p><strong>Qualification:</strong> {profile.qualification || 'Not set'}</p>
                <p><strong>Specialization:</strong> {profile.specialization || 'Not set'}</p>
                <p><strong>Experience:</strong> {profile.experience || 0} years</p>
                <p><strong>Department:</strong> {profile.department || 'Not set'}</p>
              </section>
            )}

            {profile.userId.role === 'Student' && (
              <section>
                <h4>Parent Information</h4>
                <p><strong>Parent Name:</strong> {profile.parentName || 'Not set'}</p>
                <p><strong>Parent Phone:</strong> {profile.parentPhone || 'Not set'}</p>
              </section>
            )}
          </div>
        </div>
      ) : (
        <div className="profile-edit">
          <h3>Edit Profile</h3>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={handleChange}
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth?.split('T')[0] || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              placeholder="Your address"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Pin Code</label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Alternate Phone</label>
            <input
              type="tel"
              name="phoneAlternate"
              value={formData.phoneAlternate || ''}
              onChange={handleChange}
            />
          </div>

          {profile.userId.role === 'Teacher' && (
            <>
              <div className="form-group">
                <label>Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification || ''}
                  onChange={handleChange}
                  placeholder="e.g., B.Tech, M.Sc"
                />
              </div>

              <div className="form-group">
                <label>Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization || ''}
                  onChange={handleChange}
                  placeholder="e.g., Computer Science"
                />
              </div>

              <div className="form-group">
                <label>Experience (Years)</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience || 0}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleChange}
                  placeholder="e.g., Mathematics"
                />
              </div>
            </>
          )}

          {profile.userId.role === 'Student' && (
            <>
              <div className="form-group">
                <label>Parent Name</label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Parent Phone</label>
                <input
                  type="tel"
                  name="parentPhone"
                  value={formData.parentPhone || ''}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="button-group">
            <button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={() => setEditing(false)} className="secondary">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 4. Admin User Creation Component

**File:** `src/components/AdminUserForm.tsx` (NEW FILE)

```typescript
import { useState } from 'react';

export const AdminUserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: 'Teacher'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [createdUser, setCreatedUser] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setCreatedUser(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage('User created successfully!');
        setCreatedUser(data.user);
        setFormData({ name: '', email: '', mobile: '', role: 'Teacher' });
      } else {
        setMessage('Error: ' + data.message);
      }
    } catch (err) {
      setMessage('Failed to create user');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="admin-user-form">
      <h3>Create New User</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Mobile</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="Teacher">Teacher</option>
            <option value="Student">Student</option>
            <option value="Parent">Parent</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {createdUser && (
        <div className="created-user-info">
          <h4>User Created Successfully!</h4>
          <p><strong>Name:</strong> {createdUser.name}</p>
          <p><strong>Email:</strong> {createdUser.email}</p>
          <p><strong>Mobile:</strong> {createdUser.mobile}</p>
          <p><strong>Role:</strong> {createdUser.role}</p>

          <div className="credentials">
            <p><strong>Temporary Password:</strong></p>
            <div className="password-display">
              <code>{createdUser.temporaryPassword}</code>
              <button
                type="button"
                onClick={() => copyToClipboard(createdUser.temporaryPassword)}
              >
                Copy
              </button>
            </div>
            <p className="warning">⚠️ Please securely share these credentials with the user.</p>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 5. Update App Routes

**File:** `src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { SetPasswordPage } from './pages/SetPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { Dashboard } from './pages/Dashboard';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/setup-password" element={<SetPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Add other routes */}
      </Routes>
    </BrowserRouter>
  );
};
```

---

## 6. API Service Helper

**File:** `src/lib/api.ts`

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const api = {
  // Auth endpoints
  async login(emailOrMobile: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ emailOrMobile, password })
    });
    return response.json();
  },

  async setPassword(tempPassword: string, newPassword: string) {
    const response = await fetch(`${API_BASE_URL}/auth/set-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ tempPassword, newPassword })
    });
    return response.json();
  },

  async createUser(name: string, email: string, mobile: string, role: string) {
    const response = await fetch(`${API_BASE_URL}/auth/admin/create-user`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, email, mobile, role })
    });
    return response.json();
  },

  // Profile endpoints
  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/profile-details`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  async updateProfile(profileData: any) {
    const response = await fetch(`${API_BASE_URL}/auth/profile-details`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return response.json();
  },

  async getProfileByUserId(userId: string) {
    const response = await fetch(`${API_BASE_URL}/auth/profile-details/${userId}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};
```

---

## Summary of Changes

### New Files Created:
1. `src/pages/SetPasswordPage.tsx` - Password setup screen
2. `src/pages/ProfilePage.tsx` - User profile management
3. `src/components/AdminUserForm.tsx` - Admin user creation form

### Updated Files:
1. `src/pages/LoginPage.tsx` - Added passwordSet check
2. `src/App.tsx` - Added new routes
3. `src/lib/api.ts` - Added new API methods

### Key Integration Points:
1. **Check passwordSet flag** after login to redirect users to password setup
2. **Create separate password setup flow** for new users
3. **Display user profile** with role-specific fields
4. **Allow admin to create users** in admin panel
5. **Store credentials securely** in localStorage

