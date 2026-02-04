import React from 'react';
import { Link } from 'react-router-dom';
import { Star, StarHalf, Heart, BarChart3 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';

const ProductCard = ({ product, showAddToCart = true, onAddToCart }) => {
  const {
    id,
    title,
    price,
    originalPrice,
    rating,
    reviewCount,
    image,
    isPrime
  } = product;

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare, compareCount, maxItems } = useCompare();

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-4 h-4 fill-[#de7921] text-[#de7921]" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="w-4 h-4 fill-[#de7921] text-[#de7921]" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K+';
    }
    return num.toString();
  };

  const discount = originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const inWishlist = isInWishlist(id);
  const inCompare = isInCompare(id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleCompare(product);
    if (!result.success && result.message) {
      alert(result.message);
    }
  };

  return (
    <div
      className="bg-white rounded-sm p-4 hover:shadow-lg transition-shadow group relative"
      data-testid={`product-card-${id}`}
    >


      {/* Product Image */}
      <Link to={`/product/${id}`} className="block">
        <div className="relative aspect-square mb-3 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            data-testid={`product-image-${id}`}
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-1">
        {/* Title */}
        <Link to={`/product/${id}`}>
          <h3
            className="text-[14px] font-medium text-[#007185] line-clamp-3 hover:text-[#c7511f] hover:underline cursor-pointer leading-[1.3] mb-1"
            data-testid={`product-title-${id}`}
          >
            {title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex" data-testid={`product-rating-${id}`}>
            {renderStars(rating)}
          </div>
          <Link
            to={`/product/${id}#reviews`}
            className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline"
          >
            {formatNumber(reviewCount)}
          </Link>
        </div>

        {/* Price */}
        <div className="pt-1">
          {discount > 0 && (
            <div className="flex items-center gap-2 mb-1">
              <span
                className="bg-[#CC0C39] text-white text-[12px] font-bold px-1.5 py-0.5 rounded-[2px]"
                data-testid={`product-discount-${id}`}
              >
                {discount}% off
              </span>
              <span className="text-[12px] font-bold text-[#CC0C39]">Limited time deal</span>
            </div>
          )}
          <div className="flex items-baseline mb-[2px]">
            <span className="text-[10px] text-[#0f1111] font-normal relative -top-1.5 mr-[1px]">₹</span>
            <span
              className="text-[28px] font-medium text-[#0f1111] leading-none"
              data-testid={`product-price-${id}`}
            >
              {price.toLocaleString('en-IN').split('.')[0]}
            </span>
            <span className="text-[12px] text-[#0f1111] font-normal relative -top-1.5 tracking-tight">00</span>
          </div>
          {originalPrice > price && (
            <div className="text-[12px] text-[#565959] leading-tight mb-2">
              M.R.P: <span className="line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>

        {/* Delivery Info */}
        <div className="text-[12px] text-[#0f1111] leading-tight mb-1">
          Get it by <span className="font-bold">Friday, February 6</span>
        </div>
        <div className="text-[12px] text-[#565959] leading-tight mb-2">
          FREE Delivery by Amazon
        </div>

        {/* Stock Warning (Simulation for iPhone) */}
        {title.includes("iPhone") && (
          <div className="text-[12px] text-[#b12704] font-medium mb-1">
            Only 1 left in stock.
          </div>
        )}

        {/* Prime Badge */}
        {isPrime && !title.includes("iPhone") && (
          <div className="flex items-center gap-[6px] mt-1" data-testid={`product-prime-${id}`}>
            {/* Prime logo usually appears with delivery info, but sticking to previous placement for non-iPhone items if needed, mostly redundant with text above */}
            <div className="flex items-center">
              <span className="text-[#00A8E1] font-bold text-[13px] italic leading-none" style={{ fontFamily: 'sans-serif' }}>prime</span>
              <span className="text-[#565959] text-[13px] ml-1">FREE delivery</span>
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        {showAddToCart && (
          <button
            onClick={() => onAddToCart && onAddToCart(product)}
            className="w-full mt-3 py-1.5 px-4 bg-[#ffd814] hover:bg-[#f7ca00] rounded-full text-sm font-medium text-[#0f1111] transition-colors"
            data-testid={`add-to-cart-${id}`}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
