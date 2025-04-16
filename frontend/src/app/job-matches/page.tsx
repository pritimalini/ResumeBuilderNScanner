'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  Briefcase, 
  ChevronRight, 
  MapPin, 
  PercentCircle, 
  Search,
  SlidersHorizontal,
  X,
  BarChart3,
  RefreshCw,
  Filter,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { jobService } from '@/services/jobService';
import { JobPosting } from '@/types/job';

interface JobMatch {
  job: JobPosting;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export default function JobMatchesPage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchedJobs, setMatchedJobs] = useState<JobMatch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<JobMatch[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [minMatchScore, setMinMatchScore] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [locations, setLocations] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchMatchedJobs();
  }, []);

  const applyFilters = useCallback(() => {
    if (matchedJobs.length === 0) return;
    
    let filtered = [...matchedJobs];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.job.title.toLowerCase().includes(query) || 
        item.job.company.toLowerCase().includes(query) ||
        item.job.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }
    
    // Apply match score filter
    if (minMatchScore > 0) {
      filtered = filtered.filter(item => item.matchScore >= minMatchScore);
    }
    
    // Apply location filter
    if (selectedLocation) {
      filtered = filtered.filter(item => item.job.location === selectedLocation);
    }
    
    setFilteredJobs(filtered);
  }, [searchQuery, minMatchScore, selectedLocation, matchedJobs]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const fetchMatchedJobs = async () => {
    try {
      setIsLoading(true);
      
      // In a real application, this would call an API that matches the user's resume
      // against all available jobs. For demo purposes, we'll simulate this:
      
      // 1. Get all jobs
      const jobs = await jobService.getAllJobs();
      
      // 2. For each job, calculate a simulated match score
      const jobMatches: JobMatch[] = jobs.map(job => {
        // Create a random match score between 30 and 100
        const matchScore = Math.floor(Math.random() * 70) + 30;
        
        // Randomly decide which skills match
        const matchedSkills = job.skills.filter(() => Math.random() > 0.3);
        const missingSkills = job.skills.filter(skill => !matchedSkills.includes(skill));
        
        return {
          job,
          matchScore,
          matchedSkills,
          missingSkills
        };
      });
      
      // 3. Sort by match score (highest first)
      jobMatches.sort((a, b) => b.matchScore - a.matchScore);
      
      setMatchedJobs(jobMatches);
      
      // Extract unique locations for filter
      const uniqueLocations = Array.from(
        new Set(jobs.map(job => job.location))
      );
      setLocations(uniqueLocations);
      
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load matched jobs. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setMinMatchScore(0);
    setSelectedLocation('');
    setShowFilters(false);
  };

  const refreshMatches = async () => {
    setIsRefreshing(true);
    await fetchMatchedJobs();
    setIsRefreshing(false);
  };
  
  const handleViewJob = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };
  
  const handleMatchResume = (jobId: string) => {
    router.push(`/match/${jobId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
        <p className="mb-6">We couldn't load job matches at this time. Please try again later.</p>
        <button 
          onClick={fetchMatchedJobs}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl md:text-3xl font-bold mb-2"
          >
            Jobs Matching Your Resume
          </motion.h1>
          <p className="text-gray-600">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found matching your skills and experience
          </p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0">
          <button
            onClick={refreshMatches}
            disabled={isRefreshing}
            className={`p-2 mr-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            aria-label="Refresh matches"
          >
            <RefreshCw size={20} />
          </button>
          <Link href="/resume-builder">
            <span className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
              Update Resume
              <ChevronRight size={16} />
            </span>
          </Link>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-2 mb-2">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search for jobs by title, company, or skill..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 md:w-auto"
          >
            <SlidersHorizontal size={18} className="mr-2" />
            Filters
            {(minMatchScore > 0 || selectedLocation) && (
              <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {(minMatchScore > 0 ? 1 : 0) + (selectedLocation ? 1 : 0)}
              </span>
            )}
          </button>
        </div>
        
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-gray-200 rounded-lg p-4 mb-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Filter Results</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Match Score
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={minMatchScore}
                    onChange={(e) => setMinMatchScore(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 w-8">
                    {minMatchScore}%
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Location</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md text-sm font-medium"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {filteredJobs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Filter size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No matching jobs found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or updating your resume to get better matches.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((jobMatch) => (
            <motion.div
              key={jobMatch.job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold mb-2">
                    {jobMatch.job.title}
                  </h2>
                  <div className="flex items-center flex-wrap text-gray-600 mb-3">
                    <span className="mr-4">{jobMatch.job.company}</span>
                    <div className="flex items-center mr-4">
                      <MapPin size={14} className="mr-1" />
                      <span>{jobMatch.job.location}</span>
                    </div>
                    {jobMatch.job.salary && (
                      <span className="text-sm bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                        {jobMatch.job.salary}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center mt-2 md:mt-0">
                  <div className="bg-blue-50 text-blue-800 flex items-center px-3 py-1 rounded-full mr-4">
                    <PercentCircle size={16} className="mr-1" />
                    <span className="font-medium">{jobMatch.matchScore}% Match</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700 line-clamp-2">
                  {jobMatch.job.description.substring(0, 200)}...
                </p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Skills Match</h3>
                <div className="flex flex-wrap gap-2">
                  {jobMatch.matchedSkills.map((skill) => (
                    <span 
                      key={skill} 
                      className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
                    >
                      <CheckCircle size={12} className="mr-1" />
                      {skill}
                    </span>
                  ))}
                  {jobMatch.missingSkills.map((skill) => (
                    <span 
                      key={skill} 
                      className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleViewJob(jobMatch.job.id)}
                  className="flex-1 py-2 px-4 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium flex items-center justify-center"
                >
                  View Details
                  <ArrowUpRight size={16} className="ml-1" />
                </button>
                <button
                  onClick={() => handleMatchResume(jobMatch.job.id)}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center"
                >
                  <BarChart3 size={16} className="mr-1" />
                  Analyze Match
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 