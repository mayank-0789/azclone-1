import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem('amazon_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('amazon_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = (email, password, name) => {
    // Mock authentication - in real app, this would call backend
    const mockUser = {
      id: `user_${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString()
    };
    setUser(mockUser);
    localStorage.setItem('amazon_user', JSON.stringify(mockUser));
    return { success: true, user: mockUser };
  };

  const signUp = (email, password, name) => {
    // Mock registration
    const mockUser = {
      id: `user_${Date.now()}`,
      email,
      name,
      createdAt: new Date().toISOString()
    };
    setUser(mockUser);
    localStorage.setItem('amazon_user', JSON.stringify(mockUser));
    return { success: true, user: mockUser };
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('amazon_user');
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
