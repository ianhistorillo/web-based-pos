import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { NavigateFunction } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    username: 'cashier',
    password: 'cashier123',
    name: 'Cashier User',
    role: 'cashier',
  },
];

interface AuthProviderProps {
  children: React.ReactNode;
  navigate: NavigateFunction;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, navigate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user on mount
    const savedUser = localStorage.getItem('posUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call
    const foundUser = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('posUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('posUser');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};