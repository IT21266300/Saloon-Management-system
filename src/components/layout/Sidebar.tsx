import React from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: 'dashboard' },
  { name: 'Appointments', href: '/appointments', icon: 'event' },
  { name: 'Calendar', href: '/appointments/calendar', icon: 'calendar_today' },
  { name: 'Customers', href: '/customers', icon: 'people' },
  { name: 'Inventory', href: '/inventory', icon: 'inventory' },
  { name: 'Products', href: '/inventory/products', icon: 'shopping_bag' },
  { name: 'Suppliers', href: '/suppliers', icon: 'local_shipping' },
  { name: 'Sales', href: '/sales', icon: 'point_of_sale' },
  { name: 'POS System', href: '/sales/pos', icon: 'receipt_long' },
  { name: 'Reports', href: '/reports', icon: 'analytics' },
];

const adminNavigation = [
  { name: 'User Management', href: '/admin/users', icon: 'admin_panel_settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
        </div>
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 bg-indigo-600">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
              <span className="material-icons text-indigo-600 text-lg">content_cut</span>
            </div>
            <span className="ml-3 text-white font-semibold">Brilliance</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )
              }
            >
              <span className="material-icons mr-3 text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <>
              <hr className="my-4" />
              <div className="px-4 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Administration
                </h3>
              </div>
              {adminNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )
                  }
                >
                  <span className="material-icons mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </NavLink>
              ))}
            </>
          )}
        </nav>
      </div>
    </>
  );
};