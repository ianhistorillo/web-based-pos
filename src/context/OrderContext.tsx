import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderItem } from '../types';
import { useAuth } from './AuthContext';

interface OrderContextType {
  currentOrder: Order | null;
  orders: Order[];
  addItemToOrder: (item: Omit<OrderItem, 'id'>) => void;
  updateOrderItem: (id: string, quantity: number) => void;
  removeOrderItem: (id: string) => void;
  applyDiscount: (amount: number) => void;
  completeOrder: () => void;
  cancelOrder: () => void;
  createNewOrder: () => void;
  getOrderById: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load saved orders on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('posOrders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save orders whenever they change
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('posOrders', JSON.stringify(orders));
    }
  }, [orders]);

  // Create a new order on mount if none exists
  useEffect(() => {
    if (!currentOrder && user) {
      createNewOrder();
    }
  }, [user]);

  const createNewOrder = () => {
    if (!user) return;
    
    const newOrder: Order = {
      id: Date.now().toString(),
      items: [],
      subtotal: 0,
      discount: 0,
      total: 0,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      status: 'pending'
    };
    
    setCurrentOrder(newOrder);
  };

  const calculateTotals = (items: OrderItem[], discount: number) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = Math.max(0, subtotal - discount);
    return { subtotal, total };
  };

  const addItemToOrder = (item: Omit<OrderItem, 'id'>) => {
    if (!currentOrder) return;

    // Check if the item already exists in the order
    const existingItemIndex = currentOrder.items.findIndex(i => i.menuItemId === item.menuItemId);
    
    let updatedItems;
    if (existingItemIndex >= 0) {
      // Update quantity if already in order
      updatedItems = [...currentOrder.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + item.quantity
      };
    } else {
      // Add as new item
      const newItem = { ...item, id: Date.now().toString() };
      updatedItems = [...currentOrder.items, newItem];
    }

    const { subtotal, total } = calculateTotals(updatedItems, currentOrder.discount);
    
    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      subtotal,
      total
    });
  };

  const updateOrderItem = (id: string, quantity: number) => {
    if (!currentOrder) return;
    
    if (quantity <= 0) {
      removeOrderItem(id);
      return;
    }

    const updatedItems = currentOrder.items.map(item => 
      item.id === id ? { ...item, quantity } : item
    );

    const { subtotal, total } = calculateTotals(updatedItems, currentOrder.discount);
    
    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      subtotal,
      total
    });
  };

  const removeOrderItem = (id: string) => {
    if (!currentOrder) return;
    
    const updatedItems = currentOrder.items.filter(item => item.id !== id);
    const { subtotal, total } = calculateTotals(updatedItems, currentOrder.discount);
    
    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      subtotal,
      total
    });
  };

  const applyDiscount = (amount: number) => {
    if (!currentOrder) return;
    
    const { subtotal, total } = calculateTotals(currentOrder.items, amount);
    
    setCurrentOrder({
      ...currentOrder,
      discount: amount,
      total
    });
  };

  const completeOrder = () => {
    if (!currentOrder || currentOrder.items.length === 0) return;
    
    const completedOrder = {
      ...currentOrder,
      status: 'completed' as const
    };
    
    setOrders([...orders, completedOrder]);
    createNewOrder();
  };

  const cancelOrder = () => {
    if (!currentOrder) return;
    
    if (currentOrder.items.length > 0) {
      const canceledOrder = {
        ...currentOrder,
        status: 'canceled' as const
      };
      setOrders([...orders, canceledOrder]);
    }
    
    createNewOrder();
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  return (
    <OrderContext.Provider value={{
      currentOrder,
      orders,
      addItemToOrder,
      updateOrderItem,
      removeOrderItem,
      applyDiscount,
      completeOrder,
      cancelOrder,
      createNewOrder,
      getOrderById
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};