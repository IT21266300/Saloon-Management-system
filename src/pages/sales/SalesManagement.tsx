import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useData } from '../../contexts/DataContext';
import { DollarSign, ShoppingCart, TrendingUp, Receipt, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export const SalesManagement: React.FC = () => {
  const { sales, customers, products } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  // Calculate metrics
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const averageOrderValue = totalRevenue / totalSales || 0;
  const completedSales = sales.filter(sale => sale.status === 'completed').length;

  // Get recent sales
  const recentSales = sales
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
          <p className="text-gray-600">Track and manage all sales transactions</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Receipt size={20} className="mr-2" />
            Generate Report
          </Button>
          <Button>
            <ShoppingCart size={20} className="mr-2" />
            New Sale
          </Button>
        </div>
      </div>

      {/* Sales Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
              <p className="text-sm text-gray-600">Total Sales</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">${averageOrderValue.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Avg Order Value</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <Receipt className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{completedSales}</p>
              <p className="text-sm text-gray-600">Completed Sales</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sales Filter */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sale ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentSales.map((sale) => {
                const customer = customers.find(c => c.id === sale.customerId);
                
                return (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{sale.id.slice(-6)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          {customer ? (
                            customer.avatar ? (
                              <img 
                                src={customer.avatar} 
                                alt={customer.name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-xs font-medium text-gray-600">
                                {customer.name.charAt(0)}
                              </span>
                            )
                          ) : (
                            <User size={16} className="text-gray-400" />
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {customer?.name || 'Walk-in Customer'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {sale.items.length} item{sale.items.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-sm text-gray-500">
                        {sale.items.reduce((sum, item) => sum + item.quantity, 0)} units
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${sale.total.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">
                        {sale.discount > 0 && `Discount: $${sale.discount.toFixed(2)}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                        sale.paymentMethod === 'cash' 
                          ? 'bg-green-100 text-green-800'
                          : sale.paymentMethod === 'card'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                        sale.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : sale.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(sale.createdAt), 'MMM dd, yyyy HH:mm')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Top Selling Products */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {/* Calculate top selling products */}
            {(() => {
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

              return Object.entries(productSales)
                .sort(([,a], [,b]) => b.quantity - a.quantity)
                .slice(0, 5)
                .map(([productId, data], index) => {
                  const product = products.find(p => p.id === productId);
                  return (
                    <div key={productId} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-indigo-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product?.name || 'Unknown Product'}</p>
                          <p className="text-xs text-gray-500">{data.quantity} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">${data.revenue.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                    </div>
                  );
                });
            })()}
          </div>
        </div>
      </Card>
    </div>
  );
};