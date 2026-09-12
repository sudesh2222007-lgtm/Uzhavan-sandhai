import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import NearbyFarmers from "./pages/NearbyFarmers";
import FarmerProfile from "./pages/FarmerProfile";
import FarmerDashboard from "./pages/FarmerDashboard";
import FarmerInfoCenter from "./pages/FarmerInfoCenter";
import CustomerOrders from "./pages/CustomerOrders";
import CustomerInfo from "./pages/CustomerInfo";
import Favourites from "./pages/Favourites";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/nearby-farmers" element={<NearbyFarmers />} />
          <Route path="/farmers/:id" element={<FarmerProfile />} />
          <Route path="/customer-info" element={<CustomerInfo />} />

          <Route path="/orders" element={<ProtectedRoute role="customer"><CustomerOrders /></ProtectedRoute>} />
          <Route path="/favourites" element={<ProtectedRoute role="customer"><Favourites /></ProtectedRoute>} />

          <Route path="/farmer/dashboard" element={<ProtectedRoute role="farmer"><FarmerDashboard /></ProtectedRoute>} />
          <Route path="/farmer/info-center" element={<ProtectedRoute role="farmer"><FarmerInfoCenter /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
