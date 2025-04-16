'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Share2, 
  ArrowLeft,
  BookmarkPlus,
  Building,
  Globe,
  Award,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { jobService } from '@/services/jobService';
import { JobPosting } from '@/types/job';

// Simple Button component since we don't have the UI component library
const Button = ({ 
  variant = 'default', 
  children, 
  className = '', 
  ...props 
}: { 
  variant?: 'default' | 'outline'; 
  children: React.ReactNode; 
  className?: string; 
  [key: string]: any;
}) => {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const jobData = await jobService.getJobById(jobId);
        if (jobData) {
          setJob(jobData);
        } else {
          setError("Job not found");
        }
      } catch (err) {
        setError("Failed to load job details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // In a real app, you would save this to user preferences
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
    if (job?.applicationUrl) {
      window.open(job.applicationUrl, '_blank');
    } else {
      // In a real app, this would redirect to an application form
      alert('Application functionality would be implemented here');
    }
  };

  const handleMatchResume = () => {
    router.push(`/match/${jobId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">{error || "Job not found"}</h1>
        <p className="mb-8">We couldn't find the job you're looking for.</p>
        <Button onClick={() => router.push("/jobs")}>
          View All Jobs
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Back button */}
      <div className="mb-6">
        <Button 
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Jobs</span>
        </Button>
      </div>

      {/* Job header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>
            <div className="flex items-center text-gray-600 dark:text-gray-300 gap-2 mt-2">
              <Building className="h-4 w-4" />
              <span className="mr-4">{job.company}</span>
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
              {job.remote && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                  Remote
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleBookmark}
              className={`p-2 rounded-full ${
                bookmarked 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
              aria-label="Bookmark job"
            >
              <BookmarkPlus className="h-5 w-5" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              aria-label="Share job"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-gray-500" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Job Type</div>
              <div className="text-sm font-medium">{job.employmentType}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Posted On</div>
              <div className="text-sm font-medium">
                {new Date(job.datePosted).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-gray-500" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Experience</div>
              <div className="text-sm font-medium">{job.experienceLevel}</div>
            </div>
          </div>
        </div>

        {job.salary && (
          <div className="mt-4 inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
            {job.salary}
          </div>
        )}
      </div>

      {/* Job details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.description}</p>
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Benefits</h2>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span 
                  key={skill} 
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Company Info</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{job.company}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {job.company} is a leading company in its industry, focused on innovation and growth.
                </p>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Globe className="h-4 w-4 mr-2" />
                <span>{job.remote ? 'Remote work available' : 'On-site'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={handleApply}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Apply Now
              </Button>
              
              <Button
                variant="outline"
                onClick={handleMatchResume}
                className="w-full"
              >
                Match with My Resume
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 