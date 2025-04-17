"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  BarChart, 
  FileText, 
  User,
  Calendar,
  BookOpen,
  Briefcase,
  Code,
  ArrowUpRight,
  Download,
  Sparkles,
  Info
} from 'lucide-react';

// Define types for our analysis data
interface SectionScore {
  score: number;
  feedback: string;
}

interface KeywordMatch {
  keyword: string;
  found: boolean;
  importance: string;
  context: string;
}

interface Recommendation {
  section: string;
  recommendation: string;
  impact: string;
  difficulty: string;
}

interface ResumeAnalysis {
  id: string;
  resumeId: string;
  overallScore: number;
  contentMatchScore: number;
  formatCompatibilityScore: number;
  sectionEvaluationScore: number;
  sectionScores: {
    [key: string]: SectionScore;
  };
  keywordMatches: KeywordMatch[];
  recommendations: Recommendation[];
  createdAt: string;
}

export default function ScorePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const analysisId = searchParams.get('analysisId');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [resumeTitle, setResumeTitle] = useState('Your Resume');

  // Fetch analysis data
  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!analysisId) {
        setError('No analysis ID provided');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        // Fetch analysis from API
        const response = await fetch(`/api/resume-analyses/${analysisId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch analysis');
        }
        
        const data = await response.json();
        setAnalysis(data.analysis);
        
        // If we have a resume title, fetch it
        if (data.analysis.resumeId) {
          const resumeResponse = await fetch(`/api/resumes/${data.analysis.resumeId}`);
          if (resumeResponse.ok) {
            const resumeData = await resumeResponse.json();
            setResumeTitle(resumeData.resume.title || 'Your Resume');
          }
        }
      } catch (error) {
        console.error('Error fetching analysis:', error);
        setError('Failed to load analysis data. Please try again.');
      } finally {
        // Simulate loading for demo purposes
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
    
    fetchAnalysis();
  }, [analysisId]);

  // For demo purposes, if no analysis is provided, use mock data
  useEffect(() => {
    if (!analysisId && !analysis && !loading && !error) {
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setAnalysis({
          id: 'mock-analysis-id',
          resumeId: 'mock-resume-id',
          overallScore: 82,
          contentMatchScore: 75,
          formatCompatibilityScore: 85,
          sectionEvaluationScore: 80,
          sectionScores: {
            contact: {
              score: 90,
              feedback: "Contact information is well-formatted and complete."
            },
            summary: {
              score: 65,
              feedback: "Professional summary lacks specificity and impact. Consider adding quantifiable achievements."
            },
            experience: {
              score: 80,
              feedback: "Work experience is well-detailed, but could use more action verbs and quantifiable results."
            },
            education: {
              score: 95,
              feedback: "Education section is comprehensive and well-formatted."
            },
            skills: {
              score: 70,
              feedback: "Skills section could be more targeted to industry-specific keywords."
            }
          },
          keywordMatches: [
            {
              keyword: "project management",
              found: true,
              importance: "high",
              context: "Listed in skills and demonstrated in experience"
            },
            {
              keyword: "JavaScript",
              found: true,
              importance: "high",
              context: "Listed in skills section"
            },
            {
              keyword: "agile methodology",
              found: false,
              importance: "medium",
              context: "Not found in resume"
            },
            {
              keyword: "data analysis",
              found: true,
              importance: "medium",
              context: "Mentioned in job responsibilities"
            },
            {
              keyword: "team leadership",
              found: true,
              importance: "high",
              context: "Demonstrated in experience section"
            }
          ],
          recommendations: [
            {
              section: "summary",
              recommendation: "Add 2-3 quantifiable achievements to your professional summary to demonstrate impact.",
              impact: "high",
              difficulty: "low"
            },
            {
              section: "experience",
              recommendation: "Use more action verbs at the beginning of bullet points to highlight your contributions.",
              impact: "medium",
              difficulty: "low"
            },
            {
              section: "skills",
              recommendation: "Add more industry-specific technical skills and tools you're proficient with.",
              impact: "high",
              difficulty: "medium"
            },
            {
              section: "formatting",
              recommendation: "Ensure consistent spacing and bullet point styling throughout the document.",
              impact: "medium",
              difficulty: "low"
            },
            {
              section: "keywords",
              recommendation: "Include 'agile methodology' in your skills or experience sections.",
              impact: "high",
              difficulty: "low"
            }
          ],
          createdAt: new Date().toISOString()
        });
        setLoading(false);
      }, 1500);
    }
  }, [analysisId, analysis, loading, error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Analyzing your resume...</h2>
          <p className="text-gray-500 mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 text-red-600 p-3 rounded-full inline-flex items-center justify-center mb-4">
            <XCircle size={30} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Something went wrong</h2>
          <p className="text-gray-500 mt-2">{error}</p>
          <button
            onClick={() => router.push('/analyze')}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full inline-flex items-center justify-center mb-4">
            <Info size={30} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">No Analysis Found</h2>
          <p className="text-gray-500 mt-2">We couldn't find any analysis data for this resume.</p>
          <button
            onClick={() => router.push('/analyze')}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Analyze Resume
          </button>
        </div>
      </div>
    );
  }

  // Functions to determine color classes based on scores
  const getScoreColorClass = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColorClass = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSectionIcon = (section: string) => {
    switch (section.toLowerCase()) {
      case 'contact':
        return <User className="w-4 h-4" />;
      case 'summary':
        return <FileText className="w-4 h-4" />;
      case 'experience':
        return <Briefcase className="w-4 h-4" />;
      case 'education':
        return <BookOpen className="w-4 h-4" />;
      case 'skills':
        return <Code className="w-4 h-4" />;
      case 'formatting':
        return <FileText className="w-4 h-4" />;
      case 'keywords':
        return <BarChart className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getImpactBadgeClass = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyBadgeClass = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Resume Analysis</h1>
              <p className="mt-1 text-gray-600 flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                {resumeTitle}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
                <div className="font-medium text-blue-800 mr-2">ATS Compatibility:</div>
                <div className={`font-bold ${getScoreColorClass(analysis.overallScore)}`}>
                  {analysis.overallScore}/100
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Score Breakdown Section */}
          <div className="md:col-span-3">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Score Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Content Match */}
              <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-md bg-purple-100 mr-3">
                    <BarChart className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Content Match</h3>
                    <p className="text-sm text-gray-500">How well your content matches industry standards</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Score</span>
                  <span className={`text-lg font-bold ${getScoreColorClass(analysis.contentMatchScore)}`}>
                    {analysis.contentMatchScore}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`${getProgressColorClass(analysis.contentMatchScore)} h-2.5 rounded-full`}
                    style={{ width: `${analysis.contentMatchScore}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Format Compatibility */}
              <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-md bg-blue-100 mr-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Format Compatibility</h3>
                    <p className="text-sm text-gray-500">How well your resume format works with ATS</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Score</span>
                  <span className={`text-lg font-bold ${getScoreColorClass(analysis.formatCompatibilityScore)}`}>
                    {analysis.formatCompatibilityScore}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`${getProgressColorClass(analysis.formatCompatibilityScore)} h-2.5 rounded-full`}
                    style={{ width: `${analysis.formatCompatibilityScore}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Section Evaluation */}
              <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-md bg-green-100 mr-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Section Evaluation</h3>
                    <p className="text-sm text-gray-500">Quality of individual resume sections</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Score</span>
                  <span className={`text-lg font-bold ${getScoreColorClass(analysis.sectionEvaluationScore)}`}>
                    {analysis.sectionEvaluationScore}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`${getProgressColorClass(analysis.sectionEvaluationScore)} h-2.5 rounded-full`}
                    style={{ width: `${analysis.sectionEvaluationScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Left Column - Section Breakdown + Keywords */}
          <div className="md:col-span-2 space-y-6">
            {/* Section Breakdown */}
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-900">Section Breakdown</h2>
                <p className="text-sm text-gray-500 mt-1">Individual scores and feedback for each section of your resume</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {Object.entries(analysis.sectionScores).map(([section, data]) => (
                    <div key={section} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className={`p-1.5 rounded-md bg-${section === 'contact' ? 'blue' : section === 'summary' ? 'purple' : section === 'experience' ? 'green' : section === 'education' ? 'yellow' : 'red'}-100 mr-2`}>
                            {getSectionIcon(section)}
                          </div>
                          <h3 className="font-medium text-gray-900 capitalize">{section}</h3>
                        </div>
                        <div className={`flex items-center font-medium ${getScoreColorClass(data.score)}`}>
                          {data.score}/100
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{data.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Keyword Matches */}
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-900">Keyword Matches</h2>
                <p className="text-sm text-gray-500 mt-1">Important keywords found and missing in your resume</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {analysis.keywordMatches.map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`p-1 rounded-full ${keyword.found ? 'bg-green-100' : 'bg-red-100'} mr-3`}>
                          {keyword.found ? 
                            <CheckCircle className="h-4 w-4 text-green-600" /> : 
                            <XCircle className="h-4 w-4 text-red-600" />
                          }
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{keyword.keyword}</div>
                          <div className="text-xs text-gray-500">{keyword.context}</div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        keyword.importance === 'high' ? 'bg-red-100 text-red-700' : 
                        keyword.importance === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {keyword.importance} importance
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Recommendations */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 sticky top-6">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-900">Recommendations</h2>
                <p className="text-sm text-gray-500 mt-1">Suggestions to improve your resume</p>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="p-1 rounded-md bg-blue-100 mr-2">
                          {getSectionIcon(rec.section)}
                        </div>
                        <h3 className="font-medium text-gray-900 capitalize">{rec.section}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{rec.recommendation}</p>
                      <div className="flex items-center text-xs space-x-2">
                        <div className={`px-2 py-0.5 rounded-full ${getImpactBadgeClass(rec.impact)}`}>
                          {rec.impact} impact
                        </div>
                        <div className={`px-2 py-0.5 rounded-full ${getDifficultyBadgeClass(rec.difficulty)}`}>
                          {rec.difficulty} difficulty
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="px-6 py-5 bg-gray-50 border-t border-gray-100">
                <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md mb-3 flex justify-center items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Optimize Resume
                </button>
                <button className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md flex justify-center items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Download Analysis
                </button>
              </div>
            </div>
          </div>
          
          {/* Bottom Section - Match with Jobs */}
          <div className="md:col-span-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl font-semibold mb-2">Ready to find your perfect match?</h2>
                  <p className="text-indigo-100">Match your resume with job listings to see how well you qualify for specific positions.</p>
                </div>
                <Link 
                  href={`/job-matches?resumeId=${analysis.resumeId}`} 
                  className="inline-flex items-center px-5 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium"
                >
                  Match with Jobs <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 