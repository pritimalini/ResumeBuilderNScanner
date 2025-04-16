'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  BarChart3,
  FileText,
  BriefcaseIcon,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import { jobService } from '@/services/jobService';
import { JobPosting } from '@/types/job';

interface MatchResult {
  score: number;
  matches: {
    skills: {
      matched: string[];
      missing: string[];
    };
    experience: {
      matched: string[];
      partial: string[];
      missing: string[];
    };
    education: {
      matched: boolean;
      details: string;
    };
    keywords: {
      matched: string[];
      missing: string[];
    };
  };
  recommendations: string[];
}

export default function MatchResumePage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<JobPosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [showUpload, setShowUpload] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setIsLoading(true);
        const jobData = await jobService.getJobById(jobId);
        
        if (!jobData) {
          setError('Job not found');
          setIsLoading(false);
          return;
        }
        
        setJob(jobData);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load job details. Please try again later.');
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a resume file first');
      return;
    }

    try {
      setIsAnalyzing(true);
      setShowUpload(false);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // In a real app, you would upload the file and get analysis from the backend
      // const formData = new FormData();
      // formData.append('resume', selectedFile);
      // formData.append('jobId', jobId);
      // const response = await fetch('/api/match-resume', { method: 'POST', body: formData });
      // const data = await response.json();
      
      // For now, we'll simulate a response
      const mockMatchResult: MatchResult = {
        score: 73,
        matches: {
          skills: {
            matched: ['JavaScript', 'React', 'CSS'],
            missing: ['TypeScript', 'Node.js'],
          },
          experience: {
            matched: ['Frontend Development'],
            partial: ['UI/UX Design'],
            missing: ['API Integration'],
          },
          education: {
            matched: true,
            details: 'Bachelor\'s degree requirement satisfied',
          },
          keywords: {
            matched: ['web development', 'user interface', 'responsive design'],
            missing: ['agile methodology', 'CI/CD'],
          },
        },
        recommendations: [
          'Add TypeScript to your skill set',
          'Highlight any API integration experience',
          'Include keywords related to agile methodology',
          'Mention any CI/CD experience you have',
        ],
      };
      
      setMatchResult(mockMatchResult);
      setIsAnalyzing(false);
    } catch (err) {
      setError('Failed to analyze resume. Please try again later.');
      setIsAnalyzing(false);
      setShowUpload(true);
    }
  };

  const handleTryAnother = () => {
    setSelectedFile(null);
    setMatchResult(null);
    setShowUpload(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
        className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6"
      >
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Match Your Resume</h1>
          <div className="flex items-start">
            <BriefcaseIcon size={18} className="text-gray-600 mr-2 mt-1" />
            <span className="text-gray-700">{job.title} at {job.company}</span>
          </div>
        </div>

        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center"
          >
            <form onSubmit={handleUpload}>
              <div className="mb-6">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Upload Your Resume</h2>
                <p className="text-gray-600 mb-6">
                  We'll analyze your resume and compare it with this job posting to see how well you match.
                </p>
                
                <label 
                  htmlFor="resumeUpload" 
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                >
                  Select Resume File
                </label>
                <input
                  type="file"
                  id="resumeUpload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {selectedFile && (
                  <div className="mt-4 text-sm text-gray-600">
                    Selected file: <span className="font-medium">{selectedFile.name}</span>
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={!selectedFile}
                className={`px-6 py-3 rounded-md font-medium ${
                  selectedFile 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Analyze Resume
              </button>
            </form>
          </motion.div>
        )}

        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold mb-2">Analyzing Your Resume</h2>
            <p className="text-gray-600">
              We're comparing your resume with the job requirements.
              This will take just a moment...
            </p>
          </motion.div>
        )}

        {matchResult && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 text-center">
              <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
                <BarChart3 size={32} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Match Score: {matchResult.score}%</h2>
              <p className="text-gray-600">
                {matchResult.score >= 80 
                  ? "Great match! You're well-qualified for this position."
                  : matchResult.score >= 60
                    ? "Good match! You have many of the required qualifications."
                    : "You match some requirements, but might need to develop more skills for an ideal fit."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CheckCircle size={18} className="text-green-500 mr-2" />
                  Skills Match
                </h3>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Matched Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.matches.skills.matched.map(skill => (
                      <span 
                        key={skill} 
                        className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Missing Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.matches.skills.missing.map(skill => (
                      <span 
                        key={skill} 
                        className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <GraduationCap size={18} className="text-blue-500 mr-2" />
                  Education & Experience
                </h3>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Education:</h4>
                  <div className="flex items-start">
                    {matchResult.matches.education.matched ? (
                      <>
                        <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-700">{matchResult.matches.education.details}</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={16} className="text-amber-500 mr-2 mt-0.5" />
                        <span className="text-gray-700">{matchResult.matches.education.details}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Experience:</h4>
                  <ul className="space-y-2">
                    {matchResult.matches.experience.matched.map(exp => (
                      <li key={exp} className="flex items-start">
                        <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-700">{exp}</span>
                      </li>
                    ))}
                    {matchResult.matches.experience.partial.map(exp => (
                      <li key={exp} className="flex items-start">
                        <AlertTriangle size={16} className="text-amber-500 mr-2 mt-0.5" />
                        <span className="text-gray-700">{exp} (Partial match)</span>
                      </li>
                    ))}
                    {matchResult.matches.experience.missing.map(exp => (
                      <li key={exp} className="flex items-start">
                        <XCircle size={16} className="text-red-500 mr-2 mt-0.5" />
                        <span className="text-gray-700">{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Keywords Match</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Found in your resume:</h4>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.matches.keywords.matched.map(keyword => (
                      <span 
                        key={keyword} 
                        className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Missing from your resume:</h4>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.matches.keywords.missing.map(keyword => (
                      <span 
                        key={keyword} 
                        className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertTriangle size={18} className="text-amber-500 mr-2" />
                Recommendations to Improve Your Match
              </h3>
              
              <ul className="space-y-2">
                {matchResult.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-amber-700 font-medium mr-2">•</span>
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleTryAnother}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Try Another Resume
              </button>
              <button
                onClick={() => router.push(`/resume-builder?job=${jobId}`)}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                Optimize Your Resume
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 