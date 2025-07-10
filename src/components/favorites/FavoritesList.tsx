import React from 'react';
import { Heart, X } from 'lucide-react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';
import { ProductCard } from '../common/ProductCard';
import { Product } from '../../types';

interface FavoritesListProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (product: Product) => void;
}

export const FavoritesList: React.FC<FavoritesListProps> = ({ isOpen, onClose, onProductClick }) => {
  const { getFavoriteProducts } = useFavorites();
  const { user } = useAuth();

  if (!isOpen || !user) return null;

  const favoriteProducts = getFavoriteProducts(user.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Heart className="text-red-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Favorites</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>

          {favoriteProducts.length === 0 ? (
            <div className="text-center py-12">
              <Heart size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">No favorites yet</p>
              <p className="text-gray-500 dark:text-gray-500">Start adding products to your favorites to see them here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={onProductClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};