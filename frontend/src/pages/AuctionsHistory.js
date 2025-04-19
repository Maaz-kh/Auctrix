import React, { useEffect, useState } from 'react';
import { getRequest } from '../axios';
import Loading from '../components/Loading';
import { Search } from "lucide-react";

function AuctionsHistory() {
    const [auctionHistory, setAuctionHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('');

    // Fetch auction history on component mount
    useEffect(() => {
        const fetchAuctionHistory = async () => {
            try {
                const response = await getRequest('http://localhost:5000/api/admin/get-recent-auctions');
                console.log(response.data);
                setAuctionHistory(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching active auctions:', error);
                setLoading(false);
            }
        };
        fetchAuctionHistory();
    }, []);

    // Filter auctions by search and category
    useEffect(() => {
        let updatedHistory = auctionHistory;

        if (searchQuery) {
            updatedHistory = updatedHistory.filter((auction) =>
                auction.product_id?.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (filter === 'Expired') {
            updatedHistory = updatedHistory.filter((auction) => auction.auction_status === "Expired");
        } else if (filter === 'Completed') {
            updatedHistory = updatedHistory.filter((auction) => auction.auction_status === "Completed");
        } else if (filter === 'Last7Days') {
            const now = new Date();
            const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
            updatedHistory = updatedHistory.filter((auction) => new Date(auction.expire_at) >= sevenDaysAgo);
        }

        setFilteredHistory(updatedHistory);
    }, [searchQuery, filter, auctionHistory]);

    if (loading) { return <Loading /> }

    return (
        <div className="pt-14 md:p-4">
            <h1 className="text-2xl md:text-3xl font-bold text-[#0a5274] mb-4 md:mb-6">Auctions History</h1>

            {/* Search and Filter Options */}
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

                <select value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="p-2 border rounded w-full md:w-1/4 shadow-md">
                    <option value="">All Categories</option>
                    <option value="Expired">Expired Auctions</option>
                    <option value="Completed">Completed Auctions</option>
                    <option value="Last7Days">Auctions Within 7 Days</option>
                </select>
            </div>

            {/* Auction Grid */}
            {filteredHistory.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHistory.map((auction) => (
                        <div key={auction._id} className="border p-4 rounded-2xl bg-white shadow-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-xl">
                            <img
                                src={auction.product_id?.images[0] || 'https://via.placeholder.com/150'}
                                alt={auction.product_id?.name || 'Product Image'}
                                className="w-full h-40 object-contain rounded mb-4"/>

                            <h2 className="text-lg font-bold mb-2">{auction.product_id?.name || 'Product Name'}</h2>
                            <p className="text-sm text-gray-600 mb-1">Category: {auction.product_id?.category || 'N/A'}</p>
                            <p className="text-sm text-gray-600 mb-1">Seller: {auction.product_id?.seller_id?.username || 'N/A'}</p>
                            <p className="text-sm font-medium mb-1">Final Bid: Rs {auction.final_bid.bid_amount || 0}</p>
                            <p className="text-sm text-gray-700 mb-2">Ended At: {new Date(auction.expire_at).toLocaleString()}</p>
                            {/* Status Badge */}
                            
                            <span
                                className={`px-3 py-1 text-sm font-semibold rounded-full inline-block 
                                        ${auction.auction_status === 'Expired' ? 'bg-red-100 text-red-700' :
                                        auction.auction_status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>
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

export default AuctionsHistory;
