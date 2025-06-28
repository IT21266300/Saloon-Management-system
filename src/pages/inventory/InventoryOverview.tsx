import React from 'react';
import { Card } from '../../components/common/Card';
import { useData } from '../../contexts/DataContext';
import { Package, AlertTriangle, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

export const InventoryOverview: React.FC = () => {
  const { products, suppliers } = useData();

  // Calculate metrics
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const totalCost = products.reduce((sum, p) => sum + (p.cost * p.stock), 0);
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  // Category breakdown
  const categoryBreakdown = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + product.stock;
    return acc;
  }, {} as Record<string, number>);

  // Top products by value
  const topProductsByValue = products
    .map(p => ({ ...p, totalValue: p.price * p.stock }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory Overview</h1>
        <p className="text-gray-600">Complete overview of your salon's inventory</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              <p className="text-sm text-gray-600">Total Products</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{totalStock}</p>
              <p className="text-sm text-gray-600">Total Stock Units</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Inventory Value</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{lowStockProducts.length}</p>
              <p className="text-sm text-gray-600">Low Stock Alerts</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts Section */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <Card className="border-l-4 border-yellow-500">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Low Stock Items</h3>
                </div>
                <div className="space-y-2">
                  {lowStockProducts.slice(0, 5).map(product => (
                    <div key={product.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-yellow-600">{product.stock} left</p>
                        <p className="text-xs text-gray-500">Min: {product.minStock}</p>
                      </div>
                    </div>
                  ))}
                  {lowStockProducts.length > 5 && (
                    <p className="text-sm text-gray-500 text-center pt-2">
                      +{lowStockProducts.length - 5} more items
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Out of Stock Alert */}
          {outOfStockProducts.length > 0 && (
            <Card className="border-l-4 border-red-500">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Out of Stock</h3>
                </div>
                <div className="space-y-2">
                  {outOfStockProducts.slice(0, 5).map(product => (
                    <div key={product.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  ))}
                  {outOfStockProducts.length > 5 && (
                    <p className="text-sm text-gray-500 text-center pt-2">
                      +{outOfStockProducts.length - 5} more items
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Category Breakdown & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock by Category</h3>
            <div className="space-y-3">
              {Object.entries(categoryBreakdown).map(([category, stock]) => {
                const percentage = (stock / totalStock) * 100;
                return (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{category}</span>
                      <span className="text-sm text-gray-500">{stock} units</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Top Products by Value */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products by Value</h3>
            <div className="space-y-3">
              {topProductsByValue.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-indigo-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.stock} units × ${product.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${product.totalValue.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Total Value</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">${totalCost.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total Cost Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total Selling Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">${(totalValue - totalCost).toFixed(2)}</p>
              <p className="text-sm text-gray-600">Potential Profit</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};