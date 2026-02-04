import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI } from '../../services/api';

interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  image_url?: string;
}

const defaultCategories: Category[] = [
  { id: 1, name: 'Banarasi', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop', slug: 'banarasi' },
  { id: 2, name: 'Kanjivaram', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop', slug: 'kanjivaram' },
  { id: 3, name: 'Silk', image: 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=400&h=400&fit=crop', slug: 'silk' },
  { id: 4, name: 'Chiffon', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=400&fit=crop', slug: 'chiffon' },
  { id: 5, name: 'Cotton', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop', slug: 'cotton' },
  { id: 0, name: 'View All', image: 'https://images.unsplash.com/photo-1583391733981-8b530c004e14?w=400&h=400&fit=crop', slug: '' },
];

const placeholderImages = [
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=400&fit=crop',
];

const CategoryGrid = () => {
  // Initialize with default categories so something shows immediately
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryAPI.getCategories();
        if (data && data.length > 0) {
          // Take first 5 categories and add "View All"
          const displayCats = data.slice(0, 5).map((cat: Category, idx: number) => ({
            ...cat,
            image: cat.image_url || cat.image || placeholderImages[idx % placeholderImages.length],
          }));
          displayCats.push({
            id: 0,
            name: 'View All',
            slug: '',
            image: 'https://images.unsplash.com/photo-1583391733981-8b530c004e14?w=400&h=400&fit=crop',
          });
          setCategories(displayCats);
        }
        // If no data, keep using default categories (already set)
      } catch (error) {
        console.error('Error fetching categories, using defaults:', error);
        // Keep using default categories (already set)
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="mt-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Heading Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop By Category</h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
        </div>
        
        {/* Categories Grid/Scroll */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <Link 
              to={`/products?category=${category.slug}`} 
              key={index} 
              className="text-center group"
            >
              <div className="aspect-square rounded-xl overflow-hidden">
                <img 
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = placeholderImages[index % placeholderImages.length];
                  }}
                />
              </div>
              <p className="mt-2 font-medium">{category.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;