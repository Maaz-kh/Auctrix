import React, { useEffect, useState } from 'react';
import { getRequest } from '../axios';
import QuickStatCard from '../sellerComponents/QuickStatCard';
import { Briefcase, Users } from 'lucide-react';

export default function Dashboard() {
  const [totalActiveAuctions, setTotalActiveAuctions] = useState(0);
  const [totalActiveSellers, setTotalActiveSellers] = useState(0);
  const [totalActiveBidders, setTotalActiveBidders] = useState(0);
  const [recentAuctions, setRecentAuctions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [previousActiveAuctions, setPreviousActiveAuctions] = useState(0);
  const [previousActiveSellers, setPreviousActiveSellers] = useState(0);
  const [previousActiveBidders, setPreviousActiveBidders] = useState(0);

  useEffect(() => {
    const fetchAuctionProducts = async () => {
      try {
        const response = await getRequest('http://localhost:5000/api/admin/dashboard/get-total-active-auctions');
        setPreviousActiveAuctions(totalActiveAuctions); // Save previous value
        setTotalActiveAuctions(response || 0);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Active Auctions', error);
        setLoading(false);
      }
    };

    const fetchActiveSellers = async () => {
      try {
        const response = await getRequest('http://localhost:5000/api/admin/get-all-sellers');
        setPreviousActiveSellers(totalActiveSellers); // Save previous value
        setTotalActiveSellers(response.data.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Active Sellers', error);
        setLoading(false);
      }
    };

    const fetchActiveBidders = async () => {
      try {
        const response = await getRequest('http://localhost:5000/api/admin/get-all-bidders');
        setPreviousActiveBidders(totalActiveBidders); // Save previous value
        setTotalActiveBidders(response.data.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Active Bidders', error);
        setLoading(false);
      }
    };

    const fetchRecentAuctions = async () => {
      try {
        const response = await getRequest('http://localhost:5000/api/admin/dashboard/get-recent-auctions');
        setRecentAuctions(response.data || []); // Set response to recent auctions
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Recent Auctions. ', error);
        setLoading(false);
      }
    };

    fetchAuctionProducts();
    fetchActiveSellers();
    fetchActiveBidders();
    fetchRecentAuctions();

  }, [totalActiveAuctions, totalActiveSellers, totalActiveBidders]); // Watch state changes to update

  // Function to calculate the change for each stat
  const calculateChange = (currentValue, previousValue) => {
    return currentValue - previousValue;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Quick Stat Card for Total Auctions */}
      <div className="pt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickStatCard 
          icon={Briefcase} 
          title="Total Active Products" 
          value={totalActiveAuctions} 
          change={calculateChange(totalActiveAuctions, previousActiveAuctions)} 
          positive={calculateChange(totalActiveAuctions, previousActiveAuctions) >= 0} 
        />
        <QuickStatCard 
          icon={Users} 
          title="Total Active Sellers" 
          value={totalActiveSellers} 
          change={calculateChange(totalActiveSellers, previousActiveSellers)} 
          positive={calculateChange(totalActiveSellers, previousActiveSellers) >= 0} 
        />
        <QuickStatCard 
          icon={Users} 
          title="Total Active Bidders" 
          value={totalActiveBidders} 
          change={calculateChange(totalActiveBidders, previousActiveBidders)} 
          positive={calculateChange(totalActiveBidders, previousActiveBidders) >= 0} 
        />
      </div>

      {/* Recent Auctions Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Auctions</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentAuctions.map((auction) => (
            <div
              key={auction.product_id} // Use auction._id assuming it's the unique identifier
              className="flex justify-between items-center border-b pb-3 last:border-b-0"
            >
              <div>
                <h3 className="font-medium text-gray-700">{auction.product_id}</h3> {/* Assuming product_id is a relevant title */}
                <span
                  className={`text-xs px-2 py-1 rounded-full 
                    ${
                      auction.approval_status === "approved"
                        ? "bg-green-100 text-green-800"
                        : auction.approval_status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : auction.approval_status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  `}
                >
                  {auction.approval_status} {/* Show the approval status of auction */}
                </span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">
                  ${auction.current_bid}
                </p>
                <p className="text-sm text-gray-500">Ends {new Date(auction.expire_at).toLocaleString()}</p> {/* Format end date */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
