import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, Grid, List } from 'lucide-react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [searchCategories, setSearchCategories] = useState([]);
  const [footerLinks, setFooterLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedRating, setSelectedRating] = useState(0);
  const [primeOnly, setPrimeOnly] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchSearchResults();
  }, [query, category]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const [productsRes, searchCatRes, footerRes] = await Promise.all([
        axios.get(`${API}/products/search`, {
          params: { q: query, category }
        }),
        axios.get(`${API}/search-categories`),
        axios.get(`${API}/footer-links`)
      ]);

      setProducts(productsRes.data);
      setSearchCategories(searchCatRes.data);
      setFooterLinks(footerRes.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  // Filter and sort products
  let filteredProducts = [...products];

  // Filter by price range
  if (priceRange.min) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(priceRange.min));
  }
  if (priceRange.max) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(priceRange.max));
  }

  // Filter by rating
  if (selectedRating > 0) {
    filteredProducts = filteredProducts.filter(p => p.rating >= selectedRating);
  }

  // Filter by Prime
  if (primeOnly) {
    filteredProducts = filteredProducts.filter(p => p.isPrime);
  }

  // Sort
  switch (sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case 'reviews':
      filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    default:
      break;
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'fill-[#de7921] text-[#de7921]' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header searchCategories={[]} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#febd69] border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="search-page">
      <Header searchCategories={searchCategories} />

      <main className="max-w-[1500px] mx-auto">
        <div className="flex">
          {/* Left Sidebar - Filters */}
          <aside className="hidden md:block w-64 p-4 border-r border-gray-200">
            <h2 className="font-bold text-lg mb-4">Filters</h2>

            {/* Category */}
            <div className="mb-4">
              <h3 className="font-bold text-sm mb-2">Category</h3>
              <div className="text-sm">
                <button className="flex items-center text-[#0f1111] hover:text-[#c7511f] mb-1 font-medium">
                  <span className="mr-1">‹</span> {category !== 'All' ? category : 'Any Department'}
                </button>
                <div className="ml-2 font-bold text-[#0f1111] mb-1">Top 100</div>
                <ul className="ml-4 space-y-1 text-[#0f1111]">
                  <li><button className="hover:text-[#c7511f]">Women</button></li>
                  <li><button className="hover:text-[#c7511f]">Men</button></li>
                  <li><button className="hover:text-[#c7511f]">Bags & Luggage</button></li>
                </ul>
              </div>
            </div>

            {/* Prime */}
            <div className="mb-4">
              <h3 className="font-bold text-sm mb-2">Amazon Prime</h3>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={primeOnly}
                  onChange={(e) => setPrimeOnly(e.target.checked)}
                  className="rounded border-gray-300 text-[#e77600] focus:ring-[#e77600]"
                  data-testid="prime-filter"
                />
                <div className="flex items-center">
                  <div className="flex items-center">
                    <span className="text-[#00A8E1] font-bold text-[13px] italic leading-none" style={{ fontFamily: 'sans-serif' }}>prime</span>
                  </div>
                </div>
              </label>
            </div>

            {/* Delivery Day */}
            <div className="mb-4">
              <h3 className="font-bold text-sm mb-2">Delivery Day</h3>
              <div className="space-y-1">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-[#0f1111] hover:text-[#c7511f]">
                  <input type="checkbox" className="rounded border-gray-300" />
                  Get It Today
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-[#0f1111] hover:text-[#c7511f]">
                  <input type="checkbox" className="rounded border-gray-300" />
                  Get It by Tomorrow
                </label>
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="mb-4">
              <h3 className="font-bold text-sm mb-2">Customer Review</h3>
              <div className="space-y-1">
                {[4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                    className={`flex items-center gap-1 hover:text-[#c7511f] ${selectedRating === rating ? 'text-[#c7511f]' : ''
                      }`}
                    data-testid={`rating-filter-${rating}`}
                  >
                    <div className="flex">{renderStars(rating)}</div>
                    <span className="text-sm text-[#0f1111]">& Up</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-4">
              <h3 className="font-bold text-sm mb-2">Price</h3>
              <div className="space-y-1 mb-2">
                <button
                  onClick={() => setPriceRange({ min: '', max: '1000' })}
                  className="block text-sm text-[#0f1111] hover:text-[#c7511f]"
                >
                  Under ₹1,000
                </button>
                <button
                  onClick={() => setPriceRange({ min: '1000', max: '5000' })}
                  className="block text-sm text-[#0f1111] hover:text-[#c7511f]"
                >
                  ₹1,000 - ₹5,000
                </button>
                <button
                  onClick={() => setPriceRange({ min: '5000', max: '10000' })}
                  className="block text-sm text-[#0f1111] hover:text-[#c7511f]"
                >
                  ₹5,000 - ₹10,000
                </button>
                <button
                  onClick={() => setPriceRange({ min: '10000', max: '20000' })}
                  className="block text-sm text-[#0f1111] hover:text-[#c7511f]"
                >
                  ₹10,000 - ₹20,000
                </button>
                <button
                  onClick={() => setPriceRange({ min: '20000', max: '' })}
                  className="block text-sm text-[#0f1111] hover:text-[#c7511f]"
                >
                  Over ₹20,000
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="₹ Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-[4px] text-sm shadow-inner placeholder-gray-500"
                  data-testid="price-min"
                />
                <input
                  type="number"
                  placeholder="₹ Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-[4px] text-sm shadow-inner placeholder-gray-500"
                  data-testid="price-max"
                />
                <button className="px-2 py-1 border border-gray-300 rounded-[7px] text-sm shadow-sm hover:bg-gray-50 bg-white">Go</button>
              </div>
            </div>

            {/* Deals & Discounts */}
            <div className="mb-4">
              <h3 className="font-bold text-sm mb-2">Deals & Discounts</h3>
              <div className="space-y-1">
                <button className="block text-sm text-[#0f1111] hover:text-[#c7511f]">All Discounts</button>
                <button className="block text-sm text-[#0f1111] hover:text-[#c7511f]">Today's Deals</button>
              </div>
            </div>

            {/* Availability */}
            <div className="mb-4">
              <h3 className="font-bold text-sm mb-2">Availability</h3>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-[#0f1111] hover:text-[#c7511f]">
                <input type="checkbox" className="rounded border-gray-300" />
                Include Out of Stock
              </label>
            </div>

            {/* Pay On Delivery */}
            <div className="mb-6">
              <h3 className="font-bold text-sm mb-2">Pay On Delivery</h3>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-[#0f1111] hover:text-[#c7511f]">
                <input type="checkbox" className="rounded border-gray-300" />
                Eligible for Pay On Delivery
              </label>
            </div>

            {/* Clear Filters */}
            {(priceRange.min || priceRange.max || selectedRating > 0 || primeOnly) && (
              <button
                onClick={() => {
                  setPriceRange({ min: '', max: '' });
                  setSelectedRating(0);
                  setPrimeOnly(false);
                }}
                className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline"
                data-testid="clear-filters"
              >
                Clear all filters
              </button>
            )}
          </aside>

          {/* Main Content */}
          <div className="flex-1 p-4">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-200">
              <div>
                <h1 className="text-xl font-bold text-[#0f1111]">
                  {query ? `Results for "${query}"` : 'All Products'}
                </h1>
                <p className="text-sm text-[#565959]">
                  {filteredProducts.length} results
                  {category !== 'All' && ` in ${category}`}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-[#565959]">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-[#f0f2f2] focus:outline-none focus:ring-2 focus:ring-[#e77600]"
                    data-testid="sort-select"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Avg. Customer Review</option>
                    <option value="reviews">Most Reviews</option>
                  </select>
                </div>


              </div>
            </div>

            {/* Results */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium text-[#0f1111] mb-2">
                  No results found
                </h2>
                <p className="text-sm text-[#565959] mb-4">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <Link
                  to="/"
                  className="inline-block px-6 py-2 bg-[#ffd814] hover:bg-[#f7ca00] rounded-full text-sm font-medium transition-colors"
                >
                  Continue shopping
                </Link>
              </div>
            ) : (
              <div
                className={viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                  : 'space-y-4'
                }
                data-testid="search-results"
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer footerLinks={footerLinks} />
    </div>
  );
};

export default SearchPage;
