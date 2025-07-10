import React, { createContext, useContext, useState, useEffect } from 'react';
import { FavoriteItem, Product } from '../types';
import { products } from '../data/mockData';

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (productId: string, userId: string) => void;
  removeFromFavorites: (productId: string, userId: string) => void;
  isFavorite: (productId: string, userId: string) => boolean;
  getFavoriteProducts: (userId: string) => Product[];
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (productId: string, userId: string) => {
    const newFavorite: FavoriteItem = {
      id: `fav-${Date.now()}`,
      userId,
      productId,
      addedAt: new Date()
    };
    setFavorites(prev => [...prev, newFavorite]);
  };

  const removeFromFavorites = (productId: string, userId: string) => {
    setFavorites(prev => prev.filter(fav => !(fav.productId === productId && fav.userId === userId)));
  };

  const isFavorite = (productId: string, userId: string) => {
    return favorites.some(fav => fav.productId === productId && fav.userId === userId);
  };

  const getFavoriteProducts = (userId: string): Product[] => {
    const userFavorites = favorites.filter(fav => fav.userId === userId);
    return userFavorites.map(fav => 
      products.find(product => product.id === fav.productId)
    ).filter(Boolean) as Product[];
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      getFavoriteProducts
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};