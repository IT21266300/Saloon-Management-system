import React, { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="material-icons text-white text-2xl">content_cut</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Brilliance Salon
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Management System
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};