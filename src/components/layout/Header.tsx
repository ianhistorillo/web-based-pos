import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Coffee, LogOut, User, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'POS System' }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="h-14 w-26 object-contain ..." src="/st-logo-1.png" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">{title}</span>
            </Link>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="ml-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
                </div>
                <button 
                  onClick={logout}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm leading-5 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:bg-gray-100 transition duration-150 ease-in-out"
                >
                  <LogOut className="mr-1.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
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