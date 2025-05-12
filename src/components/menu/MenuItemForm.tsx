import React, { useState, useEffect } from 'react';
import { MenuItem, Category } from '../../types';
import { useMenu } from '../../context/MenuContext';
import { X } from 'lucide-react';

interface MenuItemFormProps {
  item?: MenuItem;
  onSave: () => void;
  onCancel: () => void;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({ 
  item, 
  onSave, 
  onCancel 
}) => {
  const { categories, addMenuItem, updateMenuItem } = useMenu();
  
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    price: 0,
    category: '',
    image: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        price: item.price,
        category: item.category,
        image: item.image || '',
      });
    } else if (categories.length > 0) {
      // Set default category for new items
      setFormData(prev => ({ ...prev, category: categories[0].id }));
    }
  }, [item, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (item) {
      updateMenuItem(item.id, formData);
    } else {
      addMenuItem(formData);
    }
    
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {item ? 'Edit Menu Item' : 'Add Menu Item'}
          </h2>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL (optional)
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {item ? 'Update' : 'Add'} Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemForm;