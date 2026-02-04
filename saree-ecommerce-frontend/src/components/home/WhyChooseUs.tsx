import React, { useState, useEffect } from 'react';
import { Truck, Shield, RotateCcw, CreditCard, Headphones, Award } from 'lucide-react';
import { settingsAPI } from '../../services/api';

interface TrustBadge {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const defaultBadges: TrustBadge[] = [
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'Free Shipping',
    description: 'On orders above ₹999',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: '100% Secure',
    description: 'Safe & secure checkout',
  },
  {
    icon: <RotateCcw className="w-8 h-8" />,
    title: 'Easy Returns',
    description: '7-day return policy',
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: 'COD Available',
    description: 'Pay on delivery',
  },
  {
    icon: <Headphones className="w-8 h-8" />,
    title: '24/7 Support',
    description: 'Dedicated support team',
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: 'Quality Assured',
    description: 'Premium quality products',
  },
];

const WhyChooseUs: React.FC = () => {
  const [sectionTitle, setSectionTitle] = useState<string>('Why Choose Us');
  const [badges] = useState<TrustBadge[]>(defaultBadges);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await settingsAPI.getSettings();
        if (settings.why_choose_us_title) {
          setSectionTitle(settings.why_choose_us_title);
        }
        // Future: Extend to fetch custom badges from settings
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <section className="mt-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            We're committed to providing you with the best shopping experience
          </p>
        </div>

        {/* Trust Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-4">
                {badge.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                {badge.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-500">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
