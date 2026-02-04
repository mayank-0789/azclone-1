import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductCarousel = ({ title, products, onAddToCart, seeMoreLink }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white p-5 rounded-sm" data-testid="product-carousel">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#0f1111]">{title}</h2>
        {seeMoreLink && (
          <a 
            href={seeMoreLink}
            className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline"
          >
            See more
          </a>
        )}
      </div>

      {/* Carousel */}
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-24 bg-white/90 shadow-lg rounded-r flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
          data-testid="carousel-scroll-left"
        >
          <ChevronLeft className="w-8 h-8 text-gray-700" />
        </button>

        {/* Products */}
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[200px] max-w-[200px]">
              <ProductCard 
                product={product} 
                onAddToCart={onAddToCart}
                showAddToCart={false}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-24 bg-white/90 shadow-lg rounded-l flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
          data-testid="carousel-scroll-right"
        >
          <ChevronRight className="w-8 h-8 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default ProductCarousel;
