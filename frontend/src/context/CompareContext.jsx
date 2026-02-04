import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext(null);

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);
  const MAX_COMPARE_ITEMS = 4;

  useEffect(() => {
    const savedCompare = localStorage.getItem('amazon_compare');
    if (savedCompare) {
      setCompareList(JSON.parse(savedCompare));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('amazon_compare', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (product) => {
    if (compareList.length >= MAX_COMPARE_ITEMS) {
      return { success: false, message: `Maximum ${MAX_COMPARE_ITEMS} items allowed` };
    }
    if (compareList.some(item => item.id === product.id)) {
      return { success: false, message: 'Product already in compare list' };
    }
    setCompareList(prev => [...prev, product]);
    return { success: true };
  };

  const removeFromCompare = (productId) => {
    setCompareList(prev => prev.filter(item => item.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (productId) => {
    return compareList.some(item => item.id === productId);
  };

  const toggleCompare = (product) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      return { success: true, action: 'removed' };
    } else {
      return addToCompare(product);
    }
  };

  const value = {
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    toggleCompare,
    compareCount: compareList.length,
    maxItems: MAX_COMPARE_ITEMS
  };

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
};

export default CompareContext;
