import React from 'react';
import { MenuItem, Category } from '../../types';
import { Edit, Trash2 } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  category: Category | undefined;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  category,
  onEdit,
  onDelete
}) => {
  const defaultImage = 'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image';
  
  const imageUrl = typeof item.image === 'string' 
    ? item.image 
    : item.image instanceof File 
      ? URL.createObjectURL(item.image)
      : defaultImage;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:shadow-lg hover:-translate-y-1">
      <img
        src={imageUrl}
        alt={item.name}
        className="w-full h-40 object-cover"
        onError={(e) => {
          e.currentTarget.src = defaultImage;
        }}
      />
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white text-lg">{item.name}</h3>
            <p className="text-green-600 dark:text-green-400 font-semibold mt-1">
              ₱{item.price.toFixed(2)}
            </p>
          </div>
          
          {category && (
            <span 
              className="text-xs px-2 py-1 rounded-full" 
              style={{ 
                backgroundColor: `${category.color}20`, // 20% opacity
                color: category.color 
              }}
            >
              {category.name}
            </span>
          )}
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-150"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;