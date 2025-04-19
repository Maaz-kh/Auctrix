import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom"
import { getRequest } from '../axios';
import QuickStatCard from '../components/QuickStatCard';
import { Briefcase, Users } from 'lucide-react';
import Loading from '../components/Loading';


export default function Dashboard() {
  const [totalActiveAuctions, setTotalActiveAuctions] = useState(0);
  const [totalActiveSellers, setTotalActiveSellers] = useState(0);
  const [totalActiveBidders, setTotalActiveBidders] = useState(0);
  const [recentAuctions, setRecentAuctions] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchAuctionProducts = async () => {
      try {
        const response = await getRequest('http://localhost:5000/api/admin/get-active-auctions');
        setTotalActiveAuctions(response.data.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Active Auctions', error);
        setLoading(false);
      }
    };

    const fetchActiveSellers = async () => {
      try {
        const response = await getRequest('http://localhost:5000/api/admin/get-all-sellers');
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
        setTotalActiveBidders(response.data.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Active Bidders', error);
        setLoading(false);
      }
    };

    const fetchRecentAuctions = async () => {
      try {
        const response = await getRequest('http://localhost:5000/api/admin/get-recent-auctions?limit=3');
        setRecentAuctions(response.data);
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

  }, [totalActiveAuctions, totalActiveSellers, totalActiveBidders]);

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="md:p-4 pt-14">
      <h1 className="text-3xl md:text-3xl font-bold text-[#0a5274] mb-4">Dashboard</h1>

      <div className="pt-2 grid grid-cols-1 md:grid-cols-3 gap-6 ">
        <QuickStatCard
          icon={Briefcase}
          iconColor="text-blue-700"
          title="Total Active Auctions"
          url="/active-auctions"
          value={totalActiveAuctions}
          valueColor="text-grey-800"
        />
        <QuickStatCard
          icon={Users}
          iconColor="text-green-600"
          title="Total Active Sellers"
          url="/manage-sellers"
          value={totalActiveSellers}
          valueColor="text-grey-800"
        />
        <QuickStatCard
          icon={Users}
          iconColor="text-purple-600"
          title="Total Active Bidders"
          url="/manage-bidders"
          value={totalActiveBidders}
          valueColor="text-grey-800"
        />
      </div>

      {/* Recent Auctions Section */}
      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mt-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Recent Auctions</h2>
          <Link to="/auctions-history"
            className="text-blue-500 hover:text-blue-700 text-sm sm:text-md hover:underline">
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {recentAuctions.map((auction) => (
            <div
              key={auction._id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-3 last:border-b-0">
              
              {/* Left: Product Info + Status */}
              <div className="mb-2 sm:mb-0">
                <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-1">
                  {auction.product_id?.name || "Product Name"}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full 
                    ${auction.auction_status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : auction.auction_status === "Expired"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                  {auction.auction_status}
                </span>
              </div>

              {/* Right: Price and Time Info */}
              <div className="text-left sm:text-right">
                <p className="text-sm sm:text-base font-semibold text-gray-800">
                  Rs {auction.final_bid.bid_amount}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {auction.auction_status === "Completed"
                    ? `Ended at ${new Date(auction.expire_at).toLocaleString()}`
                    : `Expired at ${new Date(auction.expire_at).toLocaleString()}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
