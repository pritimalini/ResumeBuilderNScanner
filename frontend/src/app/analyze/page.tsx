"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  BarChart, 
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type ResumeFile = {
  id: string;
  file: File;
  status: 'idle' | 'analyzing' | 'success' | 'error';
  progress: number;
  errorMessage?: string;
};

const AnalyzePage = () => {
  const router = useRouter();
  const [resumeFiles, setResumeFiles] = useState<ResumeFile[]>([]);
  const [uploadError, setUploadError] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [expandedFileId, setExpandedFileId] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const newFiles = acceptedFiles.map(file => ({
        id: `${file.name}-${Date.now()}`,
        file,
        status: 'idle' as const,
        progress: 0
      }));
      
      setResumeFiles(prev => [...prev, ...newFiles]);
      setUploadError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  useEffect(() => {
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors.some(e => e.code === 'file-too-large')) {
        setUploadError('File is too large. Maximum size is 5MB.');
      } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
        setUploadError('Invalid file type. Please upload PDF, DOCX, DOC, or TXT.');
      } else {
        setUploadError('There was an error with your file. Please try again.');
      }
    } else {
      setUploadError('');
    }
  }, [fileRejections]);

  const handleAnalyzeResume = (id: string) => {
    setResumeFiles(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: 'analyzing', progress: 0 };
      }
      return item;
    }));

    const fileToAnalyze = resumeFiles.find(item => item.id === id);
    if (!fileToAnalyze) return;

    // Simulate progress
    const interval = setInterval(() => {
      setResumeFiles(prev => prev.map(item => {
        if (item.id === id && item.status === 'analyzing') {
          const newProgress = item.progress >= 95 ? 95 : item.progress + Math.random() * 10;
          return { ...item, progress: newProgress };
        }
        return item;
      }));
    }, 300);

    // Simulate API call to analyze resume
    setTimeout(() => {
      clearInterval(interval);
      
      setResumeFiles(prev => prev.map(item => {
        if (item.id === id) {
          // Simulate error if filename includes "error"
          if (item.file.name.toLowerCase().includes('error')) {
            return { 
              ...item, 
              status: 'error', 
              progress: 0,
              errorMessage: 'There was an error analyzing this resume. Please try again.'
            };
          }
          return { ...item, status: 'success', progress: 100 };
        }
        return item;
      }));
    }, 3000);
  };

  const handleViewResults = (id: string) => {
    // In a real app, you would pass the resume ID to the score page
    router.push(`/score?resumeId=${id}`);
  };

  const removeFile = (id: string) => {
    setResumeFiles(prev => prev.filter(item => item.id !== id));
  };

  const toggleExpandFile = (id: string) => {
    setExpandedFileId(prev => prev === id ? null : id);
  };

  const anyFileAnalyzing = resumeFiles.some(file => file.status === 'analyzing');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analyze Your Resume</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-3xl">
            Upload your resume to get instant feedback on ATS compatibility, content quality, and format.
          </p>
        </div>
      </div>

      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-600" />
                  Resume Upload
                </h2>
                
                <div className="mt-4 sm:mt-6">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors duration-200 ease-in-out cursor-pointer
                      ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'}`}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center">
                      <Upload 
                        className={`h-10 sm:h-12 w-10 sm:w-12 mb-3 sm:mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} 
                        strokeWidth={1.5}
                      />
                      {isDragActive ? (
                        <p className="text-base sm:text-lg font-medium text-blue-600">Drop your resume here</p>
                      ) : (
                        <>
                          <p className="text-base sm:text-lg font-medium text-gray-900">Drag and drop your resume</p>
                          <p className="mt-1 text-xs sm:text-sm text-gray-500">or click to browse files</p>
                          <p className="mt-2 text-xs text-gray-400">PDF, DOCX, DOC, TXT (Max 5MB)</p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {uploadError && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100"
                    >
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                        <p className="text-sm text-red-600">{uploadError}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
                
                {resumeFiles.length > 0 && (
                  <div className="mt-6 sm:mt-8">
                    <h3 className="font-medium text-gray-900 mb-2 sm:mb-3">Uploaded Resumes ({resumeFiles.length})</h3>
                    <div className="space-y-2 sm:space-y-3">
                      {resumeFiles.map((resumeFile) => (
                        <div key={resumeFile.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div 
                            className="flex items-center p-2 sm:p-3 bg-gray-50 cursor-pointer"
                            onClick={() => toggleExpandFile(resumeFile.id)}
                          >
                            <div className="flex-1 flex items-center min-w-0">
                              <FileText className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                              <div className="font-medium text-gray-900 truncate mr-2">{resumeFile.file.name}</div>
                              <div className="text-xs text-gray-500 flex-shrink-0">
                                ({(resumeFile.file.size / 1024 / 1024).toFixed(2)} MB)
                              </div>
                            </div>
                            <div className="flex items-center ml-2 flex-shrink-0">
                              {resumeFile.status === 'success' && (
                                <div className="mr-2 text-sm font-medium text-green-600 flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  <span className="hidden sm:inline">Analyzed</span>
                                </div>
                              )}
                              {resumeFile.status === 'error' && (
                                <div className="mr-2 text-sm font-medium text-red-600 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  <span className="hidden sm:inline">Failed</span>
                                </div>
                              )}
                              {expandedFileId === resumeFile.id ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </div>
                          
                          <AnimatePresence>
                            {expandedFileId === resumeFile.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="p-3 sm:p-4 border-t border-gray-200">
                                  {resumeFile.status === 'idle' && (
                                    <div className="flex flex-wrap justify-between items-center gap-2">
                                      <p className="text-sm text-gray-600">Ready to analyze</p>
                                      <div className="flex flex-wrap gap-2">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(resumeFile.id);
                                          }}
                                          className="px-2 sm:px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
                                        >
                                          Remove
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleAnalyzeResume(resumeFile.id);
                                          }}
                                          disabled={anyFileAnalyzing}
                                          className={`px-2 sm:px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                            anyFileAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
                                          }`}
                                        >
                                          Analyze Resume
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {resumeFile.status === 'analyzing' && (
                                    <div>
                                      <div className="flex justify-between mb-1">
                                        <p className="text-sm font-medium text-blue-600">Analyzing resume...</p>
                                        <p className="text-sm font-medium text-gray-700">{Math.floor(resumeFile.progress)}%</p>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <motion.div 
                                          className="bg-blue-600 h-2 rounded-full" 
                                          initial={{ width: "0%" }}
                                          animate={{ width: `${resumeFile.progress}%` }}
                                          transition={{ duration: 0.3 }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                  
                                  {resumeFile.status === 'success' && (
                                    <div className="flex flex-wrap justify-between items-center gap-2">
                                      <div className="flex items-center text-green-600">
                                        <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                                        <p className="text-sm font-medium">Analysis completed successfully!</p>
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(resumeFile.id);
                                          }}
                                          className="px-2 sm:px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
                                        >
                                          Remove
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewResults(resumeFile.id);
                                          }}
                                          className="px-2 sm:px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                          View Results
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {resumeFile.status === 'error' && (
                                    <div className="flex flex-wrap justify-between items-center gap-2">
                                      <div className="flex items-center text-red-600">
                                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                                        <p className="text-sm font-medium">{resumeFile.errorMessage || 'Analysis failed'}</p>
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(resumeFile.id);
                                          }}
                                          className="px-2 sm:px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
                                        >
                                          Remove
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleAnalyzeResume(resumeFile.id);
                                          }}
                                          disabled={anyFileAnalyzing}
                                          className={`px-2 sm:px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                            anyFileAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
                                          }`}
                                        >
                                          Try Again
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 sm:mt-8">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">Why analyze your resume?</h3>
                  <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-3 sm:gap-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100">
                          <Check className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <h4 className="text-sm sm:text-base font-medium text-gray-900">ATS Compatibility Check</h4>
                        <p className="mt-1 text-xs sm:text-sm text-gray-500">Ensure your resume passes through Applicant Tracking Systems used by 99% of Fortune 500 companies.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100">
                          <Check className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <h4 className="text-sm sm:text-base font-medium text-gray-900">Keyword Analysis</h4>
                        <p className="mt-1 text-xs sm:text-sm text-gray-500">Identify missing keywords and skills that can improve your match rate with job descriptions.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100">
                          <Check className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <h4 className="text-sm sm:text-base font-medium text-gray-900">Personalized Recommendations</h4>
                        <p className="mt-1 text-xs sm:text-sm text-gray-500">Get tailored suggestions to improve your resume's content, format, and impact.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Info Section */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg shadow-sm overflow-hidden text-white">
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center">
                  <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Resume Scanner
                </h2>
                <p className="mt-2 text-sm text-indigo-100">
                  Our advanced AI analyzes your resume and provides detailed feedback on:
                </p>
                
                <ul className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                  <li className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 rounded-md bg-indigo-800 bg-opacity-25">
                        <BarChart className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <h3 className="text-sm sm:text-base font-medium">Score Breakdown</h3>
                      <p className="mt-1 text-xs sm:text-sm text-indigo-200">Get detailed scoring on various aspects of your resume.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 rounded-md bg-indigo-800 bg-opacity-25">
                        <CheckCircle className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <h3 className="text-sm sm:text-base font-medium">Section Evaluation</h3>
                      <p className="mt-1 text-xs sm:text-sm text-indigo-200">Learn how each section of your resume performs.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 rounded-md bg-indigo-800 bg-opacity-25">
                        <FileText className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <h3 className="text-sm sm:text-base font-medium">Content Quality</h3>
                      <p className="mt-1 text-xs sm:text-sm text-indigo-200">Get insights on the strength of your content and formatting.</p>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-6 pt-4 sm:pt-6 border-t border-indigo-500">
                  <h3 className="text-sm sm:text-base font-medium">Ready for more?</h3>
                  <p className="mt-2 text-xs sm:text-sm text-indigo-200">
                    After analysis, you can match your resume with specific job descriptions to see how well you qualify.
                  </p>
                  <Link 
                    href="/job-matches" 
                    className="mt-3 sm:mt-4 inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Explore Job Matches
                    <ArrowRight className="ml-1 sm:ml-2 -mr-0.5 h-3 w-3 sm:h-4 sm:w-4" />
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-medium text-gray-900">Need help?</h2>
                <p className="mt-2 text-xs sm:text-sm text-gray-600">
                  Have questions about our resume analysis? We're here to help.
                </p>
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="mt-3 sm:mt-4 inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {showHelp ? 'Hide FAQ' : 'View FAQ'}
                </button>
                
                <AnimatePresence>
                  {showHelp && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 overflow-hidden"
                    >
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900">What file formats are supported?</h3>
                          <p className="mt-1 text-xs text-gray-500">We support PDF, DOCX, DOC and TXT files up to 5MB in size.</p>
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900">How long does the analysis take?</h3>
                          <p className="mt-1 text-xs text-gray-500">Most resumes are analyzed within 30 seconds.</p>
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900">Is my data secure?</h3>
                          <p className="mt-1 text-xs text-gray-500">Yes, we use encryption and do not share your resume with third parties.</p>
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900">Can I analyze multiple resumes?</h3>
                          <p className="mt-1 text-xs text-gray-500">Yes, you can upload and analyze multiple resumes. Each will be scored individually.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzePage; 