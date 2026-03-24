// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  login: `${API_BASE_URL}/api/login`,
  register: `${API_BASE_URL}/api/auth/register`,
  verifyToken: `${API_BASE_URL}/api/verify-token`,
  health: `${API_BASE_URL}/api/health`,
  testCredentials: `${API_BASE_URL}/api/test-credentials`
};

export const register = async (name: string, email: string, mobile: string, password: string, role: string) => {
  try {
    const response = await fetch(API_CONFIG.register, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        mobile,
        password,
        role
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const login = async (emailOrMobile: string, password: string, role: string) => {
  try {
    const response = await fetch(API_CONFIG.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emailOrMobile,
        password,
        role
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const verifyToken = async (token: string) => {
  try {
    const response = await fetch(API_CONFIG.verifyToken, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Verify token error:', error);
    throw error;
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};
