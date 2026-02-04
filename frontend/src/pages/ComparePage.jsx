import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { X, Star, Check, ShoppingCart, ChevronRight, BarChart3 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ComparePage = () => {
  const [searchCategories, setSearchCategories] = useState([]);
  const [footerLinks, setFooterLinks] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [searchCatRes, footerRes, productsRes] = await Promise.all([
        axios.get(`${API}/search-categories`),
        axios.get(`${API}/footer-links`),
        axios.get(`${API}/products`)
      ]);
      setSearchCategories(searchCatRes.data);
      setFooterLinks(footerRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < fullStars ? 'fill-[#de7921] text-[#de7921]' : 'text-gray-300'}`} 
        />
      );
    }
    return stars;
  };

  // Mock compare items for demo
  const mockCompareItems = [
    products.find(p => p.id === 1),
    products.find(p => p.id === 7),
    products.find(p => p.id === 10)
  ].filter(Boolean);

  const displayCompare = compareList.length > 0 ? compareList : mockCompareItems;

  // Comparison attributes
  const comparisonAttributes = [
    { key: 'price', label: 'Price', format: (v) => `$${v.toFixed(2)}` },
    { key: 'originalPrice', label: 'List Price', format: (v) => `$${v.toFixed(2)}` },
    { key: 'rating', label: 'Rating', format: (v) => `${v} out of 5` },
    { key: 'reviewCount', label: 'Reviews', format: (v) => v.toLocaleString() },
    { key: 'isPrime', label: 'Prime', format: (v) => v ? 'Yes' : 'No' },
    { key: 'category', label: 'Category', format: (v) => v.replace('-', ' ').charAt(0).toUpperCase() + v.replace('-', ' ').slice(1) }
  ];

  // Find best values
  const getBestValue = (key) => {
    if (displayCompare.length === 0) return null;
    if (key === 'price') {
      return Math.min(...displayCompare.map(p => p.price));
    }
    if (key === 'rating' || key === 'reviewCount') {
      return Math.max(...displayCompare.map(p => p[key]));
    }
    return null;
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
    <div className="min-h-screen bg-white" data-testid="compare-page">
      <Header searchCategories={searchCategories} />

      <main className="max-w-[1500px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#565959] mb-4">
          <Link to="/" className="hover:text-[#c7511f] hover:underline">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#0f1111]">Compare Products</span>
        </nav>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#0f1111] flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Compare Products
          </h1>
          {displayCompare.length > 0 && (
            <button
              onClick={clearCompare}
              className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline"
              data-testid="clear-compare"
            >
              Clear all
            </button>
          )}
        </div>

        {displayCompare.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <BarChart3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-[#0f1111] mb-2">
              No products to compare
            </h2>
            <p className="text-sm text-[#565959] mb-4">
              Add products to compare by clicking "Compare" on any product page.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-2 bg-[#ffd814] hover:bg-[#f7ca00] rounded-full text-sm font-medium transition-colors"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              {/* Product Images Row */}
              <thead>
                <tr>
                  <th className="w-48 p-4 bg-[#f7f8f8] border border-gray-200 text-left font-normal text-sm text-[#565959]">
                    Product
                  </th>
                  {displayCompare.map((product) => (
                    <th key={product.id} className="p-4 border border-gray-200 min-w-[200px] relative">
                      <button
                        onClick={() => removeFromCompare(product.id)}
                        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
                        data-testid={`remove-compare-${product.id}`}
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-32 h-32 object-contain mx-auto mb-3"
                        />
                        <h3 className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline line-clamp-3 text-left">
                          {product.title}
                        </h3>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Rating Row */}
                <tr>
                  <td className="p-4 bg-[#f7f8f8] border border-gray-200 text-sm text-[#565959]">
                    Customer Rating
                  </td>
                  {displayCompare.map((product) => (
                    <td key={product.id} className="p-4 border border-gray-200">
                      <div className="flex items-center gap-1">
                        {renderStars(product.rating)}
                        <span className="text-sm text-[#007185] ml-1">
                          ({product.reviewCount.toLocaleString()})
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Price Row */}
                <tr>
                  <td className="p-4 bg-[#f7f8f8] border border-gray-200 text-sm text-[#565959]">
                    Price
                  </td>
                  {displayCompare.map((product) => {
                    const isBestPrice = product.price === getBestValue('price');
                    return (
                      <td 
                        key={product.id} 
                        className={`p-4 border border-gray-200 ${isBestPrice ? 'bg-[#f0fff4]' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-medium text-[#0f1111]">
                            ${product.price.toFixed(2)}
                          </span>
                          {isBestPrice && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                              Best Price
                            </span>
                          )}
                        </div>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-[#565959] line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Savings Row */}
                <tr>
                  <td className="p-4 bg-[#f7f8f8] border border-gray-200 text-sm text-[#565959]">
                    You Save
                  </td>
                  {displayCompare.map((product) => {
                    const savings = product.originalPrice - product.price;
                    const savingsPercent = Math.round((savings / product.originalPrice) * 100);
                    return (
                      <td key={product.id} className="p-4 border border-gray-200">
                        {savings > 0 ? (
                          <span className="text-[#cc0c39] font-medium">
                            ${savings.toFixed(2)} ({savingsPercent}%)
                          </span>
                        ) : (
                          <span className="text-[#565959]">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Prime Row */}
                <tr>
                  <td className="p-4 bg-[#f7f8f8] border border-gray-200 text-sm text-[#565959]">
                    Prime Eligible
                  </td>
                  {displayCompare.map((product) => (
                    <td key={product.id} className="p-4 border border-gray-200">
                      {product.isPrime ? (
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-600" />
                          <svg viewBox="0 0 68 20" className="w-12 h-5">
                            <path 
                              fill="#232f3e" 
                              d="M66.8 5.6c-.8-.5-1.6-.7-2.5-.7-1.5 0-2.7.6-3.6 1.8V5.2h-3.3v13.3h3.5v-7.1c0-.7.1-1.3.4-1.8.4-.7 1.1-1.1 2-1.1.8 0 1.4.3 1.7.8.2.4.3.9.3 1.5v7.7h3.5v-8.3c0-1.7-.7-3-2-3.6z"
                            />
                            <path 
                              fill="#f90" 
                              d="M63.5 17.8c-4.5 2.4-9.7 3.5-14.5 3.5-6.9 0-13.1-2-17.8-5.3-.4-.3 0-.7.4-.5 5.1 2.4 11.3 3.8 17.8 3.8 4.4 0 9.2-.7 13.6-2.2.7-.2 1.2.5.5.7z"
                            />
                          </svg>
                        </div>
                      ) : (
                        <X className="w-5 h-5 text-gray-400" />
                      )}
                    </td>
                  ))}
                </tr>

                {/* Category Row */}
                <tr>
                  <td className="p-4 bg-[#f7f8f8] border border-gray-200 text-sm text-[#565959]">
                    Category
                  </td>
                  {displayCompare.map((product) => (
                    <td key={product.id} className="p-4 border border-gray-200 text-sm capitalize">
                      {product.category.replace('-', ' ')}
                    </td>
                  ))}
                </tr>

                {/* Add to Cart Row */}
                <tr>
                  <td className="p-4 bg-[#f7f8f8] border border-gray-200 text-sm text-[#565959]">
                    Add to Cart
                  </td>
                  {displayCompare.map((product) => (
                    <td key={product.id} className="p-4 border border-gray-200">
                      <button
                        onClick={() => addToCart(product)}
                        className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-[#ffd814] hover:bg-[#f7ca00] rounded-full text-sm font-medium transition-colors"
                        data-testid={`compare-add-cart-${product.id}`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Suggested Products to Compare */}
        {displayCompare.length > 0 && displayCompare.length < 4 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-[#0f1111] mb-4">
              Add more products to compare
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {products
                .filter(p => !displayCompare.some(c => c.id === p.id))
                .slice(0, 6)
                .map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full aspect-square object-contain mb-2"
                    />
                    <h3 className="text-xs text-[#0f1111] line-clamp-2">{product.title}</h3>
                    <p className="text-sm font-medium mt-1">${product.price.toFixed(2)}</p>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </main>

      <Footer footerLinks={footerLinks} />
    </div>
  );
};

export default ComparePage;
