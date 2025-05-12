import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useMenu } from '../context/MenuContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import MenuItemForm from '../components/menu/MenuItemForm';
import CategoryForm from '../components/menu/CategoryForm';
import MenuItemCard from '../components/menu/MenuItemCard';

const MenuPage: React.FC = () => {
  const { menuItems, categories, deleteMenuItem, deleteCategory } = useMenu();
  
  const [showItemForm, setShowItemForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingItem, setEditingItem] = useState<typeof menuItems[0] | undefined>();
  const [editingCategory, setEditingCategory] = useState<typeof categories[0] | undefined>();
  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  
  const handleEditItem = (item: typeof menuItems[0]) => {
    setEditingItem(item);
    setShowItemForm(true);
  };
  
  const handleEditCategory = (category: typeof categories[0]) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };
  
  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteMenuItem(id);
    }
  };
  
  const handleDeleteCategory = (id: string) => {
    // Check if category has items
    const itemsInCategory = menuItems.filter(item => item.category === id).length;
    
    if (itemsInCategory > 0) {
      alert(`Unable to delete category. It contains ${itemsInCategory} items.`);
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
    }
  };
  
  const filteredItems = menuItems.filter(
    item => activeCategory === 'all' || item.category === activeCategory
  );
  
  const getCategoryById = (id: string) => {
    return categories.find(c => c.id === id);
  };

  return (
    <Layout title="Menu Management">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600">Manage your menu items and categories</p>
        </div>
        
        <div className="flex space-x-3">
          {activeTab === 'items' && (
            <button
              onClick={() => {
                setEditingItem(undefined);
                setShowItemForm(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Item
            </button>
          )}
          
          {activeTab === 'categories' && (
            <button
              onClick={() => {
                setEditingCategory(undefined);
                setShowCategoryForm(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Category
            </button>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('items')}
            className={`py-3 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'items'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Menu Items
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Categories
          </button>
        </div>
      </div>
      
      {activeTab === 'items' && (
        <>
          <div className="mb-6 flex overflow-x-auto py-2">
            <button
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap mr-2 transition-colors ${
                activeCategory === 'all' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                    : `bg-gray-100 text-gray-700 hover:bg-gray-200`
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
          
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  category={getCategoryById(item.category)}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 mb-4">No menu items found</p>
              <button
                onClick={() => {
                  setEditingItem(undefined);
                  setShowItemForm(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add your first menu item
              </button>
            </div>
          )}
        </>
      )}
      
      {activeTab === 'categories' && (
        <>
          {categories.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Color
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map(category => {
                    const itemCount = menuItems.filter(item => item.category === category.id).length;
                    
                    return (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div 
                            className="h-6 w-6 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{itemCount} items</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={itemCount > 0}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 mb-4">No categories found</p>
              <button
                onClick={() => {
                  setEditingCategory(undefined);
                  setShowCategoryForm(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add your first category
              </button>
            </div>
          )}
        </>
      )}
      
      {showItemForm && (
        <MenuItemForm
          item={editingItem}
          onSave={() => {
            setShowItemForm(false);
            setEditingItem(undefined);
          }}
          onCancel={() => {
            setShowItemForm(false);
            setEditingItem(undefined);
          }}
        />
      )}
      
      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          onSave={() => {
            setShowCategoryForm(false);
            setEditingCategory(undefined);
          }}
          onCancel={() => {
            setShowCategoryForm(false);
            setEditingCategory(undefined);
          }}
        />
      )}
    </Layout>
  );
};

export default MenuPage;