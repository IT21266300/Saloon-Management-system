import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useData } from '../../contexts/DataContext';
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, DollarSign, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export const POSSystem: React.FC = () => {
  const { products, customers, addSale, updateStock } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'digital'>('cash');
  const [discount, setDiscount] = useState(0);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        total: product.price
      }]);
    }
  };

  const updateCartItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer('');
    setDiscount(0);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax - discount;

  const processSale = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    // Check stock availability
    for (const item of cart) {
      const product = products.find(p => p.id === item.productId);
      if (!product || product.stock < item.quantity) {
        toast.error(`Insufficient stock for ${item.name}`);
        return;
      }
    }

    // Create sale
    const sale = {
      customerId: selectedCustomer || undefined,
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      })),
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      status: 'completed' as const,
      createdAt: new Date().toISOString(),
      staffId: '1' // Current user ID
    };

    addSale(sale);

    // Update stock
    cart.forEach(item => {
      updateStock(item.productId, item.quantity);
    });

    toast.success('Sale completed successfully!');
    clearCart();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">POS System</h1>
          <p className="text-gray-600">Point of Sale - Process customer transactions</p>
        </div>
        <Button variant="outline" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search */}
          <Card>
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products by name or SKU..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Product Grid */}
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Products</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => addToCart(product)}
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <ShoppingCart size={24} className="text-gray-400" />
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                    <p className="text-xs text-gray-500 mb-1">{product.sku}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-indigo-600">${product.price.toFixed(2)}</span>
                      <span className="text-xs text-gray-500">{product.stock} left</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Cart & Checkout */}
        <div className="space-y-6">
          {/* Cart */}
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shopping Cart</h3>
              
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.productId} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartItemQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Customer Selection */}
          <Card>
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Customer (Optional)</h3>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                <option value="">Walk-in Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
          </Card>

          {/* Payment & Checkout */}
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Checkout</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="text-sm font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tax (10%):</span>
                  <span className="text-sm font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Discount:</span>
                  <input
                    type="number"
                    step="0.01"
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <hr />
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-indigo-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Method</h4>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={paymentMethod === 'cash' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <DollarSign size={16} className="mr-1" />
                    Cash
                  </Button>
                  <Button
                    variant={paymentMethod === 'card' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard size={16} className="mr-1" />
                    Card
                  </Button>
                  <Button
                    variant={paymentMethod === 'digital' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setPaymentMethod('digital')}
                  >
                    Digital
                  </Button>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={processSale}
                disabled={cart.length === 0}
              >
                <Receipt size={20} className="mr-2" />
                Complete Sale
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};