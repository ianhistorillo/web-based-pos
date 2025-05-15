export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: "admin" | "cashier";
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string | File;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string;
  createdBy: string;
  status: "pending" | "completed" | "canceled" | "unpaid";
  tableId?: string;
  paymentStatus: "unpaid" | "paid";
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: "available" | "occupied" | "reserved";
  currentOrderId?: string;
}
