'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Clock, 
  Building, 
  CheckCircle, 
  Share2, 
  BookmarkPlus,
  ArrowLeft,
  DollarSign,
  Globe,
  Award,
} from 'lucide-react';
import Link from 'next/link';
import { jobService } from '@/services/jobService';
import { JobPosting } from '@/types/job';

// Simple Button component since we don't have the UI component library
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  children: React.ReactNode;
}

const Button = ({ variant = 'default', children, className = '', ...props }: ButtonProps) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors";
  const variantStyles = variant === 'outline' 
    ? "border border-gray-300 bg-transparent hover:bg-gray-50" 
    : "bg-blue-600 text-white hover:bg-blue-700";
  
  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<JobPosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);

  // For resume matching
  const [showMatchingModal, setShowMatchingModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [resumes, setResumes] = useState<{ id: string; name: string }[]>([
    { id: "resume-1", name: "Software Developer Resume" },
    { id: "resume-2", name: "UX Designer Resume" },
    { id: "resume-3", name: "Data Scientist Resume" }
  ]);
  const [matchResult, setMatchResult] = useState<{
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    feedback: string;
  } | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);

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

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // In a real application, you would save this to user preferences
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title || 'Job Opportunity',
        text: `Check out this job: ${job?.title} at ${job?.company}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(() => alert('Failed to copy link'));
    }
  };

  const handleApply = () => {
    // In a real application, this would lead to an application form
    alert('Application functionality would be implemented here');
  };

  const handleMatchResume = async () => {
    if (!selectedResume) return;
    
    try {
      setMatchLoading(true);
      const result = await jobService.matchResumeToJob(jobId, selectedResume);
      setMatchResult(result);
    } catch (err) {
      console.error("Error matching resume:", err);
    } finally {
      setMatchLoading(false);
    }
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <Link href="/jobs">
        <span className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft size={16} className="mr-1" />
          Back to Jobs
        </span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{job.title}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <Building size={16} className="mr-2" />
              <span className="mr-4">{job.company}</span>
              <MapPin size={16} className="mr-2" />
              <span>{job.location}</span>
            </div>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full ${
                bookmarked 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="Bookmark job"
            >
              <BookmarkPlus size={18} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              aria-label="Share job"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {job.salary && (
          <div className="mb-6">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              Salary: {job.salary}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center">
            <Briefcase size={18} className="text-gray-500 mr-3" />
            <div>
              <div className="text-sm text-gray-500">Job Type</div>
              <div className="font-medium">{job.employmentType}</div>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar size={18} className="text-gray-500 mr-3" />
            <div>
              <div className="text-sm text-gray-500">Posted On</div>
              <div className="font-medium">
                {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : new Date(job.datePosted).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Award size={18} className="text-gray-500 mr-3" />
            <div>
              <div className="text-sm text-gray-500">Experience Level</div>
              <div className="font-medium">{job.experienceLevel}</div>
            </div>
          </div>
          <div className="flex items-center">
            <Globe size={18} className="text-gray-500 mr-3" />
            <div>
              <div className="text-sm text-gray-500">Remote Work</div>
              <div className="font-medium">{job.remote ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </div>

        {job.requirements && job.requirements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Requirements</h2>
            <ul className="space-y-2">
              {job.requirements.map((requirement: string, index: number) => (
                <li key={index} className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill: string) => (
              <span 
                key={skill} 
                className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleApply}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Apply Now
          </button>
          <Button 
            onClick={() => setShowMatchingModal(true)}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Match My Resume
          </Button>
        </div>
      </motion.div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">About {job.company}</h2>
        <p className="text-gray-700 mb-4">
          {/* In a real application, this would come from the company profile */}
          {job.company} is a leading company in its industry, focused on innovation and growth.
          The company provides a supportive work environment with opportunities for career advancement.
        </p>
        <div className="flex items-center text-gray-600">
          <MapPin size={16} className="mr-2" />
          <span>{job.location}</span>
        </div>
      </div>

      {/* Resume matching modal */}
      {showMatchingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-lg w-full"
          >
            <h2 className="text-xl font-bold mb-4">Match Resume to Job</h2>
            
            {!matchResult ? (
              <>
                <p className="mb-4">Select one of your resumes to match against this job posting:</p>
                <div className="space-y-3 mb-6">
                  {resumes.map(resume => (
                    <div key={resume.id} className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        id={resume.id} 
                        name="resume" 
                        value={resume.id}
                        checked={selectedResume === resume.id}
                        onChange={() => setSelectedResume(resume.id)}
                        className="w-4 h-4"
                      />
                      <label htmlFor={resume.id}>{resume.name}</label>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => setShowMatchingModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleMatchResume}
                    disabled={!selectedResume || matchLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {matchLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Analyzing...
                      </span>
                    ) : "Match Resume"}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="inline-block p-4 rounded-full bg-blue-50 dark:bg-blue-900 mb-3">
                    <div className="relative">
                      <svg 
                        className="w-24 h-24" 
                        viewBox="0 0 100 100"
                      >
                        <circle 
                          className="stroke-current text-gray-200 dark:text-gray-600" 
                          strokeWidth="8" 
                          fill="transparent" 
                          r="42" 
                          cx="50" 
                          cy="50" 
                        />
                        <circle 
                          className="stroke-current text-blue-600" 
                          strokeWidth="8" 
                          fill="transparent" 
                          r="42" 
                          cx="50" 
                          cy="50" 
                          strokeDasharray="264"
                          strokeDashoffset={264 - (264 * matchResult.score / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{matchResult.score}%</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">Match Score</h3>
                  <p className="text-gray-600 dark:text-gray-300">{matchResult.feedback}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-green-600">Matching Skills</h4>
                    <ul className="list-disc list-inside">
                      {matchResult.matchedSkills.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-red-600">Missing Skills</h4>
                    <ul className="list-disc list-inside">
                      {matchResult.missingSkills.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setMatchResult(null);
                      setSelectedResume(null);
                      setShowMatchingModal(false);
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      // In a real app, this would navigate to the resume editor
                      // with suggestions for improvement
                      router.push("/dashboard");
                    }}
                  >
                    Improve My Resume
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
} 