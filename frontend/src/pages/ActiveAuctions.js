import React, { useEffect, useState } from 'react';
import { getRequest } from '../axios';
import Loading from '../components/Loading';
import { Search } from "lucide-react";

function ActiveAuctions() {
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');

  // Fetch active auctions on mount
  useEffect(() => {
    const fetchActiveAuctions = async () => {
      try {
        const response = await getRequest('http://localhost:5000/api/admin/get-active-auctions');
        const data = response.data;
        setActiveAuctions(data);
        setFilteredAuctions(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching active auctions:', error);
        setLoading(false);
      }
    };
    fetchActiveAuctions();
  }, []);

  // Apply filters based on search and dropdown
  useEffect(() => {
    let updatedAuctions = [...activeAuctions];

    if (searchQuery) {
      updatedAuctions = updatedAuctions.filter((auction) =>
        auction.product_id?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filter === 'ExpiresSoon') {
      updatedAuctions = updatedAuctions.filter((auction) => {
        const now = new Date();
        const expiration = new Date(auction.expire_at);
        const difference = expiration - now;
        return difference > 0 && difference <= 24 * 60 * 60 * 1000;
      });
    } else if (filter === 'NoBids') {
      updatedAuctions = updatedAuctions.filter((auction) => auction.total_bids?.length === 0);
    } else if (filter === 'HighActivity') {
      updatedAuctions = updatedAuctions.filter((auction) => auction.total_bids?.length >= 5);
    }

    setFilteredAuctions(updatedAuctions);
  }, [searchQuery, filter, activeAuctions]);

  // Function to calculate time left and implement coutdown
  const CountdownTimer = ({ expireAt }) => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const expiration = new Date(expireAt);
      const difference = expiration - now;

      if (difference <= 0) {
        return "Expired";
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
      const interval = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(interval); // cleanup
    }, [expireAt]);

    return <span>{timeLeft}</span>;
  };

  if (loading) return <Loading />;

  return (
    <div className="pt-14 md:p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0a5274] mb-4 md:mb-6">Active Auctions</h1>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-1/2 shadow-md">
          <input
            type="text"
            placeholder="Search by Product Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 pl-10 border rounded w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded w-full md:w-1/4 shadow-md">
          
          <option value="">All Categories</option>
          <option value="ExpiresSoon">Expires Soon (Within 1 Day)</option>
          <option value="NoBids">Auctions with 0 Bids</option>
          <option value="HighActivity">High Activity (5+ Bids)</option>
        </select>
      </div>

      {/* Auction Cards */}
      {filteredAuctions.length > 0 ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <div key={auction._id} className="border p-4 rounded-2xl bg-white shadow-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-xl">
              <img
                src={auction.product_id?.images?.[0] || 'https://via.placeholder.com/150'}
                alt={auction.product_id?.name || 'Product Image'}
                className="w-full h-40 object-cover rounded mb-4"/>
                
              <h2 className="text-lg font-bold mb-2">{auction.product_id?.name || 'Product Name'}</h2>
              <p className="text-sm text-gray-600 mb-1">Category: {auction.product_id?.category || 'N/A'}</p>
              <p className="text-sm text-gray-600 mb-1">Seller: {auction.product_id?.seller_id?.username || 'Unknown'}</p>
              <p className="text-sm font-semibold mb-1">Current Bid: Rs {auction.current_bid || 0} </p>
              <p className="text-sm font-semibold mb-1">Leading Bidder: {auction.leading_bidder || 'N/A'}</p>
              <p className="text-sm text-gray-700 mb-2">
                Time Left: <CountdownTimer expireAt={auction.expire_at} />
              </p>
              <span className="px-2 py-1 text-sm font-semibold rounded-full inline-block bg-green-100 text-green-700">
                {auction.auction_status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 text-lg font-semibold mt-6">
          No Auctions Found
        </div>
      )}
    </div>
  );
}

export default ActiveAuctions;
