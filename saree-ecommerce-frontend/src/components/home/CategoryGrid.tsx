import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI } from '../../services/api';

interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  image_url?: string;
}

const defaultCategories = [
  { name: 'Banarasi', image: '/sarees/saree1.jpg', slug: 'banarasi' },
  { name: 'Kanjivaram', image: '/sarees/saree2.jpg', slug: 'kanjivaram' },
  { name: 'Silk', image: '/sarees/saree3.jpg', slug: 'silk' },
  { name: 'Chiffon', image: '/sarees/saree4.jpg', slug: 'chiffon' },
  { name: 'Cotton', image: '/sarees/saree1.jpg', slug: 'cotton' },
  { name: 'View All', image: '/sarees/saree2.jpg', slug: '' },
];

const CategoryGrid = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryAPI.getCategories();
        if (data && data.length > 0) {
          // Take first 5 categories and add "View All"
          const displayCats = data.slice(0, 5).map((cat: Category) => ({
            ...cat,
            image: cat.image_url || cat.image || `/sarees/saree${Math.floor(Math.random() * 6) + 1}.jpg`,
          }));
          displayCats.push({
            id: 0,
            name: 'View All',
            slug: '',
            image: '/sarees/saree6.jpg',
          });
          setCategories(displayCats);
        } else {
          setCategories(defaultCategories as any);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories(defaultCategories as any);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Heading Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop By Category</h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
        </div>
        
        {/* Categories Grid/Scroll */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {displayCategories.map((category, index) => (
            <Link 
              to={`/products?category=${category.slug}`} 
              key={index} 
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2">
                <img 
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // Use local saree images as fallback
                    const sareeIndex = (index % 4) + 1;
                    target.src = `/sarees/saree${sareeIndex}.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;