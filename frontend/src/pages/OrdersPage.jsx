import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function OrdersPage() {
  const [data, setData] = useState({ searchCategories: [], footerLinks: {} });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    axios.all([
      axios.get(BACKEND_URL + '/api/search-categories'),
      axios.get(BACKEND_URL + '/api/footer-links')
    ]).then(axios.spread((cat, footer) => {
      setData({ searchCategories: cat.data, footerLinks: footer.data });
      setLoading(false);
    })).catch(() => setLoading(false));
  }, []);

  const orders = [
    {
      id: '3',
      orderId: '404-5926811-1234567',
      title: 'Apple AirPods Pro (2nd Generation)',
      price: 18999.00,
      status: 'Delivered 8-Jul',
      date: '8 July 2024',
      img: '/pods.jpg',
      recipient: user?.firstName || 'Demo',
      returnWindow: 'Return window closed on 18-Jul-2024'
    },
    {
      id: '6',
      orderId: '404-1234567-8901234',
      title: 'Logitech Brio 100 Full HD 1080P Webcam for Meetings and Streaming, Auto-Light Balance',
      price: 3095.00,
      status: 'Delivered 12-Jul',
      date: '10 July 2024',
      img: '/zebronic.jpg',
      recipient: user?.firstName || 'Demo',
      returnWindow: 'Return window closed on 22-Jul-2024'
    },
    {
      id: '5',
      orderId: '404-7654321-5678901',
      title: 'ZEBRONICS Fame, 2.0 USB Computer Speakers, 5 Watts, USB Powered, AUX, Volume Control',
      price: 449.00,
      status: 'Arriving tomorrow by 9 PM',
      date: 'Today',
      img: '/speaker.jpg',
      recipient: user?.firstName || 'Demo',
      returnWindow: 'Return eligible through 15-Aug-2024'
    }
  ];

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Header searchCategories={[]} />
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-12 w-12 border-4 border-[#febd69] border-t-transparent rounded-full"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white" data-testid="orders-page">
      <Header searchCategories={data.searchCategories} />

      <main className="max-w-[1000px] mx-auto px-4 py-4 min-h-[600px]">
        {/* Breadcrumb */}
        <div className="text-[14px] text-[#565959] mb-2">
          <Link to="/" className="hover:underline hover:text-[#c7511f]">Your Account</Link> › <span className="text-[#c7511f]">Your Orders</span>
        </div>

        {/* Page Header & Search */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[28px] font-normal text-[#0F1111]">Your Orders</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search all orders"
                className="pl-8 pr-4 py-1.5 border border-gray-400 rounded-sm shadow-inner focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] outline-none text-sm w-64"
              />
            </div>
            <button className="bg-[#303333] text-white px-4 py-1.5 rounded-full text-sm hover:bg-[#111]">Search Orders</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#ddd] mb-4">
          <div className="flex gap-6 text-[14px]">
            {['Orders', 'Buy Again', 'Not Yet Shipped', 'Digital Orders', 'Cancelled Orders'].map(tab => (
              <button
                key={tab}
                className={`pb-2 font-medium ${activeTab === tab.toLowerCase() ? 'text-[#0F1111] border-b-2 border-[#e77600]' : 'text-[#007185] hover:text-[#c7511f] hover:underline'}`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 mb-6 text-[14px]">
          <span className="font-bold">{orders.length} orders</span>
          <span>placed in</span>
          <select className="bg-[#F0F2F2] border border-[#D5D9D9] rounded-md px-2 py-1 shadow-sm text-sm hover:bg-[#e3e6e6] cursor-pointer focus:ring-[#e77600] focus:border-[#e77600]">
            <option>past 3 months</option>
            <option>2024</option>
            <option>2023</option>
          </select>
        </div>

        {/* Orders List */}
        {!isAuthenticated ? (
          <div className="bg-white border rounded p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Please Sign In</h2>
            <p className="mb-4">View past orders, track shipments, and manage returns.</p>
            <Link to="/signin" className="inline-block bg-[#FFD814] border border-[#FCD200] px-6 py-2 rounded-lg shadow-sm hover:bg-[#F7CA00]">Sign In</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(o => (
              <div key={o.id} className="border border-[#D5D9D9] rounded-md overflow-hidden hover:border-gray-400">
                {/* Order Card Header */}
                <div className="bg-[#F0F2F2] px-4 py-3 text-[12px] text-[#565959] flex justify-between items-center border-b border-[#D5D9D9]">
                  <div className="flex gap-8">
                    <div>
                      <div className="uppercase">Order Placed</div>
                      <div className="text-[#0F1111]">{o.date}</div>
                    </div>
                    <div>
                      <div className="uppercase">Total</div>
                      <div className="text-[#0F1111]">₹{o.price.toLocaleString('en-IN')}.00</div>
                    </div>
                    <div>
                      <div className="uppercase">Ship To</div>
                      <div className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer group relative">
                        {o.recipient} <span className="ml-1 text-[10px]">▼</span>
                        {/* Tooltip mockup could go here */}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="uppercase">Order # {o.orderId}</div>
                    <div className="flex gap-4 justify-end text-[#007185]">
                      <span className="text-[#565959]">View order details</span>
                      <span className="text-[#D5D9D9]">|</span>
                      <span className="text-[#565959]">Invoice</span>
                    </div>
                  </div>
                </div>

                {/* Order Card Body */}
                <div className="p-4 flex gap-6">
                  {/* Left: Status & Image */}
                  <div className="flex-1">
                    <h3 className="text-[18px] font-bold text-[#0F1111] mb-2">{o.status}</h3>
                    <div className="flex gap-4">
                      <Link to={`/product/${o.id}`}>
                        <img src={o.img} alt={o.title} className="w-[90px] h-[90px] object-contain cursor-pointer" />
                      </Link>
                      <div>
                        <Link to={`/product/${o.id}`} className="text-[#007185] hover:text-[#c7511f] hover:underline font-medium text-[14px] line-clamp-2 mb-1">
                          {o.title}
                        </Link>
                        <div className="text-[12px] text-[#565959]">{o.returnWindow}</div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions Stack */}
                  <div className="w-[280px] space-y-2">
                    <button className="w-full bg-white border border-[#D5D9D9] hover:bg-[#F7F7F7] rounded-full py-1.5 text-[13px] shadow-sm font-medium">
                      Track package
                    </button>
                    <button className="w-full bg-white border border-[#D5D9D9] hover:bg-[#F7F7F7] rounded-full py-1.5 text-[13px] shadow-sm">
                      Return or replace items
                    </button>
                    <button className="w-full bg-white border border-[#D5D9D9] hover:bg-[#F7F7F7] rounded-full py-1.5 text-[13px] shadow-sm">
                      Share gift receipt
                    </button>
                    <button className="w-full bg-white border border-[#D5D9D9] hover:bg-[#F7F7F7] rounded-full py-1.5 text-[13px] shadow-sm">
                      Write a product review
                    </button>
                    <button className="w-full bg-white border border-[#D5D9D9] hover:bg-[#F7F7F7] rounded-full py-1.5 text-[13px] shadow-sm">
                      Leave seller feedback
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer footerLinks={data.footerLinks} />
    </div>
  );
}

export default OrdersPage;
