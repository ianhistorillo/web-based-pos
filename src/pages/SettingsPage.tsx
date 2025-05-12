import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Save } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  
  const [receiptHeader, setReceiptHeader] = useState<string>('POS System');
  const [receiptFooter, setReceiptFooter] = useState<string>('Thank you for your business!');
  const [companyName, setCompanyName] = useState<string>('My Company');
  const [companyAddress, setCompanyAddress] = useState<string>('123 Main Street, City');
  const [companyPhone, setCompanyPhone] = useState<string>('(123) 456-7890');
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleSave = () => {
    // In a real app, this would save to a database or localStorage
    // This is a simplified version for demo purposes
    localStorage.setItem('posSettings', JSON.stringify({
      receiptHeader,
      receiptFooter,
      companyName,
      companyAddress,
      companyPhone,
    }));
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  if (user?.role !== 'admin') {
    return (
      <Layout title="Settings">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You don't have permission to access the settings page. Please contact an administrator.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Settings">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure your POS system</p>
        </div>
      </div>
      
      {saveSuccess && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Settings saved successfully.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-900">Company Information</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Company Address
            </label>
            <input
              type="text"
              id="companyAddress"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Company Phone
            </label>
            <input
              type="text"
              id="companyPhone"
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-900">Receipt Settings</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="receiptHeader" className="block text-sm font-medium text-gray-700 mb-1">
              Receipt Header
            </label>
            <input
              type="text"
              id="receiptHeader"
              value={receiptHeader}
              onChange={(e) => setReceiptHeader(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="receiptFooter" className="block text-sm font-medium text-gray-700 mb-1">
              Receipt Footer
            </label>
            <input
              type="text"
              id="receiptFooter"
              value={receiptFooter}
              onChange={(e) => setReceiptFooter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-right">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center ml-auto"
        >
          <Save className="h-4 w-4 mr-1.5" />
          Save Settings
        </button>
      </div>
    </Layout>
  );
};

export default SettingsPage;