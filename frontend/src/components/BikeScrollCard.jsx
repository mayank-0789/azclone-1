import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BikeScrollCard = () => {
    const scrollContainerRef = useRef(null);

    // Generate array of image paths from 1.jpg to 10.jpg
    const images = Array.from({ length: 10 }, (_, i) => `/${i + 1}.jpg`);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300; // Adjust scroll distance as needed
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="bg-white p-5 rounded-sm relative group">
            <div className="flex items-baseline gap-2 mb-4">
                <h3 className="text-xl font-bold text-[#0f1111]">
                    Starting ₹70,348 | From daily commutes to weekend thrills
                </h3>
                <Link to="/bikes" className="text-[13px] text-[#007185] hover:text-[#c7511f] hover:underline">
                    See all offers
                </Link>
            </div>

            <div className="relative">
                {/* Left Button */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-24 bg-white/90 shadow-lg rounded-r flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 cursor-pointer"
                >
                    <ChevronLeft className="w-8 h-8 text-gray-700" />
                </button>

                {/* Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-hidden gap-0 scroll-smooth w-full"
                >
                    {images.map((img, index) => (
                        <div key={index} className="flex-shrink-0">
                            <img
                                src={img}
                                alt={`Bike offer ${index + 1}`}
                                className="h-[275px] w-auto object-contain cursor-pointer"
                                onError={(e) => {
                                    e.target.style.display = 'none'; // Hide broken images
                                    console.warn(`Image not found: ${img}`);
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Right Button */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-24 bg-white/90 shadow-lg rounded-l flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 cursor-pointer"
                >
                    <ChevronRight className="w-8 h-8 text-gray-700" />
                </button>
            </div>
        </div>
    );
};

export default BikeScrollCard;
