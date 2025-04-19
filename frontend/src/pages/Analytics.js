import React, { useEffect, useState } from 'react';
import {getRequest, putRequest} from '../axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, LineChart } from 'lucide-react';
import QuickStatCard from '../components/QuickStatCard';

const AnalyticsPage = () => {
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [totalExpired, setTotalExpired] = useState(0);
  const [totalAuctions, setTotalAuctions] = useState(0);
  const [bidActivity, setBidActivity] = useState([]);
  const [topSellers, setTopSellers] = useState([]);

  useEffect(() => {
    fetchAuctionStats();
    fetchBidActivity();
    fetchTopSellers();
  }, []);

  const fetchAuctionStats = async () => {
    try {
      const response = await getRequest('http://localhost:5000/api/admin/get-auctions-by-status');
      const auctions = response.data;
      console.log(auctions)

      const completedCount = auctions.filter(a => a.auction_status === 'Completed').length;
      const expiredCount = auctions.length - completedCount;

      setTotalCompleted(completedCount);
      setTotalExpired(expiredCount);
      setTotalAuctions(completedCount + expiredCount);
    } catch (error) {
      console.error('Error fetching auction stats:', error);
    }
  };

  const fetchBidActivity = async () => {
    try {
      const response = await getRequest('http://localhost:5000/api/admin/get-bids-activity');
      console.log(response.data);
      setBidActivity(response.data || []);
    } catch (error) {
      console.error('Error fetching bid activity:', error);
    }
  };

  const fetchTopSellers = async () => {
    try {
      const response = await putRequest('http://localhost:5000/api/admin/get-top-performing-sellers');
      console.log(response.data);
      setTopSellers(response.data || []);
    } catch (error) {
      console.error('Error fetching top sellers:', error);
    }
  };

  return (
    <div className="pt-14 md:p-4 space-y-8">
      <h1 className="text-3xl md:text-3xl font-bold text-[#0a5274] mb-4">Analytics</h1>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickStatCard
          icon={LineChart}
          iconColor="text-blue-600"
          title="Total Auctions"
          value={totalAuctions}
          url="/auctions-history"
          valueColor="text-blue-600"
        />
        <QuickStatCard
          icon={TrendingUp}
          iconColor="text-green-600"
          title="Successful Auctions"
          value={totalCompleted}
          valueColor="text-green-600"
          url="/auctions-history"
          positive
        />
        <QuickStatCard
          icon={TrendingDown}
          iconColor="text-red-600"
          title="Expired Auctions"
          value={totalExpired}
          valueColor="text-red-600"
          url="/auctions-history"
          positive={false}
        />
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-2 md:p-4 shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-6">Total Bids Per Product Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bidActivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="totalBids" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Sellers Table */}
      <div className="bg-white p-4 shadow rounded-lg overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Top Performing Sellers</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="px-4 py-3">Seller</th>
              <th className="px-4 py-3">Total Auctions</th>
              <th className="px-4 py-3">Successful</th>
              <th className="px-4 py-3">Unsuccessful</th>
              <th className="px-4 py-3">Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {topSellers.map((seller, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-3 font-medium">{seller.sellerName}</td>
                <td className="px-4 py-3">{seller.totalAuctions}</td>
                <td className="px-4 py-3 font-medium text-green-600">{seller.totalSuccessfulAuctions}</td>
                <td className="px-4 py-3 font-medium text-red-500">{seller.totalUnsuccessfulAuctions}</td>
                <td className="px-4 py-3 font-medium">Rs {seller.totalRevenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      </div>
  );
};
   

export default AnalyticsPage;
