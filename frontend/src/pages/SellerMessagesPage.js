import React, { useState, useEffect } from 'react';
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
  Search,
  Send,
  Paperclip,
  MoreVertical,
  CheckCheck,
  X
} from 'lucide-react';


// Seller Messages Page
const SellerMessages = () => {
    // Sample conversation data
    const [conversations, setConversations] = useState([
      {
        id: 1,
        name: 'John Doe',
        product: 'iPhone 13 Pro',
        lastMessage: 'Can you provide more details about the phone condition?',
        timestamp: '2 hours ago',
        unread: true,
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      {
        id: 2,
        name: 'Emily Smith',
        product: 'MacBook Pro 2021',
        lastMessage: 'I\'m interested in purchasing the laptop.',
        timestamp: '1 day ago',
        unread: false,
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
      }
    ]);
  
    // Sample messages for selected conversation
    const [messages, setMessages] = useState([
      {
        id: 1,
        sender: 'John Doe',
        text: 'Can you provide more details about the phone condition?',
        timestamp: '2:30 PM',
        type: 'received'
      },
      {
        id: 2,
        sender: 'You',
        text: 'The phone is in excellent condition, barely used with original packaging.',
        timestamp: '2:35 PM',
        type: 'sent'
      }
    ]);
  
    // State for new message input
    const [newMessage, setNewMessage] = useState('');
  
    // Currently selected conversation
    const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  
    // Send message handler
    const sendMessage = () => {
      if (newMessage.trim()) {
        const message = {
          id: messages.length + 1,
          sender: 'You',
          text: newMessage,
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          type: 'sent'
        };
        setMessages([...messages, message]);
        setNewMessage('');
      }
    };
  
    return (
      <div className="flex">
        {/* Sidebar */}
        <Sidebar selectedItem="Messages" />
  
        {/* Main Messages Container */}
        <div className="ml-64 w-full bg-gray-50 min-h-screen flex">
          {/* Conversations List */}
          <div className="w-96 bg-white border-r border-gray-200 p-4">
            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="Search conversations" 
                className="w-full p-2 pl-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-2 top-3 text-gray-400" size={18} />
            </div>
  
            {conversations.map((conv) => (
              <div 
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`
                  flex 
                  items-center 
                  p-4 
                  hover:bg-gray-100 
                  cursor-pointer 
                  rounded-lg 
                  mb-2
                  ${selectedConversation.id === conv.id ? 'bg-blue-50' : ''}
                `}
              >
                <img 
                  src={conv.avatar} 
                  alt={conv.name} 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{conv.name}</h3>
                    <span className="text-xs text-gray-500">{conv.timestamp}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`
                      text-sm 
                      ${conv.unread ? 'font-bold text-blue-600' : 'text-gray-500'}
                    `}>
                      {conv.lastMessage}
                    </p>
                    {conv.unread && (
                      <span className="bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
                        1
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
  
          {/* Chat Window */}
          <div className="flex-grow flex flex-col">
            {/* Chat Header */}
            <div className="bg-white p-4 border-b flex justify-between items-center">
              <div className="flex items-center">
                <img 
                  src={selectedConversation.avatar} 
                  alt={selectedConversation.name} 
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h2 className="font-semibold">{selectedConversation.name}</h2>
                  <p className="text-sm text-gray-500">
                    Discussing: {selectedConversation.product}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="hover:bg-gray-100 p-2 rounded-full">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
  
            {/* Messages Container */}
            <div className="flex-grow p-4 overflow-y-auto">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`
                    flex 
                    mb-4 
                    ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}
                  `}
                >
                  <div 
                    className={`
                      max-w-md 
                      p-3 
                      rounded-lg 
                      ${msg.type === 'sent' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-800'}
                    `}
                  >
                    <p>{msg.text}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs opacity-70">{msg.timestamp}</span>
                      {msg.type === 'sent' && (
                        <CheckCheck 
                          size={16} 
                          className="ml-2 text-white opacity-70" 
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
  
            {/* Message Input */}
            <div className="bg-white p-4 border-t flex items-center space-x-2">
              <button className="hover:bg-gray-100 p-2 rounded-full">
                <Paperclip size={20} />
              </button>
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..." 
                className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button 
                onClick={sendMessage}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default SellerMessages;