import React from 'react';
import { MapPin, Phone, Star, Eye } from 'lucide-react';
import { Shop } from '../../types';

interface ShopListProps {
  shops: Shop[];
  onShopSelect: (shop: Shop) => void;
  onShopDetails: (shop: Shop) => void;
}

export const ShopList: React.FC<ShopListProps> = ({ shops, onShopSelect, onShopDetails }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shops.map((shop) => (
        <div
          key={shop.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <img
            src={shop.image}
            alt={shop.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {shop.name}
            </h3>
            
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(shop.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {shop.rating} ({shop.reviews} reviews)
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="text-gray-400 mt-1" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {shop.address}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {shop.phone}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => onShopSelect(shop)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                View Products
              </button>
              <button
                onClick={() => onShopDetails(shop)}
                className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Eye size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};