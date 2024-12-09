import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  User, 
  Settings, 
  BarChart2, 
  MessageCircle, 
  LogOut, 
  Users,
  Boxes,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const AdminSidebar = ({ selectedItem }) => {
  const [isManageAuctionsOpen, setIsManageAuctionsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: Home, name: 'Dashboard', key: 'dashboard', path: '/AdminDashboard' },
    { icon: User, name: 'Profile', key: 'profile', path: '/adminProfile' },
    { icon: Users, name: 'Manage Sellers', key: 'manage-sellers', path: '/manage-sellers' },
    { icon: Users, name: 'Manage Bidders', key: 'manage-bidders', path: '/manage-bidders' },
    { icon: Boxes, name: 'Manage Auctions', key: 'manage-auctions', path: '/manage-auctions' },
    { icon: BarChart2, name: 'Analytics', key: 'analytics', path: '/analytics' },
    { icon: MessageCircle, name: 'Messages', key: 'messages', path: '/messages' },
    { icon: Settings, name: 'Settings', key: 'settings', path: '/settings' }
  ];

  const handleManageAuctionsClick = () => {
    setIsManageAuctionsOpen((prevState) => !prevState);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xxl border-r border-gray-300 flex flex-col">
      {/* Logo and App Name */}
      <div className="px-6 py-6">
        <Link to="/AdminDashboard">
          <img
            className="mx-auto mb-4"
            src={require('../images/logo-along-txt.png')}
            alt="Logo"
          />
        </Link>
      </div>

      {/* Scrollable Menu Section */}
      <div className="pt-4 flex-1 overflow-y-auto px-6 border-t border-gray-200">
        <nav>
          {menuItems.map((item) => (
            <div key={item.key}>
              {/* For Manage Auctions, toggle dropdown */}
              {item.name === 'Manage Auctions' ? (
                <div>
                  <div
                    className={`flex items-center px-4 py-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 ease-in-out ${
                      selectedItem === item.key || isActive(item.path)
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                    onClick={handleManageAuctionsClick}
                  >
                    <item.icon
                      className={`mr-3 ${
                        selectedItem === item.key || isActive(item.path)
                          ? 'text-blue-600'
                          : 'text-gray-400'
                      }`}
                      size={20}
                    />
                    {item.name}
                    {isManageAuctionsOpen ? (
                      <ChevronUp className="ml-auto" size={16} />
                    ) : (
                      <ChevronDown className="ml-auto" size={16} />
                    )}
                  </div>
                  {/* Dropdown menu */}
                  {isManageAuctionsOpen && (
                    <div className="pl-6">
                      <Link
                        to="/manage-products"
                        className={`flex items-center px-4 py-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 ease-in-out ${
                          isActive('/manage-products')
                            ? 'bg-blue-50 text-blue-600 font-semibold'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                        }`}
                      >
                        Approve/Decline Products
                      </Link>
                      <Link
                        to="/view-active-auctions"
                        className={`flex items-center px-4 py-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 ease-in-out ${
                          isActive('/view-active-auctions')
                            ? 'bg-blue-50 text-blue-600 font-semibold'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                        }`}
                      >
                        View Active Auctions
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  key={item.key}
                  className={`flex items-center px-4 py-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 ease-in-out ${
                    selectedItem === item.key || isActive(item.path)
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  <item.icon
                    className={`mr-3 ${
                      selectedItem === item.key || isActive(item.path)
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }`}
                    size={20}
                  />
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Logout Button at the Bottom */}
      <Link to="/"> 
      <div className="px-6 py-4 border-t border-gray-200">
        <div
          className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 cursor-pointer transition-all duration-200 ease-in-out"
        >
          
          <LogOut className="mr-3 text-gray-400" size={20} />Logout
        </div>
      </div>
        </Link>
    </div>
  );
};

export default AdminSidebar;
