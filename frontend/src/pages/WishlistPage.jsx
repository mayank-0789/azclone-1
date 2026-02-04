import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MoreHorizontal, Search, Plus, Share2, Trash2, ChevronDown, Grid, List, GripVertical, User } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WishlistPage = () => {
  const [searchCategories, setSearchCategories] = useState([]);
  const [footerLinks, setFooterLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [activeList, setActiveList] = useState('Shopping List');

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

  const handleMoveToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item.id);
  };

  // Sidebar List Data
  const userLists = [
    { name: 'Shopping List', private: true, default: true, count: wishlist.length > 0 ? wishlist.length : 2 },
  ];

  // Mock Data (Uncomment to see populated state)
  const mockWishlistItems = [
    // {
    //   id: 101,
    //   title: "Urban Jungle by Safari, The Domain, Daily Commute Workpack | Premium Fabric & Water Resistant | 180° Flat-open & Easy Access Laptop compartment | Unisex office backpack with Trolley Sleeve",
    //   brand: "Urban Jungle",
    //   price: 3235.00,
    //   rating: 4.5,
    //   reviewCount: 18,
    //   image: "https://m.media-amazon.com/images/I/61y+1+1+1+L._AC_SL1500_.jpg", 
    //   addedAt: "4 February 2026",
    //   inStock: true
    // },
    // {
    //   id: 102,
    //   title: "Redmi Note 9 (Aqua Green, 4GB RAM, 64GB Storage) - 48MP Quad Camera & Full HD+ Display",
    //   brand: "XIAOMI (Unknown Binding)",
    //   rating: 4.0,
    //   reviewCount: 31779,
    //   image: "https://m.media-amazon.com/images/I/71X5I1+1+1+L._AC_SL1500_.jpg", 
    //   addedAt: "25 June 2021",
    //   buyingOptions: true 
    // }
  ];

  // Logic: Real wishlist -> Mock wishlist -> Empty
  // Current requirement: Match the Empty Screenshot provided by user.
  // So we default to empty if real wishlist is empty.
  const displayWishlist = wishlist.length > 0 ? wishlist : mockWishlistItems;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header searchCategories={[]} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#febd69] border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#0F1111]" data-testid="wishlist-page">
      <Header searchCategories={searchCategories} />

      <main className="max-w-[1240px] mx-auto px-4 py-4">
        {/* Top Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#ddd] mb-5">
          <div className="flex gap-8 text-[16px]">
            <span className="pb-2 border-b-[3px] border-[#e77600] font-bold text-[#0F1111] cursor-pointer">Your Lists</span>
            <span className="pb-2 text-[#565959] hover:text-[#c7511f] hover:underline cursor-pointer">Your Friends</span>
          </div>
          <Link to="/#create-list" className="text-[#007185] text-[13px] hover:text-[#c7511f] hover:underline mb-2">Create a List</Link>
        </div>

        <div className="flex gap-12 min-h-[600px]">
          {/* Left Sidebar: Lists */}
          <div className="w-[280px] shrink-0">
            <div className="bg-[#f0f2f2] p-3 border-l-[6px] border-[#007185] rounded-tl-[4px] rounded-bl-[4px] cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-[13px] text-[#0F1111] leading-tight mb-0.5">Shopping List</div>
                  <div className="text-[11px] text-[#565959]">Default List</div>
                </div>
                <span className="text-[#007185] text-[10px] bg-transparent">Private</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* List Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-2">
                  <h1 className="text-[24px] font-bold text-[#0f1111]">Shopping List</h1>
                  <span className="text-[12px] text-[#565959]">Private</span>
                </div>
                {/* Invite Section: Avatar + Button */}
                <div className="flex items-center gap-2">
                  <div className="w-[35px] h-[35px] bg-[#D5D9D9] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white fill-current" />
                  </div>
                  <button className="flex items-center gap-1 border border-[#D5D9D9] rounded-full px-4 py-1 text-[13px] font-medium shadow-sm hover:bg-[#f7fafa]">
                    <Plus className="w-4 h-4 text-[#007185]" />
                    <span className="text-[#007185]">Invite</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons (Top Right) */}
              <div className="flex gap-2.5">
                <button className="border border-[#D5D9D9] rounded-full px-4 py-1.5 text-[13px] shadow-sm hover:bg-[#f7fafa] text-[#0F1111]">Add item</button>
                <button className="border border-[#D5D9D9] rounded-full px-2.5 py-1.5 shadow-sm hover:bg-[#f7fafa] text-[#0F1111]">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="border border-[#D5D9D9] rounded-full px-2.5 py-1.5 shadow-sm hover:bg-[#f7fafa] text-[#0F1111]">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-wrap justify-between items-center border-b border-[#ddd] pb-3 mb-8 gap-y-3">
              <div className="flex items-center gap-3">
                <Grid className="w-5 h-5 text-[#cccccc] cursor-pointer" />
                <div className="border-b-[3px] border-[#e77600] pb-1">
                  <List className="w-5 h-5 text-[#0F1111] cursor-pointer" />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-[#0F1111]" />
                  <input
                    type="text"
                    placeholder="Search this list"
                    className="pl-9 pr-4 py-1.5 border border-[#888c8c] rounded-[8px] text-[13px] placeholder-[#565959] w-[180px] shadow-sm focus:ring-1 focus:ring-[#e77600] focus:border-[#e77600] outline-none"
                  />
                </div>
                <button className="flex items-center gap-1 bg-white border border-[#D5D9D9] rounded-[8px] px-3 py-1.5 text-[13px] shadow-sm hover:bg-[#f7fafa] text-[#0F1111]">
                  Show: Unpurchased <ChevronDown className="w-3 h-3 ml-1" />
                </button>
                <button className="flex items-center gap-1 bg-white border border-[#D5D9D9] rounded-[8px] px-3 py-1.5 text-[13px] shadow-sm hover:bg-[#f7fafa] text-[#0F1111]">
                  Sort by: Most recently added <ChevronDown className="w-3 h-3 ml-1" />
                </button>
              </div>
            </div>

            {/* Items List or Empty State */}
            {displayWishlist.length === 0 ? (
              <div className="flex items-start gap-4 p-4">
                {/* Note Icon */}
                <div className="mt-1">
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <line x1="10" y1="9" x2="8" y2="9"></line>
                  </svg>
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-[#0F1111] mb-1">There are no items in this List.</h2>
                  <p className="text-[13px] text-[#0F1111]">Add items you want to shop for.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {displayWishlist.map((item, index) => (
                  <div key={item.id} className="border border-[#D5D9D9] rounded-[8px] hover:bg-[#fafafa] transition-colors relative group">
                    {/* ... Product Card Code (same as before) ... */}
                    <div className="flex p-4 gap-5">
                      {/* Drag Handle */}
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab text-[#D5D9D9] hover:text-[#565959] opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="w-5 h-5" />
                      </div>

                      {/* Image */}
                      <div className="w-[180px] h-[180px] flex items-center justify-center bg-[#f8f8f8] rounded-sm shrink-0 ml-4">
                        <Link to={`/product/${item.id}`}>
                          <img src={item.image || "https://m.media-amazon.com/images/I/61y+1+1+1+L._AC_SL1500_.jpg"} alt={item.title} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                        </Link>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.id}`} className="text-[#007185] font-medium hover:text-[#c7511f] hover:underline text-[16px] leading-[1.3] mb-1 block line-clamp-2">
                          {item.title}
                        </Link>
                        {item.brand && <div className="text-[12px] text-[#565959] mb-1">by {item.brand}</div>}

                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex text-[#FFA41C] text-[12px] tracking-tighter">
                            {'★'.repeat(Math.round(item.rating))}{'☆'.repeat(5 - Math.round(item.rating))}
                            <ChevronDown className="w-2.5 h-2.5 text-[#565959] ml-0.5" />
                          </div>
                          <span className="text-[12px] text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">{item.reviewCount ? item.reviewCount.toLocaleString() : 18}</span>
                        </div>

                        <div className="mb-2">
                          <span className="text-[18px] font-bold text-[#0F1111]">₹{item.price?.toLocaleString('en-IN') || '3,235.00'}</span>
                          {item.isPrime && <img src="https://m.media-amazon.com/images/G/31/marketing/prime/Prime_icon_30x30._CB610151600_.png" alt="Prime" className="h-[14px] ml-2 inline-block align-baseline" />}
                        </div>

                        {item.inStock && (
                          <div className="text-[12px] text-[#007600] mb-4">In stock</div>
                        )}

                        <div className="text-[12px] text-[#565959] mb-4">
                          Item added {item.addedAt || '4 February 2026'}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {item.buyingOptions ? (
                            <button className="bg-white border border-[#D5D9D9] rounded-full px-5 py-1.5 text-[13px] text-[#0F1111] shadow-sm hover:bg-[#f7fafa] font-medium">
                              See all buying options
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMoveToCart(item)}
                              className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full px-6 py-1.5 text-[13px] text-[#0F1111] shadow-sm font-medium"
                            >
                              Add to Cart
                            </button>
                          )}

                          <button className="bg-white border border-[#D5D9D9] rounded-full px-4 py-1.5 text-[13px] text-[#0F1111] shadow-sm hover:bg-[#f7fafa] font-medium">
                            Add a note
                          </button>

                          <button className="bg-white border border-[#D5D9D9] rounded-full px-3 py-1.5 text-[13px] text-[#0F1111] shadow-sm hover:bg-[#f7fafa] flex items-center gap-1 font-medium">
                            Move <ChevronDown className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="bg-white border border-[#D5D9D9] rounded-full w-9 h-8 flex items-center justify-center text-[#0F1111] shadow-sm hover:bg-[#f7fafa]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-t border-[#ddd] mt-8 pt-4 text-center text-[12px] text-[#565959]">
                  End of list
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer footerLinks={footerLinks} />
    </div>
  );
};

export default WishlistPage;
