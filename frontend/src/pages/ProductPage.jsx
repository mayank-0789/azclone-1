import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, StarHalf, Check, ChevronRight, MapPin, Truck, Shield, RotateCcw } from 'lucide-react';
import Header from '../components/Header';
import ProductCarousel from '../components/ProductCarousel';
import ProductReviews from '../components/ProductReviews';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchCategories, setSearchCategories] = useState([]);
  const [footerLinks, setFooterLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProductData();
  }, [id]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const [productRes, productsRes, searchCatRes, footerRes] = await Promise.all([
        axios.get(`${API}/products/${id}`),
        axios.get(`${API}/products`),
        axios.get(`${API}/search-categories`),
        axios.get(`${API}/footer-links`)
      ]);

      setProduct(productRes.data);
      setProducts(productsRes.data);
      setSearchCategories(searchCatRes.data);
      setFooterLinks(footerRes.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-5 h-5 fill-[#de7921] text-[#de7921]" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="w-5 h-5 fill-[#de7921] text-[#de7921]" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
      );
    }

    return stars;
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header searchCategories={searchCategories} />
        <div className="max-w-[1500px] mx-auto px-4 py-8">
          <h1 className="text-xl">Product not found</h1>
        </div>
        <Footer footerLinks={footerLinks} />
      </div>
    );
  }

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Mock text for EMI
  const emiStart = Math.round(product.price / 24);

  // Offers (fallback if not in DB)
  const offers = product.offers || [
    { type: "Bank Offer", description: "Upto ₹4,000.00 discount on select Credit Cards", link: "4 offers >" },
    { type: "No Cost EMI", description: "Avail No Cost EMI on select cards for orders above ₹3000", link: "1 offer >" },
    { type: "Partner Offer", description: "Get GST invoice and save up to 28% on business purchases.", link: "1 offer >" }
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="product-page">
      <Header searchCategories={searchCategories} />

      {/* Breadcrumb - Keeping style simple but functional */}
      <div className="bg-[#fafafa] border-b border-[#ddd]">
        <div className="max-w-[1500px] mx-auto px-4 py-1 text-[12px] text-[#565959] leading-[26px]">
          <nav className="flex items-center gap-1">
            <Link to="/" className="hover:text-[#c7511f] hover:underline">Home</Link>
            <span>›</span>
            <Link to={`/category/${product.category}`} className="hover:text-[#c7511f] hover:underline capitalize">{product.category}</Link>
            <span>›</span>
            <span className="text-[#333] line-clamp-1">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">


          {/* Left: Sticky Image Gallery (Col 5 - ~40%) */}
          <div className="lg:col-span-5">
            <div className="flex gap-4">
              <div className="hidden sm:flex flex-col gap-3 pt-1">
                {[product.image, product.image, product.image, product.image].map((img, i) => (
                  <button
                    key={i}
                    className={`w-[40px] h-[52px] border rounded-[2px] overflow-hidden hover:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] ${selectedImage === i ? 'shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] border-[#e77600]' : 'border-[#a2a6ac]'}`}
                    onMouseEnter={() => setSelectedImage(i)}
                  >
                    <img src={img} className="w-full h-full object-contain p-[2px]" alt="" />
                  </button>
                ))}
              </div>
              <div className="flex-1">
                <div className="w-full relative pt-[120%]"> {/* Adjusted aspect ratio */}
                  <img src={[product.image, product.image, product.image, product.image][selectedImage]} alt={product.title} className="absolute top-0 left-0 w-full h-full object-contain" />
                  <button className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full">
                    <img src="https://m.media-amazon.com/images/G/31/marketing/fba/fba-badge_18px-2x._CB485942108_.png" className="w-[18px] opacity-0" alt="" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Product Details (Col 4 - ~35%) */}
          <div className="lg:col-span-4 lg:px-4">
            <div className="border-b border-[#e7e7e7] pb-4 mb-4">
              <h1 className="text-[24px] leading-[32px] font-normal text-[#0f1111] mb-1"> {/* Fixed font size/weight */}
                {product.title}
              </h1>
              <div className="text-[14px] text-[#007185] font-medium hover:text-[#c7511f] hover:underline cursor-pointer mb-2">
                Visit the {product.brand || 'Apple'} Store
              </div>
              <div className="flex items-center gap-4 text-[13px]">
                <div className="flex items-center gap-1 group cursor-pointer">
                  <div className="flex text-[#F7941D]">{renderStars(product.rating)}</div>
                  <span className="text-[#007185] group-hover:text-[#c7511f] group-hover:underline ml-1 font-medium">{product.reviewCount} ratings</span>
                </div>
                <div className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer"> | Search this page</div>
              </div>
              <div className="mt-2 text-[13px] text-[#565959]">
                500+ bought in past month
              </div>
            </div>

            {/* Price Block */}
            <div className="mb-4">
              {discount > 0 && (
                <div className="inline-block bg-[#CC0C39] text-white text-[12px] font-bold px-2 py-1 rounded-[2px] mb-3 transform skew-x-[-10deg]">
                  <span className="transform skew-x-[10deg] inline-block">{discount}% off</span>
                </div>
              )}
              <div className="flex items-start leading-none mb-1">
                <span className="text-[14px] leading-[14px] text-[#0F1111] relative top-[4px] mr-[2px]">₹</span>
                <span className="text-[28px] leading-[28px] font-medium text-[#0F1111]">{formatNumber(product.price.toFixed(0))}</span>
              </div>
              {product.originalPrice > product.price && (
                <div className="text-[12px] text-[#565959] mb-2 leading-[16px]">
                  M.R.P.: <span className="line-through">₹{formatNumber(product.originalPrice.toFixed(0))}</span>
                </div>
              )}
              <div className="text-[14px] font-medium text-[#0F1111] mb-1">Inclusive of all taxes</div>
              <div className="text-[14px] text-[#0F1111]">
                <span className="font-bold">EMI</span> starts at ₹{formatNumber(emiStart)}. No Cost EMI available <span className="text-[#007185] cursor-pointer hover:text-[#c7511f] hover:underline group">EMI options <ChevronRight className="w-3 h-3 inline group-hover:text-[#c7511f]" /></span>
              </div>
            </div>

            {/* Offers Carousel */}
            <div className="mb-4 border-t border-[#e7e7e7] pt-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-2 font-bold text-[14px] text-[#0f1111]">
                  <img src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-offers._CB485960012_.png" className="w-[18px]" alt="" />
                  Offers
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {offers.map((offer, idx) => (
                  <div key={idx} className="min-w-[150px] max-w-[150px] border border-[#d5d9d9] rounded-[8px] p-3 shadow-sm flex flex-col justify-between hover:bg-[#fdfdfd] cursor-pointer h-[130px] bg-white">
                    <div>
                      <div className="font-bold text-[12px] text-[#0f1111] mb-1 line-clamp-1">{offer.type}</div>
                      <div className="text-[12px] text-[#0F1111] line-clamp-3 leading-[16px]">{offer.description}</div>
                    </div>
                    <div className="text-[12px] text-[#007185] font-bold mt-1 hover:underline decoration-[#007185] cursor-pointer">{offer.link}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Icons Row */}
            <div className="grid grid-cols-4 gap-2 mb-4 border-t border-[#e7e7e7] pt-4">
              {[
                { img: "https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-returns._CB484059092_.png", text: "10 days Returnable" },
                { img: "https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-amazon-delivered._CB485933725_.png", text: "Free Delivery" },
                { img: "https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-warranty._CB485935626_.png", text: "1 Year Warranty" },
                { img: "https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-cod._CB485937110_.png", text: "Pay on Delivery" }
              ].map((service, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group cursor-pointer gap-2">
                  <div className="w-[35px] h-[35px] flex items-center justify-center">
                    <img src={service.img} className="w-full h-full object-contain" alt="" />
                  </div>
                  <div className="text-[12px] text-[#007185] leading-[16px] group-hover:text-[#c7511f] group-hover:underline font-medium">
                    {service.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Specs Table */}
            {product.specs && (
              <div className="mb-4">
                <div className="grid grid-cols-[auto_1fr] gap-y-2 gap-x-8 text-[14px]">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="contents leading-[20px]">
                      <span className="font-bold text-[#0F1111] whitespace-nowrap">{key}</span>
                      <span className="text-[#0F1111]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About Item */}
            <div className="border-t border-[#e7e7e7] pt-4">
              <h3 className="text-[16px] font-bold text-[#0f1111] mb-2">About this item</h3>
              <ul className="list-disc pl-5 space-y-1">
                {(product.about || []).map((item, i) => {
                  const parts = item.split('—');
                  const title = parts.length > 1 ? parts[0] + '—' : '';
                  const desc = parts.length > 1 ? parts.slice(1).join('—') : item;

                  return (
                    <li key={i} className="text-[14px] text-[#0f1111] leading-[20px] marker:text-[#0f1111]">
                      {title ? <span className="font-bold">{title}</span> : null}
                      {desc}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Right: Buy Box (Col 3 - ~25%) */}
          <div className="lg:col-span-3">
            <div className="border border-[#d5d9d9] rounded-[8px] p-[18px] relative">

              {/* Exchange Box */}
              <div className="mb-4">
                <label className="flex items-start gap-3 p-3 border border-[#e77600] bg-[#fffcf5] rounded-t-[4px] cursor-pointer relative z-10">
                  <div className="pt-[2px]">
                    <div className="w-[18px] h-[18px] rounded-full border-[5px] border-[#e77600] bg-white flex items-center justify-center">
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-[14px] text-[#0f1111]">Without Exchange</div>
                    <div className="text-[14px] text-[#cc0c39] font-medium">₹{formatNumber(product.price.toFixed(0))}</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 border-x border-b border-[#d5d9d9] rounded-b-[4px] cursor-pointer bg-white group hover:bg-[#f7fafa]">
                  <div className="pt-[2px]">
                    <div className="w-[18px] h-[18px] rounded-full border border-[#888c8c] bg-white group-hover:border-[#e77600]"></div>
                  </div>
                  <div>
                    <div className="font-bold text-[14px] text-[#0f1111]">With Exchange</div>
                    <div className="text-[12px] text-[#cc0c39]">Up to ₹41,100.00 off</div>
                  </div>
                </label>
              </div>

              {/* Delivery Info */}
              <div className="text-[14px] mb-2 text-[#007185] hover:text-[#c7511f] cursor-pointer leading-[20px]">
                FREE delivery <span className="font-bold text-[#0f1111]">Monday, 9 February</span>
              </div>
              <div className="text-[14px] mb-4 leading-[20px]">
                <MapPin className="w-3 h-3 inline mr-1 text-[#0f1111]" />
                <span className="text-[#007185] hover:text-[#c7511f] cursor-pointer">Delivering to Bengaluru 560068 - Update location</span>
              </div>

              <div className="text-[18px] text-[#007600] font-medium mb-4">
                {product.inStock ? 'In Stock' : 'Currently Unavailable'}
              </div>

              {/* Ships/Sold By */}
              <div className="text-[12px] text-[#565959] space-y-1 mb-4">
                <div className="grid grid-cols-[80px_1fr]">
                  <span className="text-[#565959]">Ships from</span>
                  <span className="text-[#0f1111]">Amazon</span>
                </div>
                <div className="grid grid-cols-[80px_1fr]">
                  <span className="text-[#565959]">Sold by</span>
                  <span className="text-[#007185] hover:text-[#c7511f] cursor-pointer hover:underline cursor-pointer">Appario Retail Private Ltd</span>
                </div>
                <div className="grid grid-cols-[80px_1fr]">
                  <span className="text-[#565959]">Payment</span>
                  <span className="text-[#007185] hover:text-[#c7511f] cursor-pointer hover:underline cursor-pointer">Secure transaction</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-[#0f1111]">Quantity: </span>
                  <select
                    className="bg-[#f0f2f2] border border-[#d5d9d9] rounded-[8px] px-2 py-1 text-[13px] shadow-[0_2px_5px_rgba(15,17,17,0.15)] focus:ring-[#e77600] focus:border-[#e77600] cursor-pointer hover:bg-[#e3e6e6] min-w-[60px]"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-[#ffd814] hover:bg-[#f7ca00] rounded-full py-[8px] text-[13px] text-[#0f1111] shadow-sm cursor-pointer font-medium"
                >
                  {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                </button>
                <button className="w-full bg-[#ffa41c] hover:bg-[#fa8900] rounded-full py-[8px] text-[13px] text-[#0f1111] shadow-sm cursor-pointer font-medium">
                  Buy Now
                </button>
              </div>

              <div className="flex items-start gap-2 mb-4 pt-2 border-t border-[#e7e7e7]">
                <input type="checkbox" className="mt-1 rounded border-gray-300 w-4 h-4 cursor-pointer" />
                <div>
                  <div className="text-[14px] font-medium text-[#0f1111]">Add a Protection Plan:</div>
                  <div className="text-[14px] leading-[20px]">
                    <span className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">1 Year Protect+ with AppleCare Service</span> for <span className="text-[#B12704] font-medium">₹16,999.00</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 w-4 h-4 cursor-pointer" />
                <span className="text-[14px] text-[#0f1111]">Add gift options</span>
              </div>
            </div>

            <button className="w-full mt-4 border border-[#d5d9d9] bg-white hover:bg-[#f7fafa] rounded-[8px] py-[6px] text-[13px] text-[#0f1111] shadow-sm cursor-pointer text-left px-4">
              Add to Wish List
            </button>
          </div>

        </div>
      </div>



      <Footer footerLinks={footerLinks} />
    </div>
  );
};

export default ProductPage;
