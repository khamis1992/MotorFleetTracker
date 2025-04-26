import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Suspense, lazy } from 'react';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import RiderLayout from './layouts/RiderLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const VehicleList = lazy(() => import('./pages/admin/fleet/VehicleList'));
const VehicleDetail = lazy(() => import('./pages/admin/fleet/VehicleDetail'));
const VehicleAssignment = lazy(() => import('./pages/admin/fleet/VehicleAssignment'));
const GpsTracking = lazy(() => import('./pages/admin/tracking/GpsTracking'));
const GeofenceManagement = lazy(() => import('./pages/admin/tracking/GeofenceManagement'));
const EmployeeList = lazy(() => import('./pages/admin/hr/EmployeeList'));
const EmployeeDetail = lazy(() => import('./pages/admin/hr/EmployeeDetail'));

// Rider Pages
const RiderDashboard = lazy(() => import('./pages/rider/Dashboard'));
const RiderProfile = lazy(() => import('./pages/rider/Profile'));
const RiderVehicle = lazy(() => import('./pages/rider/Vehicle'));

// Loading fallback
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={user?.role === 'admin' || user?.role === 'supervisor' ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin/fleet/vehicles" element={user?.role === 'admin' || user?.role === 'supervisor' ? <VehicleList /> : <Navigate to="/login" />} />
          <Route path="/admin/fleet/vehicles/:id" element={user?.role === 'admin' || user?.role === 'supervisor' ? <VehicleDetail /> : <Navigate to="/login" />} />
          <Route path="/admin/fleet/assignments" element={user?.role === 'admin' || user?.role === 'supervisor' ? <VehicleAssignment /> : <Navigate to="/login" />} />
          <Route path="/admin/tracking/gps" element={user?.role === 'admin' || user?.role === 'supervisor' ? <GpsTracking /> : <Navigate to="/login" />} />
          <Route path="/admin/tracking/geofence" element={user?.role === 'admin' || user?.role === 'supervisor' ? <GeofenceManagement /> : <Navigate to="/login" />} />
          <Route path="/admin/hr/employees" element={user?.role === 'admin' ? <EmployeeList /> : <Navigate to="/login" />} />
          <Route path="/admin/hr/employees/:id" element={user?.role === 'admin' ? <EmployeeDetail /> : <Navigate to="/login" />} />
        </Route>

        {/* Rider Routes */}
        <Route element={<RiderLayout />}>
          <Route path="/rider" element={user?.role === 'rider' ? <RiderDashboard /> : <Navigate to="/login" />} />
          <Route path="/rider/profile" element={user?.role === 'rider' ? <RiderProfile /> : <Navigate to="/login" />} />
          <Route path="/rider/vehicle" element={user?.role === 'rider' ? <RiderVehicle /> : <Navigate to="/login" />} />
        </Route>

        {/* Super Admin Routes */}
        <Route element={<SuperAdminLayout />}>
          <Route path="/super-admin" element={user?.role === 'super_admin' ? <div>Super Admin Dashboard</div> : <Navigate to="/login" />} />
        </Route>

        {/* Root Redirect */}
        <Route 
          path="/" 
          element={
            user ? (
              user.role === 'admin' || user.role === 'supervisor' ? (
                <Navigate to="/admin" />
              ) : user.role === 'rider' ? (
                <Navigate to="/rider" />
              ) : user.role === 'super_admin' ? (
                <Navigate to="/super-admin" />
              ) : (
                <Navigate to="/login" />
              )
            ) : (
              <Navigate to="/login" />
            )
          } 
        />

        {/* 404 Route */}
        <Route path="*" element={<div className="flex h-screen items-center justify-center">Page not found</div>} />
      </Routes>
    </Suspense>
  );
}

export default App;
