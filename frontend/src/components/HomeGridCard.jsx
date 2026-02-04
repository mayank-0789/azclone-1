import React from 'react';
import { Link } from 'react-router-dom';

const HomeGridCard = ({ title, linkText = "See more", linkUrl = "/", image, items }) => {
    return (
        <div className="bg-white px-5 pt-5 pb-4 rounded-sm h-full flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
                <h3 className="text-[21px] font-bold text-[#0f1111] mb-2.5 leading-[27.3px] line-clamp-2 min-h-[3.5rem] tracking-tight">{title}</h3>

                {items ? (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-6 mb-8">
                        {items.map((item, index) => (
                            <Link key={index} to={item.link || linkUrl} className="block group">
                                <div className="aspect-square overflow-hidden mb-1 rounded-sm">
                                    <img
                                        src={item.image}
                                        alt={item.label || "grid-item"}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                {item.label && (
                                    <div className="text-[12px] leading-[16px] text-[#0f1111] line-clamp-1 h-4">{item.label}</div>
                                )}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <Link to={linkUrl} className="block mb-3 h-[275px]">
                        <div className="h-full overflow-hidden rounded-sm">
                            <img
                                src={image}
                                alt={title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    </Link>
                )}
            </div>

            <span className="block text-[13px] text-gray-400 cursor-not-allowed font-medium">
                {linkText}
            </span>
        </div>
    );
};

export default HomeGridCard;
