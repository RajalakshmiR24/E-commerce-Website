import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { LandingPage } from './pages/LandingPage';
import { EcommercePage } from './pages/EcommercePage';
import { AuthModal } from './components/auth/AuthModal';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

  const handleGetStarted = () => {
    if (user) {
      // User is already logged in, show ecommerce page
      setSelectedCategory('All Categories');
    } else {
      // User not logged in, show auth modal
      setShowAuth(true);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (user) {
      // User is logged in, they can browse products
      // The selected category will be passed to EcommercePage
    } else {
      // User not logged in, show auth modal
      setShowAuth(true);
    }
  };

  if (user) {
    return (
      <EcommercePage
        onAuthClick={() => setShowAuth(true)}
        selectedCategory={selectedCategory}
      />
    );
  }

  return (
    <>
      <LandingPage
        onGetStarted={handleGetStarted}
        onCategorySelect={handleCategorySelect}
      />
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        initialMode="login"
      />
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <FavoritesProvider>
              <AppContent />
            </FavoritesProvider>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;