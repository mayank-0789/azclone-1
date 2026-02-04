import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Generate or get session ID
  const getSessionId = useCallback(() => {
    if (user?.id) return user.id;
    let sessionId = localStorage.getItem('amazon_session_id');
    if (!sessionId) {
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('amazon_session_id', sessionId);
    }
    return sessionId;
  }, [user]);

  // Load cart from backend
  const loadCart = useCallback(async () => {
    const sessionId = getSessionId();
    try {
      setLoading(true);
      const response = await axios.get(`${API}/cart/${sessionId}`);
      setCart(response.data);
    } catch (error) {
      console.error('Error loading cart:', error);
      // Fall back to local storage
      const savedCart = localStorage.getItem('amazon_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } finally {
      setLoading(false);
    }
  }, [getSessionId]);

  // Load cart on mount and when user changes
  useEffect(() => {
    loadCart();
  }, [loadCart, user]);

  // Save cart to local storage as backup
  useEffect(() => {
    localStorage.setItem('amazon_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (product) => {
    const sessionId = getSessionId();
    
    // Optimistic update
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    // Sync with backend
    try {
      await axios.post(`${API}/cart`, {
        product_id: product.id,
        quantity: 1,
        session_id: sessionId
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    const sessionId = getSessionId();
    
    // Optimistic update
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));

    // Sync with backend
    try {
      await axios.delete(`${API}/cart/${sessionId}/${productId}`);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    const sessionId = getSessionId();
    
    if (newQuantity < 1) {
      return removeFromCart(productId);
    }

    // Optimistic update
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );

    // Sync with backend
    try {
      await axios.put(`${API}/cart/${sessionId}/${productId}?quantity=${newQuantity}`);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const clearCart = async () => {
    const sessionId = getSessionId();
    
    // Optimistic update
    setCart([]);

    // Sync with backend
    try {
      await axios.delete(`${API}/cart/${sessionId}`);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
