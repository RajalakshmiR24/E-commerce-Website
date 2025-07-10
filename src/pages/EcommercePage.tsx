import React, { useState, useMemo } from 'react';
import { Header } from '../components/common/Header';
import { ShopList } from '../components/shop/ShopList';
import { ShopDetailModal } from '../components/shop/ShopDetailModal';
import { ProductGrid } from '../components/products/ProductGrid';
import { ProductFilter } from '../components/products/ProductFilter';
import { ProductDetailModal } from '../components/products/ProductDetailModal';
import { CartSidebar } from '../components/cart/CartSidebar';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { PaymentModal } from '../components/checkout/PaymentModal';
import { OrderList } from '../components/orders/OrderList';
import { UserProfile } from '../components/profile/UserProfile';
import { CustomerChat } from '../components/chat/CustomerChat';
import { FavoritesList } from '../components/favorites/FavoritesList';
import { Footer } from '../components/common/Footer';
import { products, shops } from '../data/mockData';
import { Product, Shop, ShippingAddress } from '../types';
import { useCart } from '../contexts/CartContext';

interface EcommercePageProps {
  onAuthClick: () => void;
  selectedCategory?: string;
}

export const EcommercePage: React.FC<EcommercePageProps> = ({ onAuthClick, selectedCategory = 'All Categories' }) => {
  const [currentView, setCurrentView] = useState<'shops' | 'products'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isShopDetailOpen, setIsShopDetailOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState(selectedCategory);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState('featured');

  const { getTotalPrice } = useCart();

  const categories = ['All Categories', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (categoryFilter !== 'All Categories') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.shopName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [categoryFilter, searchQuery, priceRange, sortBy]);

  const handleCategoryClick = (category: string) => {
    setCategoryFilter(category);
    setCurrentView('products');
  };

  const handleShopSelect = (shop: Shop) => {
    // Filter products by shop
    const shopProducts = products.filter(p => p.shopId === shop.id);
    setSearchQuery('');
    setCategoryFilter('All Categories');
    setCurrentView('products');
    // You could also set a shop filter state here if needed
  };

  const handleShopDetails = (shop: Shop) => {
    setSelectedShop(shop);
    setIsShopDetailOpen(true);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handlePayment = (address: ShippingAddress, amount: number) => {
    setShippingAddress(address);
    setPaymentAmount(amount);
    setIsCheckoutOpen(false);
    setIsPaymentOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header
        onAuthClick={onAuthClick}
        onCartClick={() => setIsCartOpen(true)}
        onCategoryClick={handleCategoryClick}
        onOrdersClick={() => setIsOrdersOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        onChatClick={() => setIsChatOpen(true)}
        onFavoritesClick={() => setIsFavoritesOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentView('shops')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'shops'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              All Shops
            </button>
            <button
              onClick={() => setCurrentView('products')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'products'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              All Products
            </button>
          </div>
        </div>

        {currentView === 'shops' ? (
          <ShopList 
            shops={shops} 
            onShopSelect={handleShopSelect}
            onShopDetails={handleShopDetails}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <ProductFilter
                categories={categories}
                selectedCategory={categoryFilter}
                onCategoryChange={setCategoryFilter}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                sortBy={sortBy}
                onSortChange={setSortBy}
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(!isFilterOpen)}
              />
            </div>
            <div className="lg:col-span-3">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Products ({filteredProducts.length})
                </h2>
              </div>
              <ProductGrid
                products={filteredProducts}
                onProductClick={handleProductClick}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Modals */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <ShopDetailModal
        shop={selectedShop}
        isOpen={isShopDetailOpen}
        onClose={() => {
          setIsShopDetailOpen(false);
          setSelectedShop(null);
        }}
        onProductClick={handleProductClick}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      <CheckoutForm
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onPayment={handlePayment}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={paymentAmount}
        shippingAddress={shippingAddress}
      />

      <OrderList
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <CustomerChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      <FavoritesList
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        onProductClick={handleProductClick}
      />
    </div>
  );
};