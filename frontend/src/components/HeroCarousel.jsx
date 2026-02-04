import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroCarousel = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isAutoPlaying && slides.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (!slides || slides.length === 0) return null;

  return (
    <div 
      className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden"
      data-testid="hero-carousel"
    >
      {/* Slides */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div 
            key={slide.id} 
            className="min-w-full h-full relative"
            style={{ backgroundColor: slide.backgroundColor }}
          >
            <Link to={slide.link} className="block w-full h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-top"
                data-testid={`hero-slide-${slide.id}`}
              />
            </Link>
          </div>
        ))}
      </div>

      {/* Gradient overlay at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #e3e6e6 0%, transparent 100%)'
        }}
      />

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-0 h-[60%] px-3 flex items-center justify-center bg-transparent hover:bg-black/5 transition-colors group"
        data-testid="carousel-prev"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-10 h-10 text-gray-700 group-hover:text-gray-900" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-0 h-[60%] px-3 flex items-center justify-center bg-transparent hover:bg-black/5 transition-colors group"
        data-testid="carousel-next"
        aria-label="Next slide"
      >
        <ChevronRight className="w-10 h-10 text-gray-700 group-hover:text-gray-900" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-[#232f3e] w-6' 
                : 'bg-gray-400 hover:bg-gray-500'
            }`}
            data-testid={`carousel-dot-${index}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
