import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ShoppingCart,
  ChevronDown,
  Menu,
  LogOut,
  User,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SidebarMenu from './SidebarMenu';

const Header = ({ searchCategories = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const dropdownRef = useRef(null);
  const accountRef = useRef(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setShowAccountDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`);
    }
  };

  const handleSignOut = () => {
    signOut();
    setShowAccountDropdown(false);
    navigate('/');
  };

  return (
    <header className="bg-[#131921] sticky top-0 z-50 w-full" data-testid="header">
      {/* Main Header */}
      <div className="flex items-center px-2 py-2 gap-2 w-full">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center px-2 py-1 border border-transparent hover:border-white rounded-sm min-w-fit"
          data-testid="logo-link"
        >
          <div className="flex items-center pt-2">
            <img
              src="/amazon_logo.png"
              alt="Amazon"
              className="h-[28px] object-contain"
            />
            <span className="text-white text-xs -mt-2 ml-0.5">.in</span>
          </div>
        </Link>

        {/* Deliver To */}
        <div
          className="hidden md:flex items-center text-white px-2 py-1 border border-transparent hover:border-white rounded-sm cursor-pointer"
          data-testid="deliver-to"
        >
          <MapPin className="w-5 h-5 text-white" />
          <div className="ml-1">
            <p className="text-[#ccc] text-xs">Deliver to</p>
            <p className="text-white text-sm font-bold leading-tight">India</p>
          </div>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex-1 flex items-center h-10 rounded-md overflow-hidden"
          data-testid="search-form"
        >
          {/* Category Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="h-10 px-3 bg-[#e6e6e6] hover:bg-[#d4d4d4] text-sm text-gray-700 flex items-center gap-1 rounded-l-md border-r border-gray-300"
              data-testid="category-dropdown-button"
            >
              <span className="hidden sm:inline truncate max-w-[100px]">{selectedCategory}</span>
              <span className="sm:hidden">All</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto w-56">
                {searchCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-[#eee] ${selectedCategory === cat ? 'bg-[#febd69] font-semibold' : ''
                      }`}
                    data-testid={`category-option-${cat}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Amazon.in"
            className="flex-1 h-10 px-3 text-base outline-none border-none"
            data-testid="search-input"
          />

          {/* Search Button */}
          <button
            type="submit"
            className="h-10 w-12 bg-[#febd69] hover:bg-[#f3a847] flex items-center justify-center rounded-r-md transition-colors"
            data-testid="search-button"
          >
            <Search className="w-5 h-5 text-[#131921]" />
          </button>
        </form>

        {/* Language */}
        <div
          className="hidden lg:flex items-center text-white px-2 py-1 border border-transparent hover:border-white rounded-sm cursor-pointer"
          data-testid="language-selector"
        >
          <img
            src="https://flagcdn.com/w40/in.png"
            alt="India"
            className="w-5 h-4"
          />
          <span className="ml-1 text-sm font-bold">EN</span>
          <ChevronDown className="w-3 h-3 ml-0.5 text-gray-400" />
        </div>

        {/* Account & Lists */}
        <div
          className="relative hidden sm:block"
          ref={accountRef}
        >
          <div
            className="flex flex-col text-white px-2 py-1 border border-transparent hover:border-white rounded-sm cursor-pointer"
            onMouseEnter={() => setShowAccountDropdown(true)}
            onMouseLeave={() => setShowAccountDropdown(false)}
            data-testid="account-dropdown"
          >
            <span className="text-xs text-[#ccc]">
              {isAuthenticated ? `Hello, ${user?.name?.split(' ')[0]}` : 'Hello, sign in'}
            </span>
            <span className="text-sm font-bold flex items-center">
              Account & Lists
              <ChevronDown className="w-3 h-3 ml-1 text-gray-400" />
            </span>
          </div>

          {showAccountDropdown && (
            <div
              className="absolute right-0 top-[100%] mt-[-1px] bg-white border border-[#d5d9d9] rounded-sm shadow-xl z-50 w-[460px] cursor-default"
              onMouseEnter={() => setShowAccountDropdown(true)}
              onMouseLeave={() => setShowAccountDropdown(false)}
              data-testid="account-menu"
            >
              <div className="absolute -top-2 right-12 w-4 h-4 bg-white transform rotate-45 border-t border-l border-[#d5d9d9]"></div>

              {!isAuthenticated && (
                <div className="flex flex-col items-center justify-center py-4 border-b border-[#eee] bg-[#fcfcfc] rounded-t-sm">
                  <Link
                    to="/signin"
                    className="w-[200px] h-[33px] flex items-center justify-center bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-md text-[13px] text-[#111] font-normal shadow-sm"
                  >
                    Sign in
                  </Link>
                  <div className="flex items-center gap-1 mt-2 text-[11px] text-[#111]">
                    <span>New customer?</span>
                    <Link to="/register" className="text-[#007185] hover:text-[#c7511f] hover:underline">Start here.</Link>
                  </div>
                </div>
              )}

              <div className="flex p-5">
                {/* Your Lists */}
                <div className="w-1/2 pr-4 border-r border-[#eee]">
                  <h3 className="text-[16px] font-bold text-[#111] mb-2.5">Your Lists</h3>
                  <ul className="space-y-1.5">
                    {[
                      'Create a Wish List',
                      'Wish from Any Website',
                      'Baby Wishlist',
                      'Discover Your Style',
                      'Explore Showroom'
                    ].map((item) => (
                      <li key={item}>
                        <Link to="#" className="text-[13px] text-[#444] hover:text-[#c7511f] hover:underline leading-tight block py-0.5">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Your Account */}
                <div className="w-1/2 pl-5">
                  <h3 className="text-[16px] font-bold text-[#111] mb-2.5">Your Account</h3>
                  <ul className="space-y-1.5">
                    {[
                      'Your Account',
                      'Your Orders',
                      'Your Wish List',
                      'Keep shopping for',
                      'Your Recommendations',
                      'Your Prime Membership',
                      'Your Prime Video',
                      'Your Subscribe & Save Items',
                      'Memberships & Subscriptions',
                      'Your Seller Account',
                      'Manage Your Content and Devices',
                      'Register for a free Business Account'
                    ].map((item) => (
                      <li key={item}>
                        <Link to="#" className="text-[13px] text-[#444] hover:text-[#c7511f] hover:underline leading-tight block py-0.5">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Returns & Orders */}
        <Link
          to="/orders"
          className="hidden sm:flex flex-col text-white px-2 py-1 border border-transparent hover:border-white rounded-sm"
          data-testid="orders-link"
        >
          <span className="text-xs text-[#ccc]">Returns</span>
          <span className="text-sm font-bold">& Orders</span>
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className="flex items-center text-white px-2 py-1 border border-transparent hover:border-white rounded-sm relative"
          data-testid="cart-link"
        >
          <div className="relative">
            <ShoppingCart className="w-8 h-8" />
            <span
              className="absolute -top-1 right-0 bg-[#f08804] text-[#131921] text-sm font-bold px-1.5 rounded-full min-w-[20px] text-center"
              data-testid="cart-count"
            >
              {cartCount}
            </span>
          </div>
          <span className="hidden sm:inline text-sm font-bold ml-1">Cart</span>
        </Link>
      </div>

      {/* Sub Navigation */}
      <nav
        className="bg-[#232f3e] flex items-center px-2 py-1 text-white text-sm gap-1 overflow-x-auto w-full"
        data-testid="sub-nav"
      >
        <button
          onClick={() => setShowSidebar(true)}
          className="flex items-center px-2 py-1 border border-transparent hover:border-white rounded-sm whitespace-nowrap font-bold"
          data-testid="all-menu-button"
        >
          <Menu className="w-5 h-5 mr-1" />
          All
        </button>
        <Link to="/deals" className="px-2 py-1 border border-transparent hover:border-white rounded-sm whitespace-nowrap">
          Today's Deals
        </Link>
        <Link to="/customer-service" className="px-2 py-1 border border-transparent hover:border-white rounded-sm whitespace-nowrap">
          Customer Service
        </Link>
        <Link to="/registry" className="px-2 py-1 border border-transparent hover:border-white rounded-sm whitespace-nowrap">
          Registry
        </Link>
        <Link to="/gift-cards" className="px-2 py-1 border border-transparent hover:border-white rounded-sm whitespace-nowrap">
          Gift Cards
        </Link>
        <Link to="/sell" className="px-2 py-1 border border-transparent hover:border-white rounded-sm whitespace-nowrap">
          Sell
        </Link>
        <span className="ml-auto px-2 py-1 text-[#febd69] font-bold whitespace-nowrap hidden md:block">
          Shop deals in Electronics
        </span>
      </nav>

      {/* Sidebar Menu */}
      <SidebarMenu isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
    </header>
  );
};

export default Header;
