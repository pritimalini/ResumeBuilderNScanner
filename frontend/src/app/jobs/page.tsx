'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Briefcase, MapPin, Filter, X } from 'lucide-react';
import Link from 'next/link';
import jobService, { JobPosting } from '@/services/jobService';

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    skills: [] as string[],
  });

  // Fetch all jobs when the component mounts
  useEffect(() => {
    setIsLoading(true);
    jobService.getAllJobs()
      .then(data => {
        setJobs(data);
        setFilteredJobs(data);
        setIsLoading(false);
      })
      .catch((_err) => {
        setError('Failed to load jobs. Please try again later.');
        setIsLoading(false);
      });
  }, []);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query) {
      setFilteredJobs(jobs);
      return;
    }

    try {
      const results = jobs.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
      setFilteredJobs(results);
    } catch (_err) {
      setError('Error filtering jobs');
    }
  };

  const handleSearchClick = () => {
    try {
      const results = jobs.filter(job => 
        job.title.toLowerCase().includes(searchQuery) ||
        job.company.toLowerCase().includes(searchQuery) ||
        job.description.toLowerCase().includes(searchQuery)
      );
      setFilteredJobs(results);
    } catch (_err) {
      setError('Error filtering jobs');
    }
  };

  // Extract all unique skills from jobs
  const allSkills = Array.from(
    new Set(jobs.flatMap(job => job.skills))
  ).sort();

  // Extract all unique locations from jobs
  const allLocations = Array.from(
    new Set(jobs.map(job => job.location))
  ).sort();

  // Handle filter changes
  const handleFilterChange = (type: 'location' | 'skills', value: string) => {
    if (type === 'location') {
      setFilters({
        ...filters,
        location: value
      });
    } else if (type === 'skills') {
      const updatedSkills = filters.skills.includes(value)
        ? filters.skills.filter(skill => skill !== value)
        : [...filters.skills, value];
      
      setFilters({
        ...filters,
        skills: updatedSkills
      });
    }
  };

  // Apply filters
  const applyFilters = () => {
    let results = [...jobs];
    
    if (filters.location) {
      results = results.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.skills.length > 0) {
      results = results.filter(job => 
        filters.skills.every(skill => 
          job.skills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }
    
    setFilteredJobs(results);
    setShowFilters(false);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      location: '',
      skills: []
    });
    setFilteredJobs(jobs);
    setShowFilters(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-4">Find Your Dream Job</h1>
        <p className="text-gray-600 mb-6">
          Browse through our curated list of job opportunities tailored to your skills
        </p>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search jobs by title, company, or skills..."
              value={searchQuery}
              onChange={handleSearch}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchClick}
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={handleSearchClick}
            >
              <Search size={20} />
            </button>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 py-3 px-6 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Filter Jobs</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location Filter */}
              <div>
                <h4 className="font-medium mb-2">Location</h4>
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Locations</option>
                  {allLocations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Skills Filter */}
              <div>
                <h4 className="font-medium mb-2">Skills</h4>
                <div className="max-h-48 overflow-y-auto">
                  {allSkills.map((skill) => (
                    <div key={skill} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`skill-${skill}`}
                        checked={filters.skills.includes(skill)}
                        onChange={() => handleFilterChange('skills', skill)}
                        className="mr-2"
                      />
                      <label htmlFor={`skill-${skill}`}>{skill}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Job Listings */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl font-medium">No jobs found matching your criteria</p>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          <button
            onClick={resetFilters}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                <span className="text-sm text-gray-500">
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center text-gray-600 mb-4">
                <Briefcase size={16} className="mr-2" />
                <span className="mr-4">{job.company}</span>
                <MapPin size={16} className="mr-2" />
                <span>{job.location}</span>
              </div>
              
              {job.salary && (
                <div className="mb-4">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {job.salary}
                  </span>
                </div>
              )}
              
              <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between">
                <Link href={`/jobs/${job.id}`}>
                  <span className="text-blue-600 hover:text-blue-800 font-medium">
                    View Details
                  </span>
                </Link>
                <Link href={`/match/${job.id}`}>
                  <span className="text-green-600 hover:text-green-800 font-medium">
                    Match Resume
                  </span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 