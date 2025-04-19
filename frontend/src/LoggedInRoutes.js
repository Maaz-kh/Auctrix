import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

// Admin Components
import AdminSidebar from "./components/Sidebar";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import ManageBidders from "./pages/ManageBidders";
import ManageSellers from "./pages/ManageSellers";
import ProductsApproval from "./pages/ProductsApproval";
import Profile from "./pages/Profile";
import ActiveAuctions from "./pages/ActiveAuctions";
import AuctionsHistory from "./pages/AuctionsHistory";

const NotFoundRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    window.location.href = "/";
  }, [navigate]);

  return null; // No UI is rendered, just a redirect
};


const LoggedInRoutes = ({ token, role }) => {

  return role === "admin" ? (
    <Router>
      <div className="flex">
        <AdminSidebar />
        <div className="ml-0 p-8 md:ml-64 md:p-6 w-full">
          <Routes>
            <Route path="/AdminDashboard" element={<Dashboard key={token} />} />
            <Route path="/adminProfile" element={<Profile key={token} />} />
            <Route path="/manage-sellers" element={<ManageSellers key={token} />} />
            <Route path="/manage-bidders" element={<ManageBidders key={token} />} />
            <Route path="/manage-products" element={<ProductsApproval key={token} />} />
            <Route path="/analytics" element={<Analytics key={token} />} />
            <Route path="/active-auctions" element={<ActiveAuctions key={token} />} />
            <Route path="/auctions-history" element={<AuctionsHistory key={token} />} />
            <Route path="*" element={<NotFoundRedirect />} />
          </Routes>
        </div>
      </div>
    </Router>
  ) : <Route path="*" element={<NotFoundRedirect />} />; 
};
export default LoggedInRoutes;
