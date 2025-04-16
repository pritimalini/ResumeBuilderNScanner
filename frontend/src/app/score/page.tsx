'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, FileText, CheckCircle, AlertCircle, ChevronRight, 
  Download, PieChart, ListChecks, BadgeCheck 
} from 'lucide-react';
import Link from 'next/link';

export default function ScorePage() {
  // State for analysis results
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState({
    resumeId: 'resume_12345',
    jobId: 'job_67890',
    overallScore: 82,
    fileName: 'Software_Developer_Resume.pdf',
    contentMatchScore: 32, // out of 40
    formatCompatibilityScore: 20, // out of 25
    sectionEvaluationScore: 30, // out of 35
    sectionScores: [
      { section: 'contact', score: 95, maxScore: 100, feedback: 'Contact information is complete and well-formatted.' },
      { section: 'summary', score: 80, maxScore: 100, feedback: 'Professional summary is good but could be more targeted to the job description.' },
      { section: 'experience', score: 85, maxScore: 100, feedback: 'Work experience shows relevant skills, but could use more quantifiable achievements.' },
      { section: 'education', score: 90, maxScore: 100, feedback: 'Education section is well-structured and relevant.' },
      { section: 'skills', score: 70, maxScore: 100, feedback: 'Some key skills from the job description are missing.' },
    ],
    keywordMatches: [
      { keyword: 'React', found: true, importance: 0.9, context: 'Built responsive web applications using React' },
      { keyword: 'Node.js', found: true, importance: 0.8, context: 'Developed RESTful APIs with Node.js' },
      { keyword: 'TypeScript', found: true, importance: 0.7, context: 'Implemented type-safe code with TypeScript' },
      { keyword: 'MongoDB', found: false, importance: 0.6, context: null },
      { keyword: 'AWS', found: false, importance: 0.8, context: null },
      { keyword: 'CI/CD', found: false, importance: 0.5, context: null },
      { keyword: 'JavaScript', found: true, importance: 0.9, context: 'Proficient in JavaScript' },
      { keyword: 'Git', found: true, importance: 0.6, context: 'Version control with Git' },
    ],
    recommendations: [
      { 
        section: 'skills', 
        recommendation: 'Add MongoDB, AWS, and CI/CD to your skills section.',
        impact: 0.8,
        implementationDifficulty: 'Easy'
      },
      { 
        section: 'experience', 
        recommendation: 'Quantify your achievements with metrics and percentages.',
        impact: 0.7,
        implementationDifficulty: 'Medium'
      },
      { 
        section: 'summary', 
        recommendation: 'Tailor your summary to match the job description more closely.',
        impact: 0.6,
        implementationDifficulty: 'Easy'
      },
    ]
  });

  // Simulate loading analysis on component mount
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Calculate the percentage of matched keywords
  const keywordsFoundCount = analysisData.keywordMatches.filter(k => k.found).length;
  const keywordsTotal = analysisData.keywordMatches.length;
  const keywordsPercentage = Math.round((keywordsFoundCount / keywordsTotal) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Analyzing your resume...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header with score overview */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Resume Analysis Results</h1>
                <p className="text-gray-600">
                  <FileText className="inline-block w-4 h-4 mr-1" />
                  {analysisData.fileName}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center">
                <div className="mr-4 text-right">
                  <div className="text-sm text-gray-600 mb-1">ATS Compatibility Score</div>
                  <div className="text-3xl font-bold flex items-center">
                    {analysisData.overallScore}
                    <span className="text-base text-gray-500 ml-1">/100</span>
                  </div>
                </div>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                  analysisData.overallScore >= 80 ? 'bg-green-500' :
                  analysisData.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  {analysisData.overallScore}%
                </div>
              </div>
            </div>

            {/* Score breakdown cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Content Match</h3>
                  <PieChart className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex items-end">
                  <div className="text-3xl font-bold">{analysisData.contentMatchScore}</div>
                  <div className="text-gray-500 ml-1 mb-1">/40</div>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full" 
                    style={{ width: `${(analysisData.contentMatchScore / 40) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  How well your content matches the job requirements
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Format Compatibility</h3>
                  <ListChecks className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex items-end">
                  <div className="text-3xl font-bold">{analysisData.formatCompatibilityScore}</div>
                  <div className="text-gray-500 ml-1 mb-1">/25</div>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-purple-600 h-full rounded-full" 
                    style={{ width: `${(analysisData.formatCompatibilityScore / 25) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  How ATS-friendly your resume format is
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Section Evaluation</h3>
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-end">
                  <div className="text-3xl font-bold">{analysisData.sectionEvaluationScore}</div>
                  <div className="text-gray-500 ml-1 mb-1">/35</div>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-green-600 h-full rounded-full" 
                    style={{ width: `${(analysisData.sectionEvaluationScore / 35) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Quality and completeness of each resume section
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Section Scores */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Section Breakdown</h2>
                <div className="space-y-6">
                  {analysisData.sectionScores.map((section, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium capitalize">{section.section}</span>
                        <span className="text-sm">
                          {section.score}/{section.maxScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            section.score >= 80 ? 'bg-green-500' :
                            section.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${section.score}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{section.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keyword Matches */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Keyword Matches</h2>
                  <div className="flex items-center">
                    <span className="mr-2 text-sm text-gray-600">Found:</span>
                    <span className="font-semibold">{keywordsFoundCount}/{keywordsTotal} ({keywordsPercentage}%)</span>
                  </div>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {analysisData.keywordMatches.map((keyword, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg ${
                        keyword.found ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {keyword.found ? (
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                        )}
                        <span className={`font-medium ${keyword.found ? 'text-green-700' : 'text-red-700'}`}>
                          {keyword.keyword}
                        </span>
                        <div className="ml-auto flex items-center">
                          <span className="text-xs text-gray-500 mr-1">Importance:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-2 h-2 rounded-full mx-0.5 ${
                                  i < Math.round(keyword.importance * 5) 
                                    ? 'bg-blue-600' 
                                    : 'bg-gray-200'
                                }`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {keyword.context && (
                        <div className="ml-6 text-sm text-gray-600 italic">
                          &quot;{keyword.context}&quot;
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Recommendations</h2>
              <div className="space-y-4">
                {analysisData.recommendations.map((rec, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between mb-1">
                      <h3 className="font-semibold text-gray-800">{rec.recommendation}</h3>
                      <span className="text-sm text-gray-500">
                        {rec.implementationDifficulty} • Impact: {Math.round(rec.impact * 100)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Section: <span className="font-medium capitalize">{rec.section}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/build?resumeId=${analysisData.resumeId}`}
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <BadgeCheck className="w-5 h-5 mr-2" />
                Optimize My Resume
              </Link>
              <button
                className="flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Analysis Report
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 