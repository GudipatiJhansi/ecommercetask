import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  // Load cart when user changes
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCart({ items: [] });
        return;
      }
      try {
        setLoading(true);
        const { data } = await axios.get('/api/cart');
        setCart(data);
      } catch (err) {
        console.error('Error fetching cart:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user]);

  // Add an item to the cart
  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      showToast('Please register or log in to add items to your cart!', 'info');
      return false;
    }
    try {
      setLoading(true);
      const { data } = await axios.post('/api/cart/add', { productId, quantity });
      setCart(data);
      showToast('Item successfully added to your cart!', 'success');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to add item to cart';
      showToast(errMsg, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      const { data } = await axios.put('/api/cart/update', { productId, quantity });
      setCart(data);
      showToast('Cart quantity adjusted!', 'success');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to adjust quantity';
      showToast(errMsg, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`/api/cart/remove/${productId}`);
      setCart(data);
      showToast('Item removed from cart', 'info');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to remove item';
      showToast(errMsg, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear cart locally (useful right after placing an order)
  const clearCart = () => {
    setCart({ items: [] });
  };

  // Deriving values from cart state
  const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.items.reduce((total, item) => {
    const price = item.productId?.price || 0;
    return total + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
