import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ChevronUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer data-testid="footer" className="font-sans">
      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#37475a] hover:bg-[#485769] py-[15px] text-white text-[13px] font-medium transition-colors"
        data-testid="back-to-top"
      >
        Back to top
      </button>

      {/* Main Footer Links */}
      <div className="bg-[#232f3e] py-[40px] border-b border-[#3a4553]">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 px-4">
          {/* Get to Know Us */}
          <div>
            <h4 className="text-white font-bold text-[16px] mb-[14px]">Get to Know Us</h4>
            <ul className="space-y-[10px]">
              {['About Us', 'Careers', 'Press Releases', 'Amazon Science'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-[#dddddd] hover:underline text-[14px] leading-normal font-normal block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect with Us */}
          <div>
            <h4 className="text-white font-bold text-[16px] mb-[14px]">Connect with Us</h4>
            <ul className="space-y-[10px]">
              {['Facebook', 'Twitter', 'Instagram'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-[#dddddd] hover:underline text-[14px] leading-normal font-normal block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Make Money with Us */}
          <div>
            <h4 className="text-white font-bold text-[16px] mb-[14px]">Make Money with Us</h4>
            <ul className="space-y-[10px]">
              {[
                'Sell on Amazon',
                'Sell under Amazon Accelerator',
                'Protect and Build Your Brand',
                'Amazon Global Selling',
                'Become an Affiliate',
                'Fulfilment by Amazon',
                'Advertise Your Products',
                'Amazon Pay on Merchants'
              ].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-[#dddddd] hover:underline text-[14px] leading-normal font-normal block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Let Us Help You */}
          <div>
            <h4 className="text-white font-bold text-[16px] mb-[14px]">Let Us Help You</h4>
            <ul className="space-y-[10px]">
              {[
                'COVID-19 and Amazon',
                'Your Account',
                'Returns Centre',
                '100% Purchase Protection',
                'Amazon App Download',
                'Help'
              ].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-[#dddddd] hover:underline text-[14px] leading-normal font-normal block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Middle Footer - Logo & Locale */}
      <div className="bg-[#232f3e] py-[25px]">
        <div className="max-w-[1000px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-[60px] px-4">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/amazon_logo.png" alt="Amazon" className="h-[24px] object-contain" />
            <span className="text-white text-xs -mt-2 ml-0.5">.in</span>
          </Link>

          {/* Settings Borders */}
          <div className="flex flex-wrap items-center justify-center gap-2">

            {/* Language */}
            <button className="flex items-center gap-2 px-2.5 py-1.5 border border-[#848688] rounded-[2px] text-[#cccccc] hover:text-white text-[13px] leading-4">
              <Globe className="w-3.5 h-3.5" />
              <span>English</span>
              <span className="text-[#848688] text-[8px] ml-1">▼</span>
            </button>
          </div>
        </div>

        {/* Country List */}
        <div className="max-w-[1000px] mx-auto mt-6 text-center">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[12px] text-[#dddddd]">
            <span className="hover:underline cursor-pointer">Australia</span>
            <span className="hover:underline cursor-pointer">Brazil</span>
            <span className="hover:underline cursor-pointer">Canada</span>
            <span className="hover:underline cursor-pointer">China</span>
            <span className="hover:underline cursor-pointer">France</span>
            <span className="hover:underline cursor-pointer">Germany</span>
            <span className="hover:underline cursor-pointer">Italy</span>
            <span className="hover:underline cursor-pointer">Japan</span>
            <span className="hover:underline cursor-pointer">Mexico</span>
            <span className="hover:underline cursor-pointer">Netherlands</span>
            <span className="hover:underline cursor-pointer">Poland</span>
            <span className="hover:underline cursor-pointer">Singapore</span>
            <span className="hover:underline cursor-pointer">Spain</span>
            <span className="hover:underline cursor-pointer">Turkey</span>
            <span className="hover:underline cursor-pointer">United Arab Emirates</span>
            <span className="hover:underline cursor-pointer">United Kingdom</span>
            <span className="hover:underline cursor-pointer">United States</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer - Black Section */}
      <div className="bg-[#131a22] py-[25px] px-4">
        <div className="max-w-[1000px] mx-auto">
          {/* Amazon Services Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-5 text-[12px] text-[#999999] mb-8 place-content-center">
            {[
              { title: 'AbeBooks', desc: 'Books, art\n& collectibles' },
              { title: 'Amazon Web Services', desc: 'Scalable Cloud\nComputing Services' },
              { title: 'Audible', desc: 'Download Audio Books' },
              { title: 'IMDb', desc: 'Movies, TV\n& Celebrities' },
              { title: 'Shopbop', desc: 'Designer\nFashion Brands' },
              { title: 'Amazon Business', desc: 'Everything For\nYour Business' },
              { title: 'Prime Now', desc: '2-Hour Delivery\non Everyday Items' },
              { title: 'Amazon Prime Music', desc: '100 million songs, ad-free\nOver 15 million podcast episodes' },
            ].map((service) => (
              <Link key={service.title} to="#" className="group">
                <span className="block text-[#dddddd] group-hover:underline font-medium leading-tight mb-0.5">{service.title}</span>
                <span className="block text-[#999999] group-hover:underline leading-tight whitespace-pre-line">{service.desc}</span>
              </Link>
            ))}
          </div>

          {/* Copyright Section */}
          <div className="flex flex-col items-center gap-1 text-[12px] text-[#dddddd]">
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="#" className="hover:underline">Conditions of Use & Sale</Link>
              <Link to="#" className="hover:underline">Privacy Notice</Link>
              <Link to="#" className="hover:underline">Interest-Based Ads</Link>
            </div>
            <p className="mt-1">© 1996-{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
