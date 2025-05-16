import React, { useState } from 'react';
import { MenuItem, Category, OrderItem } from '../../types';
import { useMenu } from '../../context/MenuContext';
import { Search } from 'lucide-react';

interface MenuSelectorProps {
  onSelectItem: (item: Omit<OrderItem, 'id'>) => void;
}

const MenuSelector: React.FC<MenuSelectorProps> = ({ onSelectItem }) => {
  const { menuItems, categories } = useMenu();
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleItemClick = (menuItem: MenuItem) => {
    onSelectItem({
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1
    });
  };

  const getCategoryById = (id: string) => {
    return categories.find(c => c.id === id);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
      
      <div className="flex overflow-x-auto py-2 px-3 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap mr-2 transition-colors ${
            activeCategory === 'all' 
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          onClick={() => setActiveCategory('all')}
        >
          All Items
        </button>
        
        {categories.map(category => (
          <button
            key={category.id}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap mr-2 transition-colors ${
              activeCategory === category.id
                ? `text-white`
                : `bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600`
            }`}
            style={{
              backgroundColor: activeCategory === category.id ? category.color : undefined,
            }}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => {
            const category = getCategoryById(item.category);
            const defaultImage = 'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image';
            
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden cursor-pointer transition-transform duration-200 hover:shadow-md hover:-translate-y-1"
                onClick={() => handleItemClick(item)}
              >
                <div 
                  className="h-24 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${item.image || defaultImage})`,
                    backgroundColor: category?.color || '#e2e8f0' 
                  }}
                />
                
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">{item.name}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-green-600 dark:text-green-400 font-semibold">₱{item.price.toFixed(2)}</p>
                    {category && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${category.color}20`,
                          color: category.color
                        }}
                      >
                        {category.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full flex items-center justify-center h-60">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No menu items found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuSelector;