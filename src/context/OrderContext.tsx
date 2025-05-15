import React, { createContext, useContext, useState, useEffect } from "react";
import { Order, OrderItem } from "../types";
import { useAuth } from "./AuthContext";
import { useTable } from "./TableContext";

interface OrderContextType {
  currentOrder: Order | null;
  orders: Order[];
  addItemToOrder: (item: Omit<OrderItem, "id">) => void;
  updateOrderItem: (id: string, quantity: number) => void;
  removeOrderItem: (id: string) => void;
  applyDiscount: (amount: number) => void;
  completeOrder: (payNow: boolean) => void;
  cancelOrder: () => void;
  createNewOrder: (tableId?: string) => void;
  getOrderById: (id: string) => Order | undefined;
  setTableForOrder: (tableId: string) => void;
  payOrder: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { updateTable } = useTable();
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem("posOrders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem("posOrders", JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (!currentOrder && user) {
      createNewOrder();
    }
  }, [user]);

  const createNewOrder = (tableId?: string) => {
    if (!user) return;

    const newOrder: Order = {
      id: Date.now().toString(),
      items: [],
      subtotal: 0,
      discount: 0,
      total: 0,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      status: "pending",
      paymentStatus: "unpaid",
      tableId,
    };

    setCurrentOrder(newOrder);

    if (tableId) {
      updateTable(tableId, { status: "occupied", currentOrderId: newOrder.id });
    }
  };

  const calculateTotals = (items: OrderItem[], discount: number) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total = Math.max(0, subtotal - discount);
    return { subtotal, total };
  };

  const addItemToOrder = (item: Omit<OrderItem, "id">) => {
    if (!currentOrder) return;

    const existingItemIndex = currentOrder.items.findIndex(
      (i) => i.menuItemId === item.menuItemId
    );

    let updatedItems;
    if (existingItemIndex >= 0) {
      updatedItems = [...currentOrder.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + item.quantity,
      };
    } else {
      const newItem = { ...item, id: Date.now().toString() };
      updatedItems = [...currentOrder.items, newItem];
    }

    const { subtotal, total } = calculateTotals(
      updatedItems,
      currentOrder.discount
    );

    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      subtotal,
      total,
    });
  };

  const updateOrderItem = (id: string, quantity: number) => {
    if (!currentOrder) return;

    if (quantity <= 0) {
      removeOrderItem(id);
      return;
    }

    const updatedItems = currentOrder.items.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );

    const { subtotal, total } = calculateTotals(
      updatedItems,
      currentOrder.discount
    );

    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      subtotal,
      total,
    });
  };

  const removeOrderItem = (id: string) => {
    if (!currentOrder) return;

    const updatedItems = currentOrder.items.filter((item) => item.id !== id);
    const { subtotal, total } = calculateTotals(
      updatedItems,
      currentOrder.discount
    );

    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      subtotal,
      total,
    });
  };

  const applyDiscount = (amount: number) => {
    if (!currentOrder) return;

    const { subtotal, total } = calculateTotals(currentOrder.items, amount);

    setCurrentOrder({
      ...currentOrder,
      discount: amount,
      total,
    });
  };

  const completeOrder = (payNow: boolean) => {
    if (!currentOrder || currentOrder.items.length === 0) return;

    const completedOrder = {
      ...currentOrder,
      status: payNow ? "completed" : "unpaid",
      paymentStatus: payNow ? "paid" : "unpaid",
    };

    setOrders([...orders, completedOrder]);

    // Only free up the table if paying now
    if (payNow && completedOrder.tableId) {
      updateTable(completedOrder.tableId, {
        status: "available",
        currentOrderId: undefined,
      });
    }

    // Create a new order without a table assigned
    createNewOrder();
  };

  const cancelOrder = () => {
    if (!currentOrder) return;

    if (currentOrder.items.length > 0) {
      const canceledOrder = {
        ...currentOrder,
        status: "canceled",
        paymentStatus: "unpaid",
      };
      setOrders([...orders, canceledOrder]);

      if (canceledOrder.tableId) {
        updateTable(canceledOrder.tableId, {
          status: "available",
          currentOrderId: undefined,
        });
      }
    }

    createNewOrder();
  };

  const setTableForOrder = (tableId: string) => {
    if (!currentOrder) return;

    setCurrentOrder({
      ...currentOrder,
      tableId,
    });

    updateTable(tableId, {
      status: "occupied",
      currentOrderId: currentOrder.id,
    });
  };

  const payOrder = (orderId: string) => {
    const orderToUpdate = orders.find((order) => order.id === orderId);
    if (!orderToUpdate) return;

    // Update table status first
    if (orderToUpdate.tableId) {
      updateTable(orderToUpdate.tableId, {
        status: "available",
        currentOrderId: undefined,
      });
    }

    // Then update the order
    setOrders(
      orders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: "completed",
            paymentStatus: "paid",
          };
        }
        return order;
      })
    );
  };

  const getOrderById = (id: string) => {
    return orders.find((order) => order.id === id);
  };

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        orders,
        addItemToOrder,
        updateOrderItem,
        removeOrderItem,
        applyDiscount,
        completeOrder,
        cancelOrder,
        createNewOrder,
        getOrderById,
        setTableForOrder,
        payOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
