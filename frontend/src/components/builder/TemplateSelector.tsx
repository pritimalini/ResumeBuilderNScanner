import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
}

interface TemplateSelectorProps {
  onSelect: (templateId: string) => void;
  defaultValue?: string;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect, defaultValue }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(defaultValue || '');
  
  // Sample templates - in a real app, these would come from an API
  const templates: Template[] = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'A clean, traditional layout that works well for most industries.',
      image: '/templates/professional.png',
      features: ['Clean layout', 'Traditional format', 'ATS-friendly', 'Suitable for most industries']
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'A contemporary design with a touch of color and modern typography.',
      image: '/templates/modern.png',
      features: ['Modern design', 'Subtle color accents', 'ATS-friendly', 'Good for creative fields']
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'An elegant, sophisticated layout for senior professionals.',
      image: '/templates/executive.png',
      features: ['Sophisticated layout', 'Emphasis on achievements', 'ATS-friendly', 'Ideal for executives']
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      description: 'A simple, clean design that focuses on content over style.',
      image: '/templates/minimalist.png',
      features: ['Minimalist design', 'Maximum content space', 'Highly ATS-friendly', 'Works for all industries']
    },
    {
      id: 'technical',
      name: 'Technical',
      description: 'Designed specifically for technical roles with space for skills and projects.',
      image: '/templates/technical.png',
      features: ['Technical focus', 'Skills emphasis', 'Project showcase', 'Perfect for IT and engineering']
    }
  ];

  const handleSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    onSelect(templateId);
  };

  return (
    <div className="space-y-8">
      <div className="card">
        <h3 className="text-lg font-medium mb-4">Choose a Resume Template</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                selectedTemplate === template.id 
                  ? 'border-primary-500 ring-2 ring-primary-200' 
                  : 'border-gray-200 hover:border-primary-200'
              }`}
              onClick={() => handleSelect(template.id)}
            >
              <div className="relative h-48 bg-gray-100">
                {/* In a real app, replace with actual template preview images */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  {template.name} Template Preview
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{template.name}</h4>
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    selectedTemplate === template.id 
                      ? 'border-primary-500 bg-primary-500' 
                      : 'border-gray-300'
                  }`}>
                    {selectedTemplate === template.id && (
                      <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-secondary-600 mb-3">{template.description}</p>
                
                <div className="space-y-1">
                  {template.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-secondary-700">
                      <svg className="w-3 h-3 text-success-500 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onSelect(selectedTemplate)}
          className="btn btn-success"
          disabled={!selectedTemplate}
        >
          Continue with {selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.name : 'Selected'} Template
        </button>
      </div>
    </div>
  );
};

export default TemplateSelector;
