import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Coffee, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'POS System' }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Coffee className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">{title}</span>
            </Link>
          </div>
          
          {user && (
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="ml-1.5 text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button 
                  onClick={logout}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:bg-gray-100 transition duration-150 ease-in-out"
                >
                  <LogOut className="mr-1.5 h-4 w-4 text-gray-500" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;