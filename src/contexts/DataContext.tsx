import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  totalVisits: number;
  totalSpent: number;
  avatar?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  serviceId: string;
  staffId: string;
  workstationId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  totalAmount: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  supplierId: string;
  imageUrl?: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  products: string[];
}

export interface Sale {
  id: string;
  customerId?: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'digital';
  status: 'pending' | 'completed' | 'refunded';
  createdAt: string;
  staffId: string;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
  total: number;
}

interface DataContextType {
  customers: Customer[];
  appointments: Appointment[];
  products: Product[];
  suppliers: Supplier[];
  sales: Sale[];
  services: Service[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  addSale: (sale: Omit<Sale, 'id'>) => void;
  updateStock: (productId: string, quantity: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with demo data
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Jennifer Martinez',
      email: 'jennifer.martinez@email.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, Anytown, USA 12345',
      dateOfBirth: '1985-06-15',
      totalVisits: 24,
      totalSpent: 1450.00,
      avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?w=100&h=100&fit=crop&crop=face',
      createdAt: '2023-01-15'
    },
    {
      id: '2',
      name: 'Ashley Thompson',
      email: 'ashley.thompson@email.com',
      phone: '+1 (555) 234-5678',
      address: '456 Oak Ave, Somewhere, USA 67890',
      dateOfBirth: '1992-03-22',
      totalVisits: 18,
      totalSpent: 980.00,
      avatar: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?w=100&h=100&fit=crop&crop=face',
      createdAt: '2023-02-10'
    }
  ]);

  const [services] = useState<Service[]>([
    { id: '1', name: 'Haircut & Style', description: 'Professional haircut with styling', price: 65, duration: 60, category: 'Hair' },
    { id: '2', name: 'Hair Color', description: 'Full hair coloring service', price: 120, duration: 120, category: 'Hair' },
    { id: '3', name: 'Highlights', description: 'Hair highlighting service', price: 95, duration: 90, category: 'Hair' },
    { id: '4', name: 'Manicure', description: 'Professional nail care and polish', price: 35, duration: 45, category: 'Nails' },
    { id: '5', name: 'Pedicure', description: 'Foot care and nail polish', price: 45, duration: 60, category: 'Nails' },
    { id: '6', name: 'Facial Treatment', description: 'Deep cleansing facial', price: 80, duration: 75, category: 'Skincare' }
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      customerId: '1',
      serviceId: '1',
      staffId: '3',
      workstationId: '1',
      date: '2024-01-25',
      time: '10:00',
      status: 'confirmed',
      totalAmount: 65,
      notes: 'Regular customer, prefers layered cut'
    },
    {
      id: '2',
      customerId: '2',
      serviceId: '2',
      staffId: '3',
      workstationId: '2',
      date: '2024-01-25',
      time: '14:30',
      status: 'pending',
      totalAmount: 120
    }
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Professional Shampoo',
      description: 'Premium salon-grade shampoo for all hair types',
      category: 'Hair Care',
      sku: 'SHP-001',
      price: 24.99,
      cost: 12.50,
      stock: 45,
      minStock: 10,
      supplierId: '1',
      imageUrl: 'https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg?w=200&h=200&fit=crop'
    },
    {
      id: '2',
      name: 'Hair Conditioner',
      description: 'Deep conditioning treatment',
      category: 'Hair Care',
      sku: 'CON-001',
      price: 28.99,
      cost: 14.50,
      stock: 32,
      minStock: 8,
      supplierId: '1',
      imageUrl: 'https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg?w=200&h=200&fit=crop'
    },
    {
      id: '3',
      name: 'Nail Polish Set',
      description: 'Professional nail polish collection',
      category: 'Nail Care',
      sku: 'NP-SET-001',
      price: 89.99,
      cost: 45.00,
      stock: 15,
      minStock: 5,
      supplierId: '2',
      imageUrl: 'https://images.pexels.com/photos/1114887/pexels-photo-1114887.jpeg?w=200&h=200&fit=crop'
    }
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Beauty Supply Co.',
      email: 'orders@beautysupply.com',
      phone: '+1 (555) 111-2222',
      address: '789 Industrial Way, Supply City, USA 11111',
      contactPerson: 'Maria Rodriguez',
      products: ['1', '2']
    },
    {
      id: '2',
      name: 'Nail Tech Distributors',
      email: 'sales@nailtech.com',
      phone: '+1 (555) 333-4444',
      address: '321 Commerce Blvd, Trade Town, USA 22222',
      contactPerson: 'David Kim',
      products: ['3']
    }
  ]);

  const [sales, setSales] = useState<Sale[]>([
    {
      id: '1',
      customerId: '1',
      items: [
        { productId: '1', quantity: 2, price: 24.99, total: 49.98 },
        { productId: '2', quantity: 1, price: 28.99, total: 28.99 }
      ],
      subtotal: 78.97,
      tax: 7.90,
      discount: 0,
      total: 86.87,
      paymentMethod: 'card',
      status: 'completed',
      createdAt: '2024-01-20T10:30:00Z',
      staffId: '4'
    }
  ]);

  // CRUD operations
  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: uuidv4(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, ...updates } : customer
    ));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
  };

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: uuidv4()
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(appointment => 
      appointment.id === id ? { ...appointment, ...updates } : appointment
    ));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== id));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: uuidv4()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: uuidv4()
    };
    setSuppliers(prev => [...prev, newSupplier]);
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(supplier => 
      supplier.id === id ? { ...supplier, ...updates } : supplier
    ));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
  };

  const addSale = (sale: Omit<Sale, 'id'>) => {
    const newSale: Sale = {
      ...sale,
      id: uuidv4()
    };
    setSales(prev => [...prev, newSale]);
  };

  const updateStock = (productId: string, quantity: number) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, stock: Math.max(0, product.stock - quantity) }
        : product
    ));
  };

  const value: DataContextType = {
    customers,
    appointments,
    products,
    suppliers,
    sales,
    services,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    addProduct,
    updateProduct,
    deleteProduct,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addSale,
    updateStock
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};