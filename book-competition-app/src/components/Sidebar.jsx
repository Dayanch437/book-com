import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiBook, FiAward, FiUser, FiLogOut, 
  FiInfo, FiInbox, FiSettings 
} from 'react-icons/fi';

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Get user role on component mount
  useEffect(() => {
    const role = localStorage.getItem('role'); // Direct string "TEACHER"
    if (role) {
      setUserRole(role);
    }
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    // Clear tokens and user data from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    
    // Redirect to login page
    navigate('/');
    window.location.reload();
  };

  // Base navigation items for all users
  const baseNavItems = [
    { path: '/competitions', name: 'Competitions', icon: <FiBook className="mr-2" /> },
    { path: '/achievements', name: 'Achievements', icon: <FiAward className="mr-2" /> },
    { path: '/profile', name: 'Profile', icon: <FiUser className="mr-2" /> },
    { path: '/inbox', name: 'Notifications', icon: <FiInbox className="mr-2" /> },
    { path: '/about', name: 'About', icon: <FiInfo className="mr-2" /> },
  ];

  // Admin/Instructor-specific navigation items
  const adminNavItems = [
    { path: '/admin', name: 'Admin Panel', icon: <FiSettings className="mr-2" /> }
  ];

  // Combine nav items based on user role
  const navItems = userRole === 'TEACHER'
    ? [...baseNavItems, ...adminNavItems] 
    : baseNavItems;

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
            <div className="text-xs text-gray-500 mb-2">Logged in as: {userRole}</div>
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