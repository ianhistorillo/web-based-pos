import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 ml-64 flex flex-col">
        <Header title={title} />
        
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;