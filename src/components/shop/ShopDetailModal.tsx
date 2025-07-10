import React, { useState } from 'react';
import { X, Star, MapPin, Phone, Mail, MessageSquare } from 'lucide-react';
import { Shop, Product, ShopComment } from '../../types';
import { products } from '../../data/mockData';
import { ProductCard } from '../common/ProductCard';

interface ShopDetailModalProps {
  shop: Shop | null;
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (product: Product) => void;
}

export const ShopDetailModal: React.FC<ShopDetailModalProps> = ({ 
  shop, 
  isOpen, 
  onClose, 
  onProductClick 
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'comments'>('products');

  if (!isOpen || !shop) return null;

  const shopProducts = products.filter(product => product.shopId === shop.id);

  // Mock comments for demonstration
  const mockComments: ShopComment[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Sarah Johnson',
      rating: 5,
      comment: 'Excellent service and quality products! Fast delivery and great customer support.',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      userId: '2',
      userName: 'Mike Chen',
      rating: 4,
      comment: 'Good variety of products. Prices are competitive and shipping was quick.',
      createdAt: new Date('2024-01-10')
    },
    {
      id: '3',
      userId: '3',
      userName: 'Emily Davis',
      rating: 5,
      comment: 'Love shopping from this store! Always fresh products and reliable service.',
      createdAt: new Date('2024-01-08')
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={shop.image}
                alt={shop.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{shop.name}</h2>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(shop.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {shop.rating} ({shop.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* Shop Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <MapPin size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{shop.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{shop.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{shop.email}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Products ({shopProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'comments'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <MessageSquare size={16} className="inline mr-2" />
              Comments ({mockComments.length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'products' && (
            <div>
              {shopProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {shopProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onProductClick={onProductClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">No products available from this shop.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-6">
              {mockComments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">{comment.userName}</h4>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < comment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {comment.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{comment.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};