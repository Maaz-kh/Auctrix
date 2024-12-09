import React from 'react';
import { Link } from 'react-router-dom';

import { 
  Home, 
  User, 
  MessageCircle, 
  LogOut,
  List,
  Bell,     
  Box
} from 'lucide-react';


const Sidebar = ({ selectedItem }) => {
  const menuItems = [
    { icon: Home, name: 'Dashboard', key: 'SellerDashboard', link: '/SellerDashboard' },
    { icon: Box, name: 'Products', key: 'Products', link: '/Products' },
    { icon: List, name: 'Listing', key: 'Listings', link: '/Listings' },
    { icon: Bell, name: 'Notifications', key: 'Notifications', link: '/SellerNotifications' },
    { icon: MessageCircle, name: 'Messages', key: 'Messages', link: '/SellerMessages' },
    { icon: User, name: 'Profile', key: 'Profile', link: '/SellerProfile' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-100 transition-all duration-300 ease-in-out">
      <div className="px-6 py-8">
        <Link to="/SellerDashboard">
          <img className="mx-auto mb-4" src={require('../images/logo-along-txt.png')} alt="Logo" />
        </Link>
        <nav className='mt-8'>
          {menuItems.map((item) => (
            <Link 
              to={item.link} 
              key={item.key}
              className={`
                flex 
                items-center 
                px-4 
                py-3 
                rounded-lg 
                mb-2 
                cursor-pointer 
                transition-all 
                duration-200 
                ease-in-out
                ${selectedItem === item.key 
                  ? 'bg-blue-50 text-blue-600 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}
              `}
            >
              <item.icon 
                className={`
                  mr-3 
                  ${selectedItem === item.key 
                    ? 'text-blue-600' 
                    : 'text-gray-400'}
                `} 
                size={20} 
              />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 right-0 px-6">
          <Link 
            to="/logout"
            className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 cursor-pointer transition-all duration-200 ease-in-out"
          >
            <LogOut className="mr-3 text-gray-400" size={20} />
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
