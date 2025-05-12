export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'cashier';
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
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
  status: 'pending' | 'completed' | 'canceled';
}

export interface Category {
  id: string;
  name: string;
  color: string;
}