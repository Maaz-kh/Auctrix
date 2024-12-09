import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

// Seller Components
import SellerDashboard from "./pages/SellerDashboard";
import ProductsPage from "./pages/ProductsPage";
import ListingsPage from "./pages/ListingsPage";
import SellerMessagesPage from "./pages/SellerMessagesPage";
import SellerNotificationsPage from "./pages/SellerNotificationsPage";
import SellerProfilePage from "./pages/SellerProfilePage";

// Admin Components
import AdminSidebar from "./adminComponents/AdminSidebar";
import Analytics from "./adminComponents/Analytics";
import Dashboard from "./adminComponents/Dashboard";
import ManageBidders from "./adminComponents/ManageBidders";
import ManageSellers from "./adminComponents/ManageSellers";
import ManageProducts from "./adminComponents/ManageProducts";
import Profile from "./adminComponents/Profile";
import Messages from "./adminComponents/Messages";
import Settings from "./adminComponents/Settings";
import ViewActiveAuctions from "./adminComponents/ViewActiveAuctions";

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
  return (
    <Router>

      
      {role === "admin" ? (
        <div className="flex">
          {/* Admin Sidebar */}
          <AdminSidebar />
          {/* Main Content for Admin */}
          <div className="ml-64 p-6 w-full">
            <Routes>
              <Route path="/AdminDashboard" element={<Dashboard key={token} />} />
              <Route path="/adminProfile" element={<Profile key={token} />} />
              <Route path="/manage-sellers" element={<ManageSellers key={token} />} />
              <Route path="/manage-bidders" element={<ManageBidders key={token} />} />
              <Route path="/manage-products" element={<ManageProducts key={token} />} />
              <Route path="/analytics" element={<Analytics key={token} />} />
              <Route path="/messages" element={<Messages key={token} />} />
              <Route path="/settings" element={<Settings key={token} />} />
              <Route path="/view-active-auctions" element={<ViewActiveAuctions key={token} />} />
              <Route path="*" element={<NotFoundRedirect />} />
            </Routes>
          </div>
        </div>
      ) : (
        // Routes for Sellers (No Fixed Sidebar)
        <Routes>
          <Route path="/SellerDashboard" element={<SellerDashboard key={token} />} />
          <Route path="/Products" element={<ProductsPage key={token} />} />
          <Route path="/Listings" element={<ListingsPage key={token} />} />
          <Route path="/SellerMessages" element={<SellerMessagesPage key={token} />} />
          <Route path="/SellerNotifications" element={<SellerNotificationsPage key={token} />} />
          <Route path="/SellerProfile" element={<SellerProfilePage key={token} />} />
          <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
      )}
    </Router>
  );
};

export default LoggedInRoutes;
