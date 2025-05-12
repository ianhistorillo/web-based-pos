import React, { useState } from 'react';
import { Order } from '../../types';
import { useOrder } from '../../context/OrderContext';
import { Trash2, Minus, Plus, Printer, RefreshCw } from 'lucide-react';
import ReceiptModal from '../receipt/ReceiptModal';

const OrderSummary: React.FC = () => {
  const { 
    currentOrder, 
    updateOrderItem, 
    removeOrderItem, 
    applyDiscount, 
    completeOrder,
    cancelOrder,
    createNewOrder
  } = useOrder();
  
  const [discountAmount, setDiscountAmount] = useState('0');
  const [showReceipt, setShowReceipt] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!currentOrder) {
    return (
      <div className="h-full flex items-center justify-center">
        <button
          onClick={createNewOrder}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <RefreshCw className="h-4 w-4 mr-2 inline" />
          Create New Order
        </button>
      </div>
    );
  }

  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateOrderItem(id, newQuantity);
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountAmount(e.target.value);
  };

  const handleDiscountApply = () => {
    const amount = parseFloat(discountAmount) || 0;
    applyDiscount(amount);
  };

  const handleCompleteOrder = () => {
    if (currentOrder.items.length === 0) {
      return;
    }
    
    setCompletedOrder({...currentOrder});
    completeOrder();
    setShowReceipt(true);
  };

  return (
    <div className="h-full flex flex-col bg-white shadow-md rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Current Order</h2>
        <p className="text-sm text-gray-500">
          Order #{currentOrder.id.slice(-5)}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {currentOrder.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 text-gray-400">
            <ShoppingCart className="h-12 w-12 mb-2" />
            <p>No items in this order</p>
            <p className="text-sm">Select items from the menu</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {currentOrder.items.map(item => (
              <li key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="h-6 w-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                    >
                      <Minus className="h-3.5 w-3.5 text-gray-600" />
                    </button>
                    
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="h-6 w-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                    >
                      <Plus className="h-3.5 w-3.5 text-gray-600" />
                    </button>
                  </div>
                  
                  <div className="ml-4">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">₱{item.price.toFixed(2)} each</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="font-medium">
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeOrderItem(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-gray-200 p-4 space-y-4">
        <div>
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>₱{currentOrder.subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between mt-1 text-gray-700">
            <span>Discount</span>
            <span>-₱{currentOrder.discount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between mt-2 text-lg font-bold">
            <span>Total</span>
            <span>₱{currentOrder.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-3">
          <div className="flex">
            <input
              type="number"
              min="0"
              step="0.01"
              value={discountAmount}
              onChange={handleDiscountChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Discount amount"
            />
            <button
              onClick={handleDiscountApply}
              className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 text-gray-700 rounded-r-md hover:bg-gray-200 focus:outline-none"
            >
              Apply
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={handleCompleteOrder}
            disabled={currentOrder.items.length === 0}
            className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Complete Order
          </button>
          
          <button
            onClick={cancelOrder}
            className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancel Order
          </button>
        </div>
      </div>
      
      {showReceipt && completedOrder && (
        <ReceiptModal
          order={completedOrder}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};

const ShoppingCart: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={1.5} 
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
    />
  </svg>
);

export default OrderSummary;