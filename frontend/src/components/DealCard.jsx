import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const DealCard = ({ deal, onAddToCart }) => {
  const { id, title, product, endsAt, claimed } = deal;
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(endsAt) - new Date();
    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

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

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K+';
    }
    return num.toString();
  };

  return (
    <div 
      className="bg-white p-4 rounded-sm hover:shadow-lg transition-shadow min-w-[280px]"
      data-testid={`deal-card-${id}`}
    >
      {/* Deal Badge */}
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-[#cc0c39] text-white text-xs font-bold px-2 py-1 rounded-sm">
          {product.discount}% off
        </span>
        <span className="text-sm text-[#cc0c39] font-medium">{title}</span>
      </div>

      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden mb-3 rounded-sm">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            data-testid={`deal-image-${id}`}
          />
        </div>
      </Link>

      {/* Price */}
      <div className="mb-2">
        <div className="flex items-baseline gap-1">
          <span className="text-xs text-[#0f1111]">$</span>
          <span className="text-2xl font-medium text-[#0f1111]">
            {product.price.toFixed(2).split('.')[0]}
          </span>
          <span className="text-xs text-[#0f1111]">
            {product.price.toFixed(2).split('.')[1]}
          </span>
          <span className="text-sm text-[#565959] line-through ml-2">
            ${product.originalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Product Title */}
      <Link to={`/product/${product.id}`}>
        <h3 
          className="text-sm text-[#0f1111] line-clamp-2 hover:text-[#c7511f] cursor-pointer mb-2"
          data-testid={`deal-title-${id}`}
        >
          {product.title}
        </h3>
      </Link>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-3">
        <div className="flex">
          {renderStars(product.rating)}
        </div>
        <span className="text-sm text-[#007185]">
          {formatNumber(product.reviewCount)}
        </span>
      </div>

      {/* Claimed Progress Bar */}
      {claimed && (
        <div className="mb-3">
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden relative">
            <div 
              className="h-full rounded-full"
              style={{
                width: `${claimed}%`,
                background: 'linear-gradient(to right, #ff6633, #cc0c39)'
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white drop-shadow">
              {claimed}% claimed
            </span>
          </div>
        </div>
      )}

      {/* Countdown Timer */}
      <div className="flex items-center gap-1 text-sm text-[#565959] mb-3">
        <span>Ends in:</span>
        <span 
          className="font-mono bg-[#0f1111] text-white px-1.5 py-0.5 rounded"
          data-testid={`deal-timer-${id}`}
        >
          {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={() => onAddToCart && onAddToCart({ ...product, dealId: id })}
        className="w-full py-2 px-4 bg-[#ffd814] hover:bg-[#f7ca00] rounded-full text-sm font-medium text-[#0f1111] transition-colors"
        data-testid={`deal-add-to-cart-${id}`}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default DealCard;
