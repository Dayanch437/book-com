import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiBook, FiAward, FiUser, FiLogOut, FiInfo, FiBell, FiInbox } from 'react-icons/fi';
import axios from 'axios';

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Fetch unread notifications count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/notification/');
        setUnreadCount(response.data.length); // Assuming all are unread initially
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchUnreadCount();
    // Optional: Set up polling for real-time updates
    const interval = setInterval(fetchUnreadCount, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Redirect to login page
    navigate('/');
    
    // Optional: You might want to refresh the page to clear any state
    window.location.reload();
  };

  // List of navigation items
  const navItems = [
    { path: '/competitions', name: 'Competitions', icon: <FiBook className="mr-2" /> },
    { path: '/achievements', name: 'Achievements', icon: <FiAward className="mr-2" /> },
    { path: '/profile', name: 'Profile', icon: <FiUser className="mr-2" /> },
    { 
      path: '/inbox', 
      name: 'Notifications', 
      icon: (
        <div className="relative mr-2">
          <FiInbox />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      ) 
    },
    { path: '/about', name: 'About', icon: <FiInfo className="mr-2" /> },
  ];

  return (
    <>
      {/* Mobile Burger Button */}
      <div className="fixed z-50 md:hidden top-4 right-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-700 rounded-md hover:text-indigo-600 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-64 bg-white shadow-lg`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="p-4 mb-8">
            <Link to="/" className="text-xl font-bold text-indigo-600">BookCompetitions</Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className={`flex items-center p-3 rounded-lg ${location.pathname === '/' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiHome className="mr-2" />
                  <span>Home</span>
                </Link>
              </li>
              
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg ${location.pathname === item.path ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Section with Logout Button */}
          <div className="p-4 mt-auto border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full p-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <FiLogOut className="mr-2" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />  
      )}
    </>
  );
}