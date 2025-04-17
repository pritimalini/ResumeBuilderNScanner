'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Filter, Check, Star, Heart, Download, Eye, Sparkles } from 'lucide-react';

type Template = {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  category: string;
  features: string[];
  popular: boolean;
};

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favoriteTemplates, setFavoriteTemplates] = useState<string[]>([]);

  // Mock template data - in a real app, this would come from an API
  const templates: Template[] = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'A clean, traditional layout that works well for most industries.',
      previewUrl: '/professional-template.jpg',
      category: 'traditional',
      features: ['Clean layout', 'Traditional format', 'ATS-friendly', 'Suitable for most industries'],
      popular: true,
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'A contemporary design with a touch of color and modern typography.',
      previewUrl: '/modern-template.jpg',
      category: 'creative',
      features: ['Modern design', 'Subtle color accents', 'ATS-friendly', 'Good for creative fields'],
      popular: true,
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'An elegant, sophisticated layout for senior professionals.',
      previewUrl: '/executive-template.jpg',
      category: 'executive',
      features: ['Sophisticated layout', 'Emphasis on achievements', 'ATS-friendly', 'Ideal for executives'],
      popular: false,
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      description: 'A simple, clean design that focuses on content over style.',
      previewUrl: '/minimalist-template.jpg',
      category: 'minimal',
      features: ['Minimalist design', 'Maximum content space', 'Highly ATS-friendly', 'Works for all industries'],
      popular: true,
    },
    {
      id: 'technical',
      name: 'Technical',
      description: 'Designed specifically for technical roles with space for skills and projects.',
      previewUrl: '/technical-template.jpg',
      category: 'technical',
      features: ['Technical focus', 'Skills emphasis', 'Project showcase', 'Perfect for IT and engineering'],
      popular: false,
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'A bold, creative layout that stands out while remaining ATS-compatible.',
      previewUrl: '/creative-template.jpg',
      category: 'creative',
      features: ['Creative design', 'Bold colors', 'ATS-compatible', 'Perfect for design and marketing'],
      popular: false,
    },
  ];

  // Filter templates based on search query and category
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Categories for filter
  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'traditional', name: 'Traditional' },
    { id: 'creative', name: 'Creative' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'technical', name: 'Technical' },
    { id: 'executive', name: 'Executive' },
  ];

  const toggleFavorite = (id: string) => {
    setFavoriteTemplates(prev => 
      prev.includes(id) 
        ? prev.filter(templateId => templateId !== id)
        : [...prev, id]
    );
  };

  // Get gradient based on category
  const getCategoryGradient = (category: string) => {
    switch(category) {
      case 'traditional':
        return 'from-blue-600 to-blue-800';
      case 'creative':
        return 'from-purple-600 to-pink-600';
      case 'minimal':
        return 'from-gray-700 to-gray-900';
      case 'technical':
        return 'from-teal-600 to-blue-600';
      case 'executive':
        return 'from-indigo-600 to-blue-600';
      default:
        return 'from-blue-600 to-purple-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Professional Resume Templates
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Choose from our collection of expertly designed, ATS-optimized resume templates that help you stand out
            </p>
          </div>

          {/* Search and filter */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <div className="relative min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-blue-500" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Templates grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template, index) => {
              const isFavorite = favoriteTemplates.includes(template.id);
              const categoryGradient = getCategoryGradient(template.category);
              
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group"
                >
                  <div className={`relative h-72 bg-gradient-to-br ${categoryGradient} p-6 flex items-center justify-center`}>
                    {/* Category badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full text-gray-800 shadow-sm">
                      {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                    </div>
                    
                    {/* Favorite button */}
                    <button 
                      onClick={() => toggleFavorite(template.id)}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-gray-800 hover:text-red-500 transition-colors"
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                    
                    {/* In a real app, you would use actual template images */}
                    <div className="w-3/4 h-4/5 bg-white rounded-lg shadow-xl flex items-center justify-center">
                      <div className="text-gray-400 text-sm">Template Preview</div>
                    </div>
                    
                    {template.popular && (
                      <div className="absolute bottom-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-yellow-900" />
                        Popular Choice
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-12">
                      <div className="flex space-x-4">
                        <Link 
                          href={`/templates/${template.id}/preview`}
                          className="flex items-center justify-center bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full hover:bg-white transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Link>
                        <Link 
                          href={`/build?template=${template.id}`}
                          className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Use Template
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 flex items-center">
                      {template.name}
                      {template.popular && (
                        <span className="ml-2 text-yellow-500">
                          <Star className="h-4 w-4 fill-yellow-500" />
                        </span>
                      )}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">{template.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">Features:</h4>
                      <ul className="grid grid-cols-2 gap-y-1 gap-x-2">
                        {template.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Link 
                        href={`/templates/${template.id}/preview`}
                        className="flex-1 text-center px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Link>
                      <Link 
                        href={`/build?template=${template.id}`}
                        className={`flex-1 text-center px-4 py-2.5 text-white rounded-xl hover:shadow-md transition-all flex items-center justify-center bg-gradient-to-r ${categoryGradient}`}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Use Template
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-lg p-12 text-center mt-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No templates found</h2>
              <p className="text-gray-500 text-lg mb-6">
                We couldn't find any templates matching your criteria
              </p>
              <button 
                onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-shadow"
              >
                Clear filters
              </button>
            </motion.div>
          )}

          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 md:p-12 md:flex items-center">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Don't see what you're looking for?
                </h2>
                <p className="text-blue-100 text-lg">
                  We can help you create a custom template that matches your specific needs and preferences.
                </p>
              </div>
              <div className="md:w-1/3 md:text-right">
                <Link
                  href="/contact"
                  className="inline-block bg-white text-blue-600 font-medium px-6 py-3 rounded-xl hover:shadow-lg transition-shadow"
                >
                  Request Custom Template
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 