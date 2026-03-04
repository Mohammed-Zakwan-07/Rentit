// =============================================
// App Component - Router Setup
// =============================================

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AdminSidebar from './components/AdminSidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Customer pages
import Dashboard from './pages/customer/Dashboard';
import VehicleList from './pages/customer/VehicleList';
import BookVehicle from './pages/customer/BookVehicle';
import MyBookings from './pages/customer/MyBookings';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AddVehicle from './pages/admin/AddVehicle';
import ManageVehicles from './pages/admin/ManageVehicles';
import ManageDrivers from './pages/admin/ManageDrivers';
import AllBookings from './pages/admin/AllBookings';

// Layout wrapper for admin pages (with sidebar)
function AdminLayout({ children }) {
  return (
    <div className="flex">
      <AdminSidebar />
      {children}
    </div>
  );
}

export default function App() {
  const { loading } = useAuth();

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-950">
        <Navbar />

        <Routes>
          {/* ===== Public Routes ===== */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ===== Customer Routes ===== */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="customer">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles"
            element={
              <ProtectedRoute role="customer">
                <VehicleList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:id"
            element={
              <ProtectedRoute role="customer">
                <BookVehicle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute role="customer">
                <MyBookings />
              </ProtectedRoute>
            }
          />

          {/* ===== Admin Routes ===== */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-vehicle"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout>
                  <AddVehicle />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-vehicles"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout>
                  <ManageVehicles />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-drivers"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout>
                  <ManageDrivers />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout>
                  <AllBookings />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
