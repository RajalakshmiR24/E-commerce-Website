import React from 'react';
import { ArrowRight, ShoppingBag, Star, Truck, Shield, Clock } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 text-white py-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-300 opacity-10 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-pink-300 opacity-20 rounded-full animate-ping"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center bg-white bg-opacity-20 rounded-full px-6 py-2 mb-6 animate-fade-in">
              <Star className="text-yellow-300 fill-current mr-2" size={20} />
              <span className="text-sm font-medium">Trusted by 10,000+ customers</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-in">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                Abi Store
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-slide-in" style={{ animationDelay: '0.2s' }}>
              Your one-stop destination for quality products at unbeatable prices. 
              Discover amazing deals across all categories!
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4 mb-8 justify-center lg:justify-start">
              <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2 animate-bounce-in" style={{ animationDelay: '0.4s' }}>
                <Truck className="text-green-300 mr-2" size={20} />
                <span className="text-sm font-medium">Free Shipping Over ₹500</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2 animate-bounce-in" style={{ animationDelay: '0.6s' }}>
                <Shield className="text-blue-300 mr-2" size={20} />
                <span className="text-sm font-medium">Secure Payments</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2 animate-bounce-in" style={{ animationDelay: '0.8s' }}>
                <Clock className="text-yellow-300 mr-2" size={20} />
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-in" style={{ animationDelay: '1s' }}>
              <button
                onClick={onGetStarted}
                className="group bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <ShoppingBag size={20} />
                <span>Start Shopping</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
                Explore Categories
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 animate-fade-in" style={{ animationDelay: '1.2s' }}>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">50K+</div>
                <div className="text-sm text-blue-100">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-300">10K+</div>
                <div className="text-sm text-blue-100">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-300">500+</div>
                <div className="text-sm text-blue-100">Brands</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="relative">
              {/* Main Hero Image */}
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                <img
                  src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Shopping Experience"
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>

              {/* Floating Product Cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-lg p-3 shadow-lg animate-bounce">
                <div className="flex items-center space-x-2">
                  <img
                    src="https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Product"
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <div className="text-xs font-semibold text-gray-800">Office Chair</div>
                    <div className="text-xs text-green-600">₹299.99</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white rounded-lg p-3 shadow-lg animate-bounce" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center space-x-2">
                  <img
                    src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Product"
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <div className="text-xs font-semibold text-gray-800">Headphones</div>
                    <div className="text-xs text-green-600">₹199.99</div>
                  </div>
                </div>
              </div>

              {/* Discount Badge */}
              <div className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold animate-spin" style={{ animationDuration: '3s' }}>
                <div className="text-center">
                  <div className="text-xs">UP TO</div>
                  <div className="text-sm">50%</div>
                  <div className="text-xs">OFF</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};