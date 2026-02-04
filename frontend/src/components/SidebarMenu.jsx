import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronDown, User } from 'lucide-react';

const MENU_SECTIONS = [
    {
        title: 'Trending',
        items: [
            { label: 'Bestsellers' },
            { label: 'New Releases' },
            { label: 'Movers and Shakers' },
        ],
    },
    {
        title: 'Digital Content and Devices',
        items: [
            { label: 'Echo & Alexa', hasArrow: true },
            { label: 'Fire TV', hasArrow: true },
            { label: 'Kindle E-Readers & eBooks', hasArrow: true },
            { label: 'Audible Audiobooks', hasArrow: true },
            { label: 'Amazon Prime Video', hasArrow: true },
            { label: 'Amazon Prime Music', hasArrow: true },
        ],
    },
    {
        title: 'Shop by Category',
        items: [
            { label: 'Mobiles, Computers', hasArrow: true },
            { label: 'TV, Appliances, Electronics', hasArrow: true },
            { label: "Men's Fashion", hasArrow: true },
            { label: "Women's Fashion", hasArrow: true },
        ],
        expandable: true,
    },
];

const SidebarMenu = ({ isOpen, onClose }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // Small delay to allow DOM to update before animation
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsAnimating(true);
                });
            });
        } else {
            setIsAnimating(false);
            // Wait for animation to complete before unmounting
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black z-[100] transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-[365px] max-w-[85vw] bg-white z-[101] overflow-y-auto transform transition-transform duration-300 ease-out ${isAnimating ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="bg-[#232f3e] text-white px-6 py-3 flex items-center gap-3 sticky top-0 z-10">
                    <div className="w-8 h-8 bg-[#232f3e] rounded-full flex items-center justify-center">
                        <User className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-bold">Hello, sign in</span>
                </div>

                {/* Menu Sections */}
                <div className="pb-8">
                    {MENU_SECTIONS.map((section, sectionIdx) => (
                        <div key={sectionIdx}>
                            {/* Section Title */}
                            <div className="px-6 py-3 bg-white">
                                <h3 className="text-[17px] font-bold text-[#111]">{section.title}</h3>
                            </div>

                            {/* Section Items */}
                            <ul>
                                {section.items.map((item, itemIdx) => (
                                    <li key={itemIdx}>
                                        <div className="flex items-center justify-between px-6 py-3 hover:bg-[#eaeded] text-[14px] text-[#111] cursor-default">
                                            <span>{item.label}</span>
                                            {item.hasArrow && <ChevronRight className="w-5 h-5 text-[#6f7373]" />}
                                        </div>
                                    </li>
                                ))}
                                {section.expandable && (
                                    <li>
                                        <div className="flex items-center gap-2 px-6 py-3 text-[14px] text-[#111] hover:bg-[#eaeded] cursor-default">
                                            <span>See all</span>
                                            <ChevronDown className="w-4 h-4 text-[#6f7373]" />
                                        </div>
                                    </li>
                                )}
                            </ul>

                            {/* Divider */}
                            {sectionIdx < MENU_SECTIONS.length - 1 && (
                                <div className="border-b border-[#d5dbdb] my-2" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Close Button - Positioned outside sidebar */}
            <button
                onClick={onClose}
                className={`fixed top-3 z-[102] text-white hover:text-gray-300 transition-all duration-300 ${isAnimating ? 'left-[375px] max-[85vw]:left-[calc(85vw+10px)] opacity-100' : 'left-[315px] opacity-0'
                    }`}
                style={{ left: isAnimating ? 'min(375px, calc(85vw + 10px))' : '315px' }}
            >
                <X className="w-8 h-8" strokeWidth={1.5} />
            </button>
        </>
    );
};

export default SidebarMenu;
