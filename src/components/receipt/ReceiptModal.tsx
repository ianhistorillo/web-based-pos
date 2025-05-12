import React, { useRef } from 'react';
import { Order } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { X, Printer } from 'lucide-react';

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  const { user } = useAuth();
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = () => {
    const receiptContent = receiptRef.current;
    if (!receiptContent) return;
    
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = receiptContent.innerHTML;
    
    window.print();
    
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Receipt</h2>
          <div className="flex space-x-3">
            <button 
              onClick={handlePrint} 
              className="text-gray-600 hover:text-blue-600"
            >
              <Printer className="h-5 w-5" />
            </button>
            <button 
              onClick={onClose} 
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div ref={receiptRef} className="p-6 print:p-0">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold">POS System</h1>
            <p className="text-gray-600">123 Main Street</p>
            <p className="text-gray-600">City, State 12345</p>
            <p className="text-gray-600">Tel: (123) 456-7890</p>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Order #:</span>
              <span>{order.id.slice(-5)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date:</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cashier:</span>
              <span>{user?.name || 'Staff'}</span>
            </div>
          </div>
          
          <div className="border-t border-b border-gray-200 py-4 mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Item</th>
                  <th className="text-center py-2">Qty</th>
                  <th className="text-center py-2">Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2">{item.name}</td>
                    <td className="text-center py-2">{item.quantity}</td>
                    <td className="text-center py-2">₱{item.price.toFixed(2)}</td>
                    <td className="text-right py-2">₱{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Subtotal:</span>
              <span>₱{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Discount:</span>
              <span>-₱{order.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2 mt-2">
              <span>Total:</span>
              <span>₱{order.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="text-center text-gray-500 text-sm mt-6">
            <p>Thank you for your business!</p>
            <p>Please come again</p>
          </div>
        </div>
        
        <div className="border-t p-4 text-right print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;