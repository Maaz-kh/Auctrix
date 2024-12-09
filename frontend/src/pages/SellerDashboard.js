import React, { useState, useEffect } from 'react';
import Sidebar from '../sellerComponents/Sidebar';
import QuickStatCard from '../sellerComponents/QuickStatCard';
import PerformanceChart from '../sellerComponents/PerformanceChart';
import RecentAuctions from '../sellerComponents/RecentAuctions';
import { 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  ArrowUpRight 
} from 'lucide-react';


const SellerDashboard = () => {
  return (
    <div className="flex">
      <Sidebar selectedItem="SellerDashboard" />
      <div className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <QuickStatCard 
              icon={Briefcase} 
              title="Total Auctions" 
              value="24" 
              change={15} 
              positive 
            />
            <QuickStatCard 
              icon={DollarSign} 
              title="Total Revenue" 
              value="PKR 45,670" 
              change={8.5} 
              positive 
            />
            <QuickStatCard 
              icon={ShoppingCart} 
              title="Active Listings" 
              value="12" 
              change={-3.2} 
              positive={false} 
            />
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentAuctions />
            <PerformanceChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;