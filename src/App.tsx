import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { PrivateRoute } from './components/common/PrivateRoute';
import { Layout } from './components/layout/Layout';
import { AuthLayout } from './components/layout/AuthLayout';
import { Login } from './pages/auth/Login';
import { Dashboard } from './pages/Dashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { AppointmentManagement } from './pages/appointments/AppointmentManagement';
import { AppointmentCalendar } from './pages/appointments/AppointmentCalendar';
import { CustomerManagement } from './pages/customers/CustomerManagement';
import { SupplierManagement } from './pages/suppliers/SupplierManagement';
import { ProductManagement } from './pages/inventory/ProductManagement';
import { InventoryOverview } from './pages/inventory/InventoryOverview';
import { SalesManagement } from './pages/sales/SalesManagement';
import { POSSystem } from './pages/sales/POSSystem';
import { ReportsCenter } from './pages/reports/ReportsCenter';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={
                <AuthLayout>
                  <Login />
                </AuthLayout>
              } />
              <Route path="/" element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/admin/users" element={
                <PrivateRoute requiredRole="admin">
                  <Layout>
                    <UserManagement />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/appointments" element={
                <PrivateRoute>
                  <Layout>
                    <AppointmentManagement />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/appointments/calendar" element={
                <PrivateRoute>
                  <Layout>
                    <AppointmentCalendar />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/customers" element={
                <PrivateRoute>
                  <Layout>
                    <CustomerManagement />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/suppliers" element={
                <PrivateRoute>
                  <Layout>
                    <SupplierManagement />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/inventory/products" element={
                <PrivateRoute>
                  <Layout>
                    <ProductManagement />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/inventory" element={
                <PrivateRoute>
                  <Layout>
                    <InventoryOverview />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/sales" element={
                <PrivateRoute>
                  <Layout>
                    <SalesManagement />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/sales/pos" element={
                <PrivateRoute>
                  <Layout>
                    <POSSystem />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/reports" element={
                <PrivateRoute>
                  <Layout>
                    <ReportsCenter />
                  </Layout>
                </PrivateRoute>
              } />
            </Routes>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;