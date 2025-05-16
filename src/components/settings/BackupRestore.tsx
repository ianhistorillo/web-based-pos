import React, { useRef } from 'react';
import { Download, Upload, AlertTriangle } from 'lucide-react';

const BackupRestore: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAllData = () => {
    const data = {
      orders: localStorage.getItem('posOrders'),
      tables: localStorage.getItem('posTables'),
      menuItems: localStorage.getItem('posMenuItems'),
      categories: localStorage.getItem('posCategories'),
      settings: localStorage.getItem('posSettings'),
    };
    return data;
  };

  const handleExport = () => {
    const data = getAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pos-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate data structure
        const requiredKeys = ['orders', 'tables', 'menuItems', 'categories', 'settings'];
        const hasAllKeys = requiredKeys.every(key => key in data);
        
        if (!hasAllKeys) {
          throw new Error('Invalid backup file format');
        }

        // Import data
        Object.entries(data).forEach(([key, value]) => {
          if (value) {
            localStorage.setItem(`pos${key.charAt(0).toUpperCase() + key.slice(1)}`, value as string);
          }
        });

        alert('Data imported successfully! Please refresh the page to see the changes.');
      } catch (error) {
        alert('Error importing data. Please make sure the file is a valid POS backup.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-medium text-gray-900 dark:text-white">Backup & Restore</h2>
      </div>
      
      <div className="p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                Make sure to backup your data regularly. Importing data will overwrite existing data.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </button>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupRestore;
