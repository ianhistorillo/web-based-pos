import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import { useMenu } from '../../context/MenuContext';
import { X } from 'lucide-react';

interface CategoryFormProps {
  category?: Category;
  onSave: () => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSave,
  onCancel
}) => {
  const { addCategory, updateCategory } = useMenu();
  
  const [formData, setFormData] = useState<Omit<Category, 'id'>>({
    name: '',
    color: '#3B82F6', // Default blue
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        color: category.color,
      });
    }
  }, [category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (category) {
      updateCategory(category.id, formData);
    } else {
      addCategory(formData);
    }
    
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {category ? 'Edit Category' : 'Add Category'}
          </h2>
          <button 
            onClick={onCancel}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Color
            </label>
            <div className="flex items-center">
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-10 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
              />
              <input
                type="text"
                value={formData.color}
                onChange={handleChange}
                name="color"
                className="ml-3 flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {category ? 'Update' : 'Add'} Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;