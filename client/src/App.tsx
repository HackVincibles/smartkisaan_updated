import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { BlockchainProvider } from './context/BlockchainContext';

// Hooks
import { useAuth } from './hooks/useAuth';

// Public Pages
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import ProductListingPage from './pages/farmer/ProductListingPage';
import AddListingPage from './pages/farmer/AddListingPage';
import ProductDetailPage from './pages/farmer/ProductDetailPage';
import BidsOffersPage from './pages/farmer/BidsOffersPage';
import DemandMandiInsights from './pages/farmer/DemandMandiInsights';
import ChatbotAdvisor from './pages/farmer/ChatbotAdvisor';
import DisputesRatingsPage from './pages/farmer/DisputesRatingsPage';
import FarmerProfilePage from './pages/farmer/FarmerProfilePage';

// Buyer Pages
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import SearchProductsPage from './pages/buyer/SearchProductsPage';
import ProductDetailBidPage from './pages/buyer/ProductDetailBidPage';
import MyOrdersPage from './pages/buyer/MyOrdersPage';
import OrderTrackingPage from './pages/buyer/OrderTrackingPage';
import DisputesPage from './pages/buyer/DisputesPage';
import CreateDemandPage from './pages/buyer/CreateDemandPage';
import BuyerProfilePage from './pages/buyer/BuyerProfilePage';

// Transporter Pages
import TransporterDashboard from './pages/transporter/TransporterDashboard';
import AssignedOrdersPage from './pages/transporter/AssignedOrdersPage';
import TripDetailsPage from './pages/transporter/TripDetailsPage';
import QRScanProofPage from './pages/transporter/QRScanProofPage';
import AvailableLoadsPage from './pages/transporter/AvailableLoadsPage';
import EarningsPage from './pages/transporter/EarningsPage';
import TransporterProfilePage from './pages/transporter/TransporterProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import GlobalSettingsPage from './pages/admin/GlobalSettingsPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import DisputesManagementPage from './pages/admin/DisputesManagementPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';

// Layouts
import RootLayout from './components/layout/RootLayout';
import FarmerLayout from './components/layout/FarmerLayout';
import BuyerLayout from './components/layout/BuyerLayout';
import TransporterLayout from './components/layout/TransporterLayout';
import AdminLayout from './components/layout/AdminLayout';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BlockchainProvider>
          <Router>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<RootLayout />}>
                <Route index element={<LandingPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
              </Route>
              
              {/* Farmer Routes */}
              <Route path="/farmer" element={
                <ProtectedRoute allowedRoles={['farmer']}>
                  <FarmerLayout />
                </ProtectedRoute>
              }>
                <Route index element={<FarmerDashboard />} />
                <Route path="listings" element={<ProductListingPage />} />
                <Route path="listings/add" element={<AddListingPage />} />
                <Route path="listings/:id" element={<ProductDetailPage />} />
                <Route path="bids" element={<BidsOffersPage />} />
                <Route path="insights" element={<DemandMandiInsights />} />
                <Route path="advisor" element={<ChatbotAdvisor />} />
                <Route path="disputes" element={<DisputesRatingsPage />} />
                <Route path="profile" element={<FarmerProfilePage />} />
              </Route>
              
              {/* Buyer Routes */}
              <Route path="/buyer" element={
                <ProtectedRoute allowedRoles={['buyer']}>
                  <BuyerLayout />
                </ProtectedRoute>
              }>
                <Route index element={<BuyerDashboard />} />
                <Route path="search" element={<SearchProductsPage />} />
                <Route path="product/:id" element={<ProductDetailBidPage />} />
                <Route path="orders" element={<MyOrdersPage />} />
                <Route path="orders/:id/track" element={<OrderTrackingPage />} />
                <Route path="disputes" element={<DisputesPage />} />
                <Route path="demand/create" element={<CreateDemandPage />} />
                <Route path="profile" element={<BuyerProfilePage />} />
              </Route>
              
              {/* Transporter Routes */}
              <Route path="/transporter" element={
                <ProtectedRoute allowedRoles={['transporter']}>
                  <TransporterLayout />
                </ProtectedRoute>
              }>
                <Route index element={<TransporterDashboard />} />
                <Route path="orders" element={<AssignedOrdersPage />} />
                <Route path="trips/:id" element={<TripDetailsPage />} />
                <Route path="scan/:orderId" element={<QRScanProofPage />} />
                <Route path="loads" element={<AvailableLoadsPage />} />
                <Route path="earnings" element={<EarningsPage />} />
                <Route path="profile" element={<TransporterProfilePage />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="settings" element={<GlobalSettingsPage />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="disputes" element={<DisputesManagementPage />} />
                <Route path="profile" element={<AdminProfilePage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </BlockchainProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
