import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Menu, BarChart2, LogOut, Users, CheckCircle, Eye, Clock } from 'lucide-react';

const Sidebar = ({ selectedItem }) => {

  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { icon: Home, name: 'Dashboard', key: 'dashboard', path: '/AdminDashboard' },
    { icon: User, name: 'Profile', key: 'profile', path: '/adminProfile' },
    { icon: Users, name: 'Manage Sellers', key: 'manage-sellers', path: '/manage-sellers' },
    { icon: Users, name: 'Manage Bidders', key: 'manage-bidders', path: '/manage-bidders' },
    { icon: CheckCircle, name: 'Products Approval', key: 'products-approval', path: '/manage-products' },
    { icon: Eye, name: 'Active Auctions', key: 'active-auctions', path: '/active-auctions' },
    { icon: Clock, name: 'Auctions History', key: 'auctions-history', path: '/auctions-history' },
    { icon: BarChart2, name: 'Analytics', key: 'analytics', path: '/analytics' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Navbar for small screens */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex justify-between items-center z-50">
        <button onClick={toggleSidebar} className="text-gray-700 focus:outline-none">
          <Menu size={28} />
        </button>
        <img
          src={require('../images/logo.png')}
          alt="Logo"
          className="h-10"
        />
      </div>
      <div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-xl border-r border-gray-300 flex flex-col transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}>

        {/* Logo */}
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
              <Link
                to={item.path}
                key={item.key}
                className={`flex items-center px-4 py-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 ease-in-out ${selectedItem === item.key || isActive(item.path)
                  ? 'bg-blue-50 text-blue-800 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
              >
                <item.icon
                  className={`mr-3 ${selectedItem === item.key || isActive(item.path)
                    ? 'text-blue-800'
                    : 'text-gray-400'
                    }`}
                  size={20}
                />
                {item.name}
              </Link>
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
      {/* Overlay to close sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 md:hidden" onClick={toggleSidebar}></div>
      )}
    </>
  );
};

export default Sidebar;
