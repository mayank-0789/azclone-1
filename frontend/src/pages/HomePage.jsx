import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import HeroCarousel from '../components/HeroCarousel';
import HomeGridCard from '../components/HomeGridCard'; // Updated import
import ProductCarousel from '../components/ProductCarousel';
import DealsCarousel from '../components/DealsCarousel';
import BikeScrollCard from '../components/BikeScrollCard';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const GRID_CARDS = [
  // ROW 1
  {
    title: "Continue shopping deals",
    linkText: "See more deals",
    items: [
      { image: "/zebronic.jpg" },
      { image: "/lap.jpg" },
      { image: "/never.jpg" },
      { image: "/usbc.jpg" }
    ]
  },
  {
    title: "Bulk order discounts + Up to 18% GST savings",
    linkText: "Create a free account",
    items: [
      { label: "Up to 45% off | Laptops", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop" },
      { label: "Up to 60% off | Kitchen", image: "/appliance.jpg" },
      { label: "Min. 50% off | Office", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=300&h=300&fit=crop" },
      { label: "Up to 60% off | Business", image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=300&h=300&fit=crop" }
    ]
  },
  {
    title: "Revamp your home in style",
    linkText: "Explore all",
    items: [
      { label: "Cushion covers, bedsheets", image: "/cushion.jpg" },
      { label: "Figurines, vases & more", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop" },
      { label: "Home storage", image: "/homestorage.jpg" },
      { label: "Lighting solutions", image: "/lighting.jpg" }
    ]
  },
  {
    title: "Appliances for your home | Up to 55% off",
    linkText: "See more",
    items: [
      { label: "Air conditioners", image: "/airconditioner.jpg" },
      { label: "Refrigerators", image: "/refrigeration.jpg" },
      { label: "Microwaves", image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=300&fit=crop" },
      { label: "Washing machines", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&h=300&fit=crop" }
    ]
  },
  // ROW 2
  {
    title: "Starting ₹49 | Deals on home essentials",
    linkText: "Explore all",
    items: [
      { label: "Cleaning supplies", image: "/cleaning.jpg" },
      { label: "Bathroom accessories", image: "/bathroom.jpg" },
      { label: "Home tools", image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300&h=300&fit=crop" },
      { label: "Wallpapers", image: "/wallpaperhome.jpg" }
    ]
  },
  {
    title: "Starting ₹149 | Headphones",
    linkText: "See all offers",
    items: [
      { label: "Starting ₹249 | boAt", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&h=300&fit=crop" },
      { label: "Starting ₹349 | boult", image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=300&h=300&fit=crop" },
      { label: "Starting ₹649 | Noise", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop" },
      { label: "Starting ₹149 | Zebronics", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&h=300&fit=crop" }
    ]
  },
  {
    title: "Starting ₹199 | Amazon Brands & more",
    linkText: "See more",
    items: [
      { label: "Starting ₹199 | Bedsheets", image: "/bedsheet.jpg" },
      { label: "Starting ₹199 | Curtains", image: "/curtain.jpg" },
      { label: "Min 40% off | Ironing", image: "/ironing.jpg" },
      { label: "Up to 60% off | Decor", image: "/deer.jpg" }
    ]
  },
  {
    title: "Automotive essentials | Up to 60% off",
    linkText: "See more",
    items: [
      { label: "Cleaning accessories", image: "https://images.unsplash.com/photo-1552930294-6b595f4c2974?w=300&h=300&fit=crop" },
      { label: "Tyre & rim care", image: "/tyrerim.jpg" },
      { label: "Helmets", image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=300&h=300&fit=crop" },
      { label: "Vacuum cleaner", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300&h=300&fit=crop" }
    ]
  }
];

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [heroSlides, setHeroSlides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [searchCategories, setSearchCategories] = useState([]);
  const [footerLinks, setFooterLinks] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [
        heroRes,
        categoriesRes,
        productsRes,
        dealsRes,
        searchCatRes,
        footerRes
      ] = await Promise.all([
        axios.get(`${API}/hero-slides`),
        axios.get(`${API}/categories`),
        axios.get(`${API}/products`),
        axios.get(`${API}/deals`),
        axios.get(`${API}/search-categories`),
        axios.get(`${API}/footer-links`)
      ]);

      setHeroSlides(heroRes.data);
      setCategories(categoriesRes.data);
      setProducts(productsRes.data);
      setDeals(dealsRes.data);
      setSearchCategories(searchCatRes.data);
      setFooterLinks(footerRes.data);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e3e6e6]">
        <Header searchCategories={[]} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#febd69] border-t-transparent"></div>
        </div>
      </div>
    );
  }

  // Get recommended products (different from main products)
  const recommendedProducts = [...products].reverse().slice(0, 8);
  const electronicsProducts = products.filter(p => p.category === 'electronics');
  const homeProducts = products.filter(p => p.category === 'home-kitchen');

  return (
    <div className="min-h-screen bg-[#e3e6e6]" data-testid="home-page">
      <Header searchCategories={searchCategories} />

      {/* Hero Section */}
      <div className="relative z-0">
        <HeroCarousel slides={heroSlides} />
      </div>

      {/* Category Cards Grid - Pulled up with negative margin to overlap Hero */}
      <div className="relative z-10 px-4 -mt-20 sm:-mt-32 md:-mt-48 lg:-mt-72 mb-8">
        <div className="max-w-[1500px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {GRID_CARDS.slice(0, 4).map((card, index) => (
              <HomeGridCard key={index} {...card} />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 pb-8">
        <div className="max-w-[1500px] mx-auto space-y-5">
          {/* Second Row of Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {GRID_CARDS.slice(4, 8).map((card, index) => (
              <HomeGridCard key={index} {...card} />
            ))}
          </div>



          {/* Deals Section */}
          <BikeScrollCard />

          {/* Best Sellers */}
          <ProductCarousel
            title="Best Sellers in Electronics"
            products={electronicsProducts}
            onAddToCart={handleAddToCart}
            seeMoreLink="/category/electronics"
          />




        </div>
      </main>

      <Footer footerLinks={footerLinks} />
    </div>
  );
};

export default HomePage;
