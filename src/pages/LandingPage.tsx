import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { AboutSection } from '../components/landing/AboutSection';
import { TestimonialSection } from '../components/landing/TestimonialSection';
import { CategoryShowcase } from '../components/landing/CategoryShowcase';
import { ChatBot } from '../components/chat/ChatBot';
import { Footer } from '../components/common/Footer';

interface LandingPageProps {
  onGetStarted: () => void;
  onCategorySelect: (category: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onCategorySelect }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <HeroSection onGetStarted={onGetStarted} />
      <AboutSection />
      <CategoryShowcase onCategorySelect={onCategorySelect} />
      <TestimonialSection />
      <Footer />
      
      {/* Chatbot for landing page */}
      <ChatBot />
    </div>
  );
};