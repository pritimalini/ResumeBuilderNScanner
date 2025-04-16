import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useTheme } from '@/context/ThemeContext';
import ResumeUploader from '@/components/scanner/ResumeUploader';
import JobDescriptionInput from '@/components/scanner/JobDescriptionInput';
import ScanResults from '@/components/scanner/ScanResults';
import RecommendationsList from '@/components/scanner/RecommendationsList';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import axios from 'axios';

// Types
type ScanStep = 'upload' | 'job-description' | 'scanning' | 'results';
type ScanData = {
  resumeId?: string;
  jobId?: string;
  fileName?: string;
  jobTitle?: string;
};

export default function ResumeScanner() {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState<ScanStep>('upload');
  const [scanData, setScanData] = useState<ScanData>({});
  const [scanResults, setScanResults] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle resume upload
  const handleResumeUpload = async (file: File) => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post('http://localhost:8000/api/analyze-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setScanData({
        ...scanData,
        resumeId: response.data.resume_id,
        fileName: file.name,
      });
      
      setCurrentStep('job-description');
      toast.success('Resume uploaded successfully!');
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle job description submission
  const handleJobDescriptionSubmit = async (description: string, title: string) => {
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:8000/api/process-job-description', {
        description,
        title,
      });
      
      setScanData({
        ...scanData,
        jobId: response.data.job_id,
        jobTitle: title,
      });
      
      setCurrentStep('scanning');
      
      // Calculate score
      await calculateScore(scanData.resumeId!, response.data.job_id);
    } catch (error) {
      console.error('Error processing job description:', error);
      toast.error('Failed to process job description. Please try again.');
      setCurrentStep('job-description');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate ATS score
  const calculateScore = async (resumeId: string, jobId: string) => {
    try {
      const formData = new FormData();
      formData.append('resume_id', resumeId);
      formData.append('job_id', jobId);
      
      const scoreResponse = await axios.post('http://localhost:8000/api/calculate-score', formData);
      
      setScanResults(scoreResponse.data);
      
      // Get recommendations
      await getRecommendations(resumeId, jobId);
    } catch (error) {
      console.error('Error calculating score:', error);
      toast.error('Failed to calculate ATS score. Please try again.');
      setCurrentStep('job-description');
    }
  };

  // Get recommendations
  const getRecommendations = async (resumeId: string, jobId: string) => {
    try {
      const formData = new FormData();
      formData.append('resume_id', resumeId);
      formData.append('job_id', jobId);
      
      const recommendationsResponse = await axios.post('http://localhost:8000/api/get-recommendations', formData);
      
      setRecommendations(recommendationsResponse.data);
      setCurrentStep('results');
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast.error('Failed to get recommendations. Please try again.');
    }
  };

  // Reset the scanner
  const handleReset = () => {
    setScanData({});
    setScanResults(null);
    setRecommendations(null);
    setCurrentStep('upload');
  };

  return (
    <>
      <Head>
        <title>Resume Scanner - ATS Score Analyzer</title>
        <meta name="description" content="Scan your resume against job descriptions to get an ATS compatibility score and recommendations for improvement." />
      </Head>

      <div className="space-y-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Resume ATS Scanner</h1>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-secondary-600'}`}>
            Upload your resume and job description to get an ATS compatibility score and personalized recommendations.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <div className={`flex flex-col items-center ${currentStep === 'upload' ? 'text-primary-600' : 'text-secondary-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep === 'upload' ? 'bg-primary-600 text-white' : currentStep === 'job-description' || currentStep === 'scanning' || currentStep === 'results' ? 'bg-success-500 text-white' : 'bg-secondary-200'}`}>
                1
              </div>
              <span className="text-sm">Upload Resume</span>
            </div>
            
            <div className={`w-16 h-1 ${currentStep === 'upload' ? theme === 'dark' ? 'bg-gray-700' : 'bg-secondary-200' : 'bg-success-500'}`}></div>
            
            <div className={`flex flex-col items-center ${currentStep === 'job-description' ? 'text-primary-600' : currentStep === 'scanning' || currentStep === 'results' ? 'text-success-700' : theme === 'dark' ? 'text-gray-400' : 'text-secondary-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep === 'job-description' ? 'bg-primary-600 text-white' : currentStep === 'scanning' || currentStep === 'results' ? 'bg-success-500 text-white' : 'bg-secondary-200'}`}>
                2
              </div>
              <span className="text-sm">Job Description</span>
            </div>
            
            <div className={`w-16 h-1 ${currentStep === 'upload' || currentStep === 'job-description' ? theme === 'dark' ? 'bg-gray-700' : 'bg-secondary-200' : 'bg-success-500'}`}></div>
            
            <div className={`flex flex-col items-center ${currentStep === 'scanning' ? 'text-primary-600' : currentStep === 'results' ? 'text-success-700' : theme === 'dark' ? 'text-gray-400' : 'text-secondary-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep === 'scanning' ? 'bg-primary-600 text-white' : currentStep === 'results' ? 'bg-success-500 text-white' : 'bg-secondary-200'}`}>
                3
              </div>
              <span className="text-sm">Scanning</span>
            </div>
            
            <div className={`w-16 h-1 ${currentStep === 'results' ? 'bg-success-500' : theme === 'dark' ? 'bg-gray-700' : 'bg-secondary-200'}`}></div>
            
            <div className={`flex flex-col items-center ${currentStep === 'results' ? 'text-primary-600' : theme === 'dark' ? 'text-gray-400' : 'text-secondary-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep === 'results' ? 'bg-primary-600 text-white' : 'bg-secondary-200'}`}>
                4
              </div>
              <span className="text-sm">Results</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {isLoading && <LoadingOverlay />}
          
          {currentStep === 'upload' && (
            <ResumeUploader onUpload={handleResumeUpload} />
          )}
          
          {currentStep === 'job-description' && (
            <JobDescriptionInput onSubmit={handleJobDescriptionSubmit} />
          )}
          
          {currentStep === 'scanning' && (
            <div className={`card text-center py-16 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
              <div className="animate-pulse flex flex-col items-center">
                <div className={`rounded-full ${theme === 'dark' ? 'bg-purple-900' : 'bg-primary-200'} h-24 w-24 flex items-center justify-center mb-4`}>
                  <svg className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Analyzing Your Resume</h3>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-secondary-600'} max-w-md mx-auto`}>
                  Our AI is comparing your resume against the job description and calculating your ATS score. This may take a moment...
                </p>
              </div>
            </div>
          )}
          
          {currentStep === 'results' && scanResults && recommendations && (
            <div className="space-y-8">
              <ScanResults 
                results={scanResults} 
                resumeName={scanData.fileName || 'Your Resume'} 
                jobTitle={scanData.jobTitle || 'Job Position'} 
              />
              
              <RecommendationsList recommendations={recommendations} />
              
              <div className="flex justify-center mt-8">
                <button 
                  onClick={handleReset}
                  className={`btn ${theme === 'dark' ? 'bg-purple-700 hover:bg-purple-800 text-white' : 'btn-primary'}`}
                >
                  Scan Another Resume
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
