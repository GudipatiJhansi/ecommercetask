import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Set Authorization header dynamically whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Load user profile on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get('/api/auth/profile');
        setUser(data);
      } catch (err) {
        console.error('Failed to load user profile:', err);
        // Clear expired or invalid tokens
        setToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/login', { email, password });
      setToken(data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      showToast(`Welcome back, ${data.name}!`, 'success');
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      setToken(data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      showToast(`Account created successfully! Welcome, ${data.name}`, 'success');
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    setToken('');
    setUser(null);
    showToast('Logged out successfully. See you soon!', 'info');
  };

  // Toggle Item in Wishlist
  const toggleWishlist = async (productId) => {
    if (!user) {
      showToast('Please login to manage your wishlist', 'info');
      return;
    }
    try {
      // In a real app we'd call an endpoint like POST /api/users/wishlist
      // Here we simulate it locally on the profile and save in user state
      const isWishlisted = user.wishlist?.some(item => (item._id || item) === productId);
      
      // Update local state for immediate feedback
      let updatedWishlist;
      if (isWishlisted) {
        updatedWishlist = user.wishlist.filter(item => (item._id || item) !== productId);
        showToast('Removed from Wishlist', 'info');
      } else {
        updatedWishlist = [...(user.wishlist || []), productId];
        showToast('Added to Wishlist!', 'success');
      }

      setUser(prev => ({
        ...prev,
        wishlist: updatedWishlist
      }));
    } catch (err) {
      showToast('Failed to update wishlist', 'error');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, toggleWishlist }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
