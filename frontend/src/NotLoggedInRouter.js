import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
const NotFoundRedirect = () => {
    window.location.href = "/";
    return null; // This ensures nothing is rendered
  };
  
const NotLoggedInRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="/ForgotPassword" element={<ForgotPasswordPage />} />
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </Router>
  );
};

export default NotLoggedInRoutes;
