import React from 'react';
import { Card } from '../components/common/Card';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Calendar, 
  Package, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { customers, appointments, products, sales } = useData();
  const { user } = useAuth();

  // Calculate metrics
  const todayAppointments = appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]);
  const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const lowStockProducts = products.filter(product => product.stock <= product.minStock);
  const pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="mt-2 opacity-90">
          Here's what's happening at Brilliance Salon today.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{customers.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-semibold text-gray-900">{todayAppointments.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Products</p>
              <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {todayAppointments.length > 0 ? (
              todayAppointments.slice(0, 5).map((appointment) => {
                const customer = customers.find(c => c.id === appointment.customerId);
                return (
                  <div key={appointment.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-indigo-600">
                          {customer?.name.charAt(0) || 'C'}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{customer?.name || 'Unknown Customer'}</p>
                        <p className="text-xs text-gray-500">{appointment.time}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      appointment.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">No appointments scheduled for today</p>
            )}
          </div>
        </Card>

        {/* Alerts & Notifications */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
            <AlertTriangle className="h-5 w-5 text-orange-400" />
          </div>
          <div className="space-y-3">
            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">Low Stock Alert</p>
                    <p className="text-xs text-orange-600">
                      {lowStockProducts.length} product(s) running low
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pending Appointments */}
            {pendingAppointments > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Pending Appointments</p>
                    <p className="text-xs text-yellow-600">
                      {pendingAppointments} appointment(s) need confirmation
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800">System Status</p>
                  <p className="text-xs text-green-600">All systems running smoothly</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{completedAppointments}</p>
          <p className="text-sm text-gray-600">Completed Appointments</p>
        </Card>

        <Card className="text-center">
          <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{products.reduce((sum, p) => sum + p.stock, 0)}</p>
          <p className="text-sm text-gray-600">Total Inventory Items</p>
        </Card>

        <Card className="text-center">
          <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{sales.length}</p>
          <p className="text-sm text-gray-600">Total Sales</p>
        </Card>
      </div>
    </div>
  );
};