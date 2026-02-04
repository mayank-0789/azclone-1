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

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [heroSlides, setHeroSlides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [gridCards, setGridCards] = useState([]);
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
        gridCardsRes,
        searchCatRes,
        footerRes
      ] = await Promise.all([
        axios.get(`${API}/hero-slides`),
        axios.get(`${API}/categories`),
        axios.get(`${API}/products`),
        axios.get(`${API}/deals`),
        axios.get(`${API}/grid-cards`),
        axios.get(`${API}/search-categories`),
        axios.get(`${API}/footer-links`)
      ]);

      setHeroSlides(heroRes.data);
      setCategories(categoriesRes.data);
      setProducts(productsRes.data);
      setDeals(dealsRes.data);
      setGridCards(gridCardsRes.data);
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
  const electronicsProducts = products.filter(p => p.category === 'electronics');

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
            {gridCards.slice(0, 4).map((card, index) => (
              <HomeGridCard key={card.id || index} {...card} linkText={card.link_text} linkUrl={card.link_url} />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 pb-8">
        <div className="max-w-[1500px] mx-auto space-y-5">
          {/* Second Row of Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {gridCards.slice(4, 8).map((card, index) => (
              <HomeGridCard key={card.id || index} {...card} linkText={card.link_text} linkUrl={card.link_url} />
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
