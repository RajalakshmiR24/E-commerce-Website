import React from 'react';
import { Shield, Truck, Clock, Heart, Award, Users, Globe, Zap } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: 'Your data and payments are protected with enterprise-grade security',
      color: 'bg-blue-500',
      delay: '0s'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Get your orders delivered quickly with our reliable shipping partners',
      color: 'bg-green-500',
      delay: '0.2s'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Our customer support team is available round the clock to help you',
      color: 'bg-purple-500',
      delay: '0.4s'
    },
    {
      icon: Heart,
      title: 'Quality Guarantee',
      description: 'We ensure all products meet our high quality standards',
      color: 'bg-red-500',
      delay: '0.6s'
    }
  ];

  const stats = [
    { icon: Users, number: '50,000+', label: 'Happy Customers', color: 'text-blue-600' },
    { icon: Award, number: '10,000+', label: 'Products Sold', color: 'text-green-600' },
    { icon: Globe, number: '500+', label: 'Cities Covered', color: 'text-purple-600' },
    { icon: Zap, number: '99.9%', label: 'Uptime', color: 'text-orange-600' }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400 to-purple-600"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900 rounded-full px-6 py-2 mb-4">
            <Heart className="text-blue-600 dark:text-blue-400 mr-2" size={20} />
            <span className="text-blue-600 dark:text-blue-400 font-medium">Why Choose Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Why Choose{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Abi Store?
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We're committed to providing you with the best shopping experience possible. 
            Here's what makes us different from the rest.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-slide-in"
              style={{ animationDelay: feature.delay }}
            >
              <div className={`${feature.color} rounded-2xl p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Our Success in Numbers
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              These numbers speak for our commitment to excellence
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group animate-bounce-in"
                style={{ animationDelay: `${1 + index * 0.2}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className={stat.color} size={28} />
                </div>
                <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '1.4s' }}>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Shopping?
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and discover amazing products at unbeatable prices.
            </p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              Explore Products Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};