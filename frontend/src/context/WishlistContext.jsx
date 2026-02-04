import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getSessionId = useCallback(() => {
    if (user?.id) return user.id;
    let sessionId = localStorage.getItem('amazon_session_id');
    if (!sessionId) {
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('amazon_session_id', sessionId);
    }
    return sessionId;
  }, [user]);

  const loadWishlist = useCallback(async () => {
    const sessionId = getSessionId();
    try {
      setLoading(true);
      const response = await axios.get(`${API}/wishlist/${sessionId}`);
      setWishlist(response.data);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      const savedWishlist = localStorage.getItem('amazon_wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } finally {
      setLoading(false);
    }
  }, [getSessionId]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist, user]);

  useEffect(() => {
    localStorage.setItem('amazon_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = async (product) => {
    const sessionId = getSessionId();
    
    // Check if already in wishlist
    if (wishlist.some(item => item.id === product.id)) {
      return;
    }

    // Optimistic update
    setWishlist(prev => [...prev, product]);

    try {
      await axios.post(`${API}/wishlist`, {
        product_id: product.id,
        session_id: sessionId
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    const sessionId = getSessionId();
    
    // Optimistic update
    setWishlist(prev => prev.filter(item => item.id !== productId));

    try {
      await axios.delete(`${API}/wishlist/${sessionId}/${productId}`);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const toggleWishlist = async (product) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    wishlistCount: wishlist.length
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
