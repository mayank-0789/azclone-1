import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OrderContext = createContext(null);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
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

  const loadOrders = useCallback(async () => {
    const sessionId = getSessionId();
    try {
      setLoading(true);
      const response = await axios.get(`${API}/orders/${sessionId}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
      const savedOrders = localStorage.getItem('amazon_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } finally {
      setLoading(false);
    }
  }, [getSessionId]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders, user]);

  useEffect(() => {
    localStorage.setItem('amazon_orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = async (cartItems, shippingAddress, paymentMethod) => {
    const sessionId = getSessionId();
    const orderTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const newOrder = {
      id: `order_${Date.now()}`,
      session_id: sessionId,
      items: cartItems,
      total: orderTotal,
      status: 'Processing',
      shipping_address: shippingAddress || {
        name: user?.name || 'Guest',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States'
      },
      payment_method: paymentMethod || 'Credit Card ending in 1234',
      created_at: new Date().toISOString(),
      estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    };

    // Optimistic update
    setOrders(prev => [newOrder, ...prev]);

    try {
      await axios.post(`${API}/orders`, newOrder);
    } catch (error) {
      console.error('Error creating order:', error);
    }

    return newOrder;
  };

  const value = {
    orders,
    loading,
    createOrder,
    loadOrders,
    orderCount: orders.length
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
