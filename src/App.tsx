import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MenuProvider } from './context/MenuContext';
import { OrderProvider } from './context/OrderContext';
import { TableProvider } from './context/TableContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import LoginForm from './components/auth/LoginForm';
import DashboardPage from './pages/DashboardPage';
import POSPage from './pages/POSPage';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';
import SettingsPage from './pages/SettingsPage';
import TablesPage from './pages/TablesPage';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function AppContent() {
  const navigate = useNavigate();
  
  return (
    <AuthProvider navigate={navigate}>
      <ThemeProvider>
        <MenuProvider>
          <TableProvider>
            <OrderProvider>
              <Routes>
                <Route path="/login" element={<LoginForm />} />
                
                <Route path="/" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/pos" element={
                  <ProtectedRoute>
                    <POSPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/menu" element={
                  <ProtectedRoute>
                    <MenuPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/tables" element={
                  <ProtectedRoute>
                    <TablesPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </OrderProvider>
          </TableProvider>
        </MenuProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;