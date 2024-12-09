import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../sellerComponents/Sidebar';
import { 
  Home, 
  User, 
  MessageCircle, 
  LogOut,
  List,
  Bell,     
  Box,
  Check,
  X,
  Archive
} from 'lucide-react';

// Notifications Page Component
const SellerNotifications = () => {
    // Sample notification data
    const [notifications, setNotifications] = useState([
      {
        id: 1,
        title: 'New Order Received',
        description: 'You have a new order for iPhone 12 Pro Max',
        type: 'order',
        date: '2 hours ago',
        read: false
      },
      {
        id: 2,
        title: 'Product Low in Stock',
        description: 'Samsung Galaxy S21 is running low on inventory',
        type: 'inventory',
        date: '1 day ago',
        read: false
      },
      {
        id: 3,
        title: 'Payment Processed',
        description: 'Payment of $1,200 has been successfully processed',
        type: 'payment',
        date: '3 days ago',
        read: true
      },
      {
        id: 4,
        title: 'New Message',
        description: 'You have a new message from customer support',
        type: 'message',
        date: '5 days ago',
        read: true
      }
    ]);
  
    // Function to mark notification as read
    const markAsRead = (id) => {
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ));
    };
  
    // Function to delete notification
    const deleteNotification = (id) => {
      setNotifications(notifications.filter(notif => notif.id !== id));
    };
  
    // Determine notification icon based on type
    const getNotificationIcon = (type) => {
      switch(type) {
        case 'order': return <Box className="text-blue-500" size={24} />;
        case 'inventory': return <List className="text-yellow-500" size={24} />;
        case 'payment': return <Check className="text-green-500" size={24} />;
        case 'message': return <MessageCircle className="text-purple-500" size={24} />;
        default: return <Bell className="text-gray-500" size={24} />;
      }
    };
  
    return (
      <div className="flex">
        {/* Sidebar */}
        <Sidebar selectedItem="Notifications" />
  
        {/* Main Content */}
        <div className="ml-64 w-full p-8 bg-gray-50 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
              <Bell className="mr-3 text-blue-600" size={32} />
              Notifications
            </h1>
  
            {/* Notifications Container */}
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <Bell className="mx-auto mb-4 text-gray-300" size={48} />
                  <p className="text-gray-500">No notifications at the moment</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`
                      flex 
                      items-center 
                      bg-white 
                      p-4 
                      rounded-lg 
                      shadow-sm 
                      hover:shadow-md 
                      transition-all 
                      duration-200 
                      ${!notification.read ? 'border-l-4 border-blue-500' : ''}
                    `}
                  >
                    {/* Notification Icon */}
                    <div className="mr-4">
                      {getNotificationIcon(notification.type)}
                    </div>
  
                    {/* Notification Content */}
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                      <p className="text-gray-600 text-sm">{notification.description}</p>
                      <span className="text-xs text-gray-400">{notification.date}</span>
                    </div>
  
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {!notification.read && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="text-green-500 hover:bg-green-50 p-2 rounded-full"
                          title="Mark as Read"
                        >
                          <Check size={20} />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                        title="Delete Notification"
                      >
                        <X size={20} />
                      </button>
                      <button 
                        className="text-gray-500 hover:bg-gray-50 p-2 rounded-full"
                        title="Archive Notification"
                      >
                        <Archive size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default SellerNotifications;