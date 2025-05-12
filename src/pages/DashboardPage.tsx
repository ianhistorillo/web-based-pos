import React from 'react';
import Layout from '../components/layout/Layout';
import { useOrder } from '../context/OrderContext';
import { useMenu } from '../context/MenuContext';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, ShoppingBag, Coffee, DollarSign, Clock } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { orders } = useOrder();
  const { menuItems, categories } = useMenu();
  const { user } = useAuth();

  // Calculate statistics
  const completedOrders = orders.filter(order => order.status === 'completed');
  const totalSales = completedOrders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = completedOrders.length > 0 
    ? totalSales / completedOrders.length 
    : 0;

  // Get recent orders
  const recentOrders = [...completedOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout title="Dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
        <p className="text-gray-600">Here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-blue-100">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Sales</h2>
              <p className="text-2xl font-bold text-gray-900">${totalSales.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-green-100">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Orders</h2>
              <p className="text-2xl font-bold text-gray-900">{completedOrders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-orange-100">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Avg. Order Value</h2>
              <p className="text-2xl font-bold text-gray-900">${averageOrderValue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-purple-100">
              <Coffee className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Menu Items</h2>
              <p className="text-2xl font-bold text-gray-900">{menuItems.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-medium text-gray-900">Recent Orders</h2>
            </div>
            
            <div className="p-3">
              {recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id.slice(-5)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 text-gray-400 mr-1" />
                              {formatDate(order.createdAt)}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                            ${order.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No orders completed yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-medium text-gray-900">Categories</h2>
            </div>
            
            <div className="p-6">
              {categories.length > 0 ? (
                <div className="space-y-4">
                  {categories.map(category => {
                    const itemsInCategory = menuItems.filter(item => item.category === category.id).length;
                    
                    return (
                      <div key={category.id} className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="flex-1 text-gray-900">{category.name}</span>
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          {itemsInCategory} items
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No categories defined yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;