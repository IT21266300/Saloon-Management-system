import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useData } from '../../contexts/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, Calendar, TrendingUp, Users, DollarSign, Package } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export const ReportsCenter: React.FC = () => {
  const { sales, customers, products, appointments } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Calculate metrics
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalCustomers = customers.length;
  const totalProducts = products.length;
  const totalAppointments = appointments.length;

  // Sales by payment method
  const paymentMethodData = sales.reduce((acc, sale) => {
    acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.total;
    return acc;
  }, {} as Record<string, number>);

  const paymentChartData = Object.entries(paymentMethodData).map(([method, amount]) => ({
    name: method.charAt(0).toUpperCase() + method.slice(1),
    value: amount
  }));

  // Monthly sales trend (mock data for demo)
  const monthlySalesData = [
    { month: 'Jan', sales: 4500, appointments: 45 },
    { month: 'Feb', sales: 5200, appointments: 52 },
    { month: 'Mar', sales: 4800, appointments: 48 },
    { month: 'Apr', sales: 6100, appointments: 61 },
    { month: 'May', sales: 5800, appointments: 58 },
    { month: 'Jun', sales: 6500, appointments: 65 },
  ];

  // Top selling products
  const productSales = sales.reduce((acc, sale) => {
    sale.items.forEach(item => {
      if (!acc[item.productId]) {
        acc[item.productId] = { quantity: 0, revenue: 0 };
      }
      acc[item.productId].quantity += item.quantity;
      acc[item.productId].revenue += item.total;
    });
    return acc;
  }, {} as Record<string, { quantity: number; revenue: number }>);

  const topProductsData = Object.entries(productSales)
    .sort(([,a], [,b]) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(([productId, data]) => {
      const product = products.find(p => p.id === productId);
      return {
        name: product?.name || 'Unknown',
        revenue: data.revenue,
        quantity: data.quantity
      };
    });

  // Customer distribution by total spent
  const customerSegments = customers.reduce((acc, customer) => {
    if (customer.totalSpent >= 1000) acc.premium++;
    else if (customer.totalSpent >= 500) acc.regular++;
    else acc.new++;
    return acc;
  }, { premium: 0, regular: 0, new: 0 });

  const customerSegmentData = [
    { name: 'Premium (>$1000)', value: customerSegments.premium },
    { name: 'Regular ($500-$1000)', value: customerSegments.regular },
    { name: 'New (<$500)', value: customerSegments.new }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports Center</h1>
          <p className="text-gray-600">Comprehensive business analytics and insights</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="outline">
            <Download size={20} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-xs text-green-600">+12% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-xs text-blue-600">+8% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{totalAppointments}</p>
              <p className="text-sm text-gray-600">Total Appointments</p>
              <p className="text-xs text-purple-600">+15% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{sales.length}</p>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-xs text-orange-600">+5% from last month</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Trend */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales & Appointments Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="appointments" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Payment Methods Distribution */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProductsData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Customer Segments */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Segments</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerSegmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {customerSegmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h3>
            <div className="space-y-3">
              {customers
                .sort((a, b) => b.totalSpent - a.totalSpent)
                .slice(0, 5)
                .map((customer, index) => (
                  <div key={customer.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-indigo-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.totalVisits} visits</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${customer.totalSpent.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Total Spent</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {sales
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((sale) => {
                  const customer = customers.find(c => c.id === sale.customerId);
                  return (
                    <div key={sale.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Sale #{sale.id.slice(-6)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {customer?.name || 'Walk-in Customer'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">${sale.total.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 capitalize">{sale.paymentMethod}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};