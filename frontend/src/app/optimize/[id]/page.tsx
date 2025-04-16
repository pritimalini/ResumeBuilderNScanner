'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Edit,
  Download,
  Lightbulb,
  Copy,
  Zap,
  ChevronDown,
  ChevronUp,
  Maximize2,
  CheckSquare,
  MoveRight,
  BriefcaseIcon,
} from 'lucide-react';
import Link from 'next/link';
import { jobService } from '@/services/jobService';
import { JobPosting } from '@/types/job';

interface OptimizationSuggestion {
  section: 'summary' | 'experience' | 'skills' | 'education';
  original: string;
  suggestion: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

interface KeywordSuggestion {
  keyword: string;
  context: string;
  priority: 'high' | 'medium' | 'low';
}

interface FormatSuggestion {
  type: 'layout' | 'font' | 'spacing' | 'structure';
  suggestion: string;
  reason: string;
}

interface OptimizeResult {
  jobId: string;
  resumeId: string;
  currentScore: number;
  potentialScore: number;
  contentSuggestions: OptimizationSuggestion[];
  keywordSuggestions: KeywordSuggestion[];
  formatSuggestions: FormatSuggestion[];
  generalTips: string[];
}

export default function OptimizeResumePage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<JobPosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [optimizeResult, setOptimizeResult] = useState<OptimizeResult | null>(null);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    content: true,
    keywords: false,
    format: false,
    tips: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch job details
        const jobData = await jobService.getJobById(jobId);
        if (!jobData) {
          setError('Job not found');
          setIsLoading(false);
          return;
        }
        setJob(jobData);
        
        // Simulate API delay for optimization results
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real application, you would fetch real optimization data
        // const response = await fetch(`/api/optimize?jobId=${jobId}`);
        // const data = await response.json();
        
        // For now, use mock data
        const mockOptimizeResult: OptimizeResult = {
          jobId,
          resumeId: 'resume123',
          currentScore: 72,
          potentialScore: 95,
          contentSuggestions: [
            {
              section: 'summary',
              original: "Results-driven web developer with 5 years of experience in building responsive web applications.",
              suggestion: "Results-driven frontend developer with 5 years of experience in building responsive React applications, specializing in TypeScript and Redux for state management.",
              reason: "The job specifically mentions React, TypeScript, and Redux as key requirements.",
              priority: 'high'
            },
            {
              section: 'experience',
              original: "Developed web applications using JavaScript and various frameworks.",
              suggestion: "Developed performant, responsive web applications using React, TypeScript, and Redux, with a focus on component reusability and state management.",
              reason: "Being specific about the technologies mentioned in the job description increases your match score.",
              priority: 'high'
            },
            {
              section: 'skills',
              original: "JavaScript, HTML, CSS, React",
              suggestion: "React, TypeScript, Redux, NextJS, Tailwind CSS, JavaScript, HTML, CSS",
              reason: "Reordering skills to prioritize the ones mentioned in the job description and adding missing skills that you have.",
              priority: 'medium'
            }
          ],
          keywordSuggestions: [
            {
              keyword: "Component reusability",
              context: "Mention how you've implemented reusable components in your experience section",
              priority: 'high'
            },
            {
              keyword: "Performance optimization",
              context: "Add examples of how you've optimized React application performance",
              priority: 'medium'
            },
            {
              keyword: "Responsive design",
              context: "Emphasize your experience with responsive design principles",
              priority: 'medium'
            }
          ],
          formatSuggestions: [
            {
              type: 'layout',
              suggestion: "Use a single-column layout for better ATS readability",
              reason: "Many ATS systems struggle with multi-column layouts and may miss important information"
            },
            {
              type: 'font',
              suggestion: "Use standard fonts like Arial, Calibri, or Times New Roman",
              reason: "Non-standard fonts may not render properly in ATS systems"
            },
            {
              type: 'structure',
              suggestion: "Use clear section headings that match traditional resume categories",
              reason: "ATS systems are trained to recognize standard section headings"
            }
          ],
          generalTips: [
            "Keep your resume to 1-2 pages maximum",
            "Avoid using tables, headers, footers, and images",
            "Use standard section headings (Experience, Education, Skills)",
            "Save your final resume as a PDF to preserve formatting"
          ]
        };
        
        setOptimizeResult(mockOptimizeResult);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load optimization data. Please try again later.');
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">High Priority</span>;
      case 'medium':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Medium Priority</span>;
      case 'low':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Low Priority</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Analyzing Your Resume</h2>
        <p className="text-gray-600">
          We're finding ways to optimize your resume for this job...
        </p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">{error || 'Job not found'}</h1>
        <p className="mb-6">The job you're looking for might have been removed or doesn't exist.</p>
        <Link href="/jobs">
          <span className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <ArrowLeft size={16} className="mr-2" />
            Back to Jobs
          </span>
        </Link>
      </div>
    );
  }

  if (!optimizeResult) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">No optimization data available</h1>
        <p className="mb-6">We couldn't generate optimization suggestions for this job.</p>
        <Link href={`/jobs/${jobId}`}>
          <span className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <ArrowLeft size={16} className="mr-2" />
            Back to Job Details
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href={`/jobs/${jobId}`}>
        <span className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft size={16} className="mr-1" />
          Back to Job Details
        </span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Resume Optimization</h1>
              <div className="flex items-start">
                <BriefcaseIcon size={18} className="text-gray-600 mr-2 mt-1" />
                <span className="text-gray-700">{job.title} at {job.company}</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-500 mb-1">Potential ATS Score</div>
              <div className="text-3xl font-bold text-blue-600">{optimizeResult.currentScore}% <span className="text-xl text-green-500">→ {optimizeResult.potentialScore}%</span></div>
              <div className="text-xs text-gray-500 mt-1">after applying suggestions</div>
            </div>
          </div>
          
          <div className="text-gray-700 mb-8">
            Follow these tailored suggestions to optimize your resume for this specific job position.
            These changes can significantly increase your chances of getting past automated screening systems and catching the recruiter's attention.
          </div>

          {/* Content Suggestions Section */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('content')}
              className="flex items-center justify-between w-full p-4 bg-blue-50 text-left"
            >
              <div className="flex items-center font-semibold text-blue-800">
                <Edit size={18} className="mr-2" />
                <span>Content Improvement Suggestions</span>
              </div>
              {expandedSections.content ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {expandedSections.content && (
              <div className="p-4">
                <p className="text-gray-600 mb-4">
                  These suggestions will help tailor your resume content specifically to this job description:
                </p>
                
                <div className="space-y-6">
                  {optimizeResult.contentSuggestions.map((suggestion, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold capitalize">{suggestion.section} Section</h3>
                        {getPriorityBadge(suggestion.priority)}
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-sm text-gray-500 mb-1">Original:</div>
                        <div className="p-3 bg-gray-50 rounded-md text-gray-700">{suggestion.original}</div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-sm text-gray-500 mb-1">Suggested Change:</div>
                        <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-md text-gray-700">
                          {suggestion.suggestion}
                          <button 
                            className="ml-2 p-1 text-gray-400 hover:text-gray-600" 
                            title="Copy to clipboard"
                            onClick={() => navigator.clipboard.writeText(suggestion.suggestion)}
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Why this works:</div>
                        <div className="flex items-start">
                          <Lightbulb size={16} className="text-yellow-500 mr-2 mt-1" />
                          <span className="text-gray-600">{suggestion.reason}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Keyword Suggestions Section */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('keywords')}
              className="flex items-center justify-between w-full p-4 bg-yellow-50 text-left"
            >
              <div className="flex items-center font-semibold text-yellow-800">
                <Zap size={18} className="mr-2" />
                <span>Keyword Optimization</span>
              </div>
              {expandedSections.keywords ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {expandedSections.keywords && (
              <div className="p-4">
                <p className="text-gray-600 mb-4">
                  Include these keywords in your resume to better match the job requirements:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {optimizeResult.keywordSuggestions.map((keyword, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{keyword.keyword}</h3>
                        {getPriorityBadge(keyword.priority)}
                      </div>
                      
                      <div className="flex items-start">
                        <CheckSquare size={16} className="text-blue-500 mr-2 mt-1" />
                        <span className="text-gray-600">{keyword.context}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Format Suggestions Section */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('format')}
              className="flex items-center justify-between w-full p-4 bg-purple-50 text-left"
            >
              <div className="flex items-center font-semibold text-purple-800">
                <Maximize2 size={18} className="mr-2" />
                <span>Format & Structure Suggestions</span>
              </div>
              {expandedSections.format ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {expandedSections.format && (
              <div className="p-4">
                <p className="text-gray-600 mb-4">
                  Optimize your resume format for better readability and ATS compatibility:
                </p>
                
                <div className="space-y-4">
                  {optimizeResult.formatSuggestions.map((suggestion, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <h3 className="font-semibold capitalize">{suggestion.type}</h3>
                      </div>
                      
                      <div className="mb-2 p-3 bg-purple-50 rounded-md text-gray-700">
                        {suggestion.suggestion}
                      </div>
                      
                      <div className="flex items-start">
                        <Lightbulb size={16} className="text-yellow-500 mr-2 mt-1" />
                        <span className="text-gray-600">{suggestion.reason}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* General Tips Section */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('tips')}
              className="flex items-center justify-between w-full p-4 bg-gray-50 text-left"
            >
              <div className="flex items-center font-semibold text-gray-800">
                <AlertTriangle size={18} className="mr-2" />
                <span>General ATS Tips</span>
              </div>
              {expandedSections.tips ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {expandedSections.tips && (
              <div className="p-4">
                <p className="text-gray-600 mb-4">
                  Follow these general best practices for ATS-friendly resumes:
                </p>
                
                <ul className="space-y-2">
                  {optimizeResult.generalTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-1" />
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href={`/resume-builder?job=${jobId}`} className="flex-1">
              <span className="flex justify-center items-center py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium w-full">
                Apply Changes in Resume Builder
                <MoveRight size={18} className="ml-2" />
              </span>
            </Link>
            <button
              onClick={() => window.print()}
              className="flex-1 flex justify-center items-center py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-medium"
            >
              <Download size={18} className="mr-2" />
              Download Suggestions as PDF
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 