import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  const { id, name, image, link } = category;

  return (
    <div 
      className="bg-white p-5 rounded-sm hover:shadow-lg transition-shadow"
      data-testid={`category-card-${id}`}
    >
      <h3 className="text-xl font-bold text-[#0f1111] mb-3">{name}</h3>
      <Link to={link} className="block">
        <div className="aspect-square overflow-hidden mb-3 rounded-sm">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            data-testid={`category-image-${id}`}
          />
        </div>
        <span className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline">
          Shop now
        </span>
      </Link>
    </div>
  );
};

export default CategoryCard;
