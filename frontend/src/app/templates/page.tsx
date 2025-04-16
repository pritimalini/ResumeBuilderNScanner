'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Filter, Check } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Resume Templates</h1>
          <p className="text-gray-600 mb-8">
            Choose from our collection of professionally designed, ATS-optimized resume templates
          </p>

          {/* Search and filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Templates grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-64 bg-gray-200">
                  {/* In a real app, you would use actual template images */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    Template Preview Image
                  </div>
                  {template.popular && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Popular
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                  <p className="text-gray-600 mb-4">{template.description}</p>
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-500 mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {template.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-1" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex space-x-3">
                    <Link 
                      href={`/templates/${template.id}/preview`}
                      className="flex-1 text-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Preview
                    </Link>
                    <Link 
                      href={`/build?template=${template.id}`}
                      className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all"
                    >
                      Use Template
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No templates match your search criteria.</p>
              <button 
                onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}
                className="mt-4 px-4 py-2 text-blue-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 