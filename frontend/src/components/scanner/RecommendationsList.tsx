import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb, FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface RecommendationsListProps {
  recommendations: any;
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations }) => {
  const [expandedRecommendation, setExpandedRecommendation] = useState<number | null>(null);

  // Function to toggle recommendation expansion
  const toggleRecommendation = (index: number) => {
    if (expandedRecommendation === index) {
      setExpandedRecommendation(null);
    } else {
      setExpandedRecommendation(index);
    }
  };

  // Function to get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-success-50 text-success-700';
      case 'medium':
        return 'bg-warning-50 text-warning-700';
      case 'hard':
        return 'bg-danger-50 text-danger-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Function to format section name
  function formatSectionName(section: string): string {
    return section
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <div className="card">
      <div className="flex items-center mb-6">
        <FaLightbulb className="text-yellow-500 text-2xl mr-3" />
        <div>
          <h2 className="text-xl font-bold">Recommendations</h2>
          <p className="text-gray-600">
            Implementing these changes could increase your score by up to {Math.round(recommendations.potential_score_increase)} points.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.recommendations.map((recommendation: any, index: number) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border rounded-lg overflow-hidden"
          >
            <div 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleRecommendation(index)}
            >
              <div className="flex items-center">
                <div className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{recommendation.recommendation}</div>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500 mr-2">
                      Section: {formatSectionName(recommendation.section)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${getDifficultyColor(recommendation.implementation_difficulty)}`}>
                      {recommendation.implementation_difficulty.charAt(0).toUpperCase() + recommendation.implementation_difficulty.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      Impact: {Math.round(recommendation.impact * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              <div>
                {expandedRecommendation === index ? (
                  <FaChevronUp className="text-gray-400" />
                ) : (
                  <FaChevronDown className="text-gray-400" />
                )}
              </div>
            </div>
            
            {expandedRecommendation === index && (
              <div className="p-4 bg-gray-50 border-t">
                {(recommendation.before_example || recommendation.after_example) && (
                  <div className="grid md:grid-cols-2 gap-4 mt-2">
                    {recommendation.before_example && (
                      <div className="p-3 bg-white rounded border">
                        <div className="text-sm font-medium text-gray-500 mb-2">Before:</div>
                        <div className="text-sm">{recommendation.before_example}</div>
                      </div>
                    )}
                    
                    {recommendation.after_example && (
                      <div className="p-3 bg-white rounded border">
                        <div className="text-sm font-medium text-success-700 mb-2">After:</div>
                        <div className="text-sm">{recommendation.after_example}</div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    <strong>Why this matters:</strong> {
                      recommendation.section === 'summary' 
                        ? 'A strong summary section helps ATS systems quickly identify your qualifications and increases the chances of your resume being selected.' 
                        : recommendation.section === 'experience' 
                          ? 'Experience descriptions with relevant keywords and quantifiable achievements significantly improve ATS matching and demonstrate your value to employers.' 
                          : recommendation.section === 'skills' 
                            ? 'Including job-specific skills in a dedicated skills section ensures ATS systems can easily match your qualifications to job requirements.' 
                            : recommendation.section === 'education' 
                              ? 'Properly formatted education information helps ATS systems verify you meet the minimum educational requirements.' 
                              : recommendation.section === 'format' 
                                ? 'Clean, standard formatting ensures ATS systems can correctly parse your resume and extract all relevant information.' 
                                : 'This improvement will help your resume better match the job requirements and improve ATS compatibility.'
                    }
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsList;
