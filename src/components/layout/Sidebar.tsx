import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ShoppingCart, 
  Coffee, 
  Settings, 
  Clock, 
  Utensils, 
  Receipt, 
  Home,
  LayoutGrid
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home /> },
    { name: 'POS', path: '/pos', icon: <ShoppingCart /> },
    { name: 'Tables', path: '/tables', icon: <LayoutGrid /> },
    { name: 'Menu', path: '/menu', icon: <Utensils /> },
    { name: 'Orders', path: '/orders', icon: <Receipt /> },
    ...(user?.role === 'admin' ? [{ name: 'Settings', path: '/settings', icon: <Settings /> }] : []),
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-800 dark:bg-gray-900 text-white w-64 fixed">
      <div className="p-5 border-b border-gray-700 dark:border-gray-800 flex items-center justify-center">
        <span className="ml-2 text-xl font-bold">SinagTala POS System</span>
      </div>
      
      <nav className="mt-5 flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${
                isActive 
                ? 'bg-gray-900 dark:bg-gray-800 text-white' 
                : 'text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span className="mr-3 h-5 w-5">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-700 dark:border-gray-800">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-gray-400" />
          <span id="current-time" className="ml-2 text-sm text-gray-400">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;