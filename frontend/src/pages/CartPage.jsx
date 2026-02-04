import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CartPage = () => {
  const [searchCategories, setSearchCategories] = useState([]);
  const [footerLinks, setFooterLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const { cart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [searchCatRes, footerRes] = await Promise.all([
        axios.get(`${API}/search-categories`),
        axios.get(`${API}/footer-links`)
      ]);
      setSearchCategories(searchCatRes.data);
      setFooterLinks(footerRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eaeded]">
        <Header searchCategories={[]} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#febd69] border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eaeded]" data-testid="cart-page">
      <Header searchCategories={searchCategories} />

      <main className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Cart Items Column */}
          <div className="bg-white p-6 rounded-sm">
            <div className="flex items-end justify-between border-b border-gray-200 pb-2 mb-4">
              <h1 className="text-[28px] font-normal text-[#0f1111] leading-tight">Shopping Cart</h1>
              <span className="text-sm text-[#565959] place-self-end pb-1">Price</span>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-medium text-[#0f1111] mb-2">
                  Your Amazon Cart is empty
                </h2>
                <Link
                  to="/"
                  className="inline-block px-6 py-2 bg-[#ffd814] hover:bg-[#f7ca00] rounded-full text-sm font-medium transition-colors mt-4 shadow-sm"
                >
                  Continue shopping
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {cart.map((item) => {
                  const discount = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;

                  return (
                    <div
                      key={item.id}
                      className="py-6 flex gap-4"
                      data-testid={`cart-item-${item.id}`}
                    >
                      {/* 1. Image Column */}
                      <Link to={`/product/${item.id}`} className="shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-[180px] h-[180px] object-contain"
                        />
                      </Link>

                      {/* 2. Details Column */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.id}`}>
                          <h3 className="text-[18px] font-medium text-[#0f1111] leading-6 mb-1 hover:text-[#c7511f] hover:underline">
                            {item.title}
                          </h3>
                        </Link>

                        <div className="font-bold text-[#007600] text-[12px] mb-1">In stock</div>
                        <div className="text-[12px] text-[#565959] mb-2">Eligible for FREE Shipping</div>

                        <div className="flex items-center gap-1 mb-2">
                          <img src="https://m.media-amazon.com/images/G/31/marketing/prime/Prime_icon_30x30._CB610151600_.png" alt="Prime" className="h-[18px]" />
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <input type="checkbox" id={`gift-${item.id}`} className="rounded border-gray-300 text-[#007185] focus:ring-0" />
                          <label htmlFor={`gift-${item.id}`} className="text-[12px] text-[#0f1111]">This will be a gift <span className="text-[#007185] hover:underline cursor-pointer">Learn more</span></label>
                        </div>

                        {/* Controls Row */}
                        <div className="flex items-center flex-wrap gap-4 text-[12px]">
                          {/* Quantity Stepper */}
                          <div className="flex items-center rounded-md border border-[#D5D9D9] shadow-sm bg-[#F0F2F2] hover:bg-[#e3e6e6]">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-9 h-8 flex items-center justify-center border-r border-[#D5D9D9]"
                            >
                              {item.quantity === 1 ? <Trash2 className="w-4 h-4 text-[#565959]" /> : <Minus className="w-4 h-4 text-[#565959]" />}
                            </button>
                            <div className="w-10 h-8 flex items-center justify-center bg-white text-[13px] font-medium text-[#0f1111] border-r border-[#D5D9D9]">
                              {item.quantity}
                            </div>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-9 h-8 flex items-center justify-center"
                            >
                              <Plus className="w-4 h-4 text-[#565959]" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 text-[#007185]">
                            <button onClick={() => removeFromCart(item.id)} className="hover:underline hover:text-[#c7511f]">Delete</button>
                            <span className="text-[#D5D9D9]">|</span>
                            <button className="hover:underline hover:text-[#c7511f]">Save for later</button>
                            <span className="text-[#D5D9D9]">|</span>
                            <button className="hover:underline hover:text-[#c7511f]">See more like this</button>
                            <span className="text-[#D5D9D9]">|</span>
                            <button className="hover:underline hover:text-[#c7511f]">Share</button>
                          </div>
                        </div>
                      </div>

                      {/* 3. Price Column (Right aligned) */}
                      <div className="text-right shrink-0 min-w-[150px]">
                        <div className="flex items-center justify-end gap-2 mb-1">
                          <span className="bg-[#CC0C39] text-white text-[12px] font-bold px-1.5 py-0.5 rounded-sm">{discount}% off</span>
                          <span className="text-[#CC0C39] text-[12px] font-bold">Limited time deal</span>
                        </div>
                        <div className="text-[18px] font-bold text-[#0f1111]">
                          ₹{item.price.toLocaleString('en-IN')}.00
                        </div>
                        {item.originalPrice && (
                          <div className="text-[12px] text-[#565959]">
                            M.R.P.: <span className="line-through">₹{item.originalPrice.toLocaleString('en-IN')}.00</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Subtotal */}
            {cart.length > 0 && (
              <div className="text-right pt-4 border-t border-gray-200 mt-4">
                <span className="text-[18px] text-[#0f1111]">
                  Subtotal ({cartCount} items): <span className="font-bold">₹{cartTotal.toLocaleString('en-IN')}.00</span>
                </span>
              </div>
            )}
          </div>

          {/* Checkout Right Sidebar */}
          {cart.length > 0 && (
            <div className="h-fit">
              <div className="bg-white p-5 rounded-sm shadow-sm sticky top-4">
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-[12px] text-[#067D62] mb-2">
                    <span className="bg-[#067D62] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">✓</span>
                    <span>Your order is eligible for FREE Delivery.</span>
                  </div>
                  <div className="text-[12px] text-[#0f1111] ml-6">
                    Select this option at checkout. <span className="text-[#007185] hover:underline cursor-pointer">Details</span>
                  </div>
                </div>

                <div className="text-[18px] text-[#0f1111] mb-6">
                  Subtotal ({cartCount} items): <span className="font-bold">₹{cartTotal.toLocaleString('en-IN')}.00</span>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <input type="checkbox" id="gift-sidebar" className="rounded border-gray-300 text-[#007185] focus:ring-0" />
                  <label htmlFor="gift-sidebar" className="text-[14px]">This order contains a gift</label>
                </div>

                <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full py-2 shadow-sm text-[13px] text-[#0F1111] mb-4">
                  Proceed to Buy
                </button>

                <div className="border border-[#D5D9D9] rounded-md p-3 bg-white">
                  <div className="text-[13px] font-semibold mb-2">EMI Available</div>
                  <div className="text-[12px] text-[#565959]">Your order qualifies for EMI with valid credit cards (not available on purchase of Gold, Jewelry, Gift cards and Amazon pay balance top up). <span className="text-[#007185] hover:underline cursor-pointer">Learn more</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer footerLinks={footerLinks} />
    </div>
  );
};

export default CartPage;
