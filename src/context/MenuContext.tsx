import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, Category } from '../types';

interface MenuContextType {
  menuItems: MenuItem[];
  categories: Category[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Sample initial data
const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Beverages', color: '#3B82F6' },
  { id: '2', name: 'Food', color: '#10B981' },
  { id: '3', name: 'Desserts', color: '#F97316' },
];

const INITIAL_MENU_ITEMS: MenuItem[] = [
  { id: '1', name: 'Coffee', price: 2.50, category: '1' },
  { id: '2', name: 'Tea', price: 2.00, category: '1' },
  { id: '3', name: 'Burger', price: 8.99, category: '2' },
  { id: '4', name: 'Pizza', price: 12.99, category: '2' },
  { id: '5', name: 'Ice Cream', price: 4.50, category: '3' },
];

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Load from localStorage or use initial data
    const savedMenuItems = localStorage.getItem('posMenuItems');
    const savedCategories = localStorage.getItem('posCategories');
    
    setMenuItems(savedMenuItems ? JSON.parse(savedMenuItems) : INITIAL_MENU_ITEMS);
    setCategories(savedCategories ? JSON.parse(savedCategories) : INITIAL_CATEGORIES);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (menuItems.length > 0) {
      localStorage.setItem('posMenuItems', JSON.stringify(menuItems));
    }
  }, [menuItems]);

  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('posCategories', JSON.stringify(categories));
    }
  }, [categories]);

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    setMenuItems([...menuItems, newItem]);
  };

  const updateMenuItem = (id: string, item: Partial<MenuItem>) => {
    setMenuItems(menuItems.map(mi => mi.id === id ? { ...mi, ...item } : mi));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: Date.now().toString() };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, category: Partial<Category>) => {
    setCategories(categories.map(c => c.id === id ? { ...c, ...category } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <MenuContext.Provider value={{
      menuItems,
      categories,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      addCategory,
      updateCategory,
      deleteCategory
    }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};