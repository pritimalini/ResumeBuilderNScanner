'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Bookmark, 
  Clock, 
  Building, 
  Star, 
  BarChart3,
  Filter,
  X,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { jobService } from '@/services/jobService';
import { JobPosting } from '@/types/job';

// Define the SavedJob interface
interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements?: string[];
  skills: string[];
  salary?: string;
  bookmarkedAt: Date;
  notes?: string;
  status: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
  remote?: boolean;
  experienceLevel?: string;
  employmentType?: string;
}

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<SavedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'dateDesc'
  });
  const [showNotesFor, setShowNotesFor] = useState<string | null>(null);
  const [jobNotes, setJobNotes] = useState<{[key: string]: string}>({});

  // Mock saved jobs data
  const mockSavedJobs: SavedJob[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA (Remote)',
      description: 'We are seeking a Senior Frontend Developer with expertise in React to join our growing team...',
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '5+ years of experience in frontend development',
        'Strong proficiency in React and TypeScript'
      ],
      skills: ['React', 'TypeScript', 'Redux', 'NextJS', 'Tailwind CSS'],
      salary: '$120,000 - $150,000',
      bookmarkedAt: new Date('2023-11-10'),
      notes: 'Great company culture, need to prepare for React performance questions',
      status: 'applied',
      createdAt: new Date('2023-11-01'),
      updatedAt: new Date('2023-11-01'),
      remote: true,
      experienceLevel: 'Senior',
      employmentType: 'Full-time'
    },
    {
      id: '2',
      title: 'UX Designer',
      company: 'DesignHub',
      location: 'New York, NY',
      description: 'DesignHub is looking for a talented UX Designer to create intuitive and engaging user experiences...',
      requirements: [
        'Bachelor\'s degree in Design or related field',
        '3+ years of experience in UX design',
        'Portfolio showcasing design projects'
      ],
      skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
      salary: '$90,000 - $120,000',
      bookmarkedAt: new Date('2023-11-05'),
      status: 'interviewing',
      createdAt: new Date('2023-10-25'),
      updatedAt: new Date('2023-10-25'),
      remote: false,
      experienceLevel: 'Mid-Level',
      employmentType: 'Full-time'
    },
    {
      id: '3',
      title: 'Full Stack Developer',
      company: 'StartupVision',
      location: 'Remote',
      description: 'StartupVision is seeking a Full Stack Developer to help build our innovative platform...',
      requirements: [
        'Strong knowledge of frontend and backend technologies',
        '2+ years of experience in full stack development',
        'Experience with cloud services (AWS, GCP, or Azure)'
      ],
      skills: ['JavaScript', 'Node.js', 'React', 'PostgreSQL', 'Docker'],
      bookmarkedAt: new Date('2023-11-12'),
      notes: 'Need to highlight my AWS experience in the resume',
      status: 'saved',
      createdAt: new Date('2023-11-05'),
      updatedAt: new Date('2023-11-05'),
      remote: true,
      experienceLevel: 'Mid-Level',
      employmentType: 'Full-time'
    }
  ];

  useEffect(() => {
    // In a real app, you'd fetch saved jobs from an API
    const loadSavedJobs = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setSavedJobs(mockSavedJobs);
        setFilteredJobs(mockSavedJobs);
        
        // Initialize notes state
        const notes: {[key: string]: string} = {};
        mockSavedJobs.forEach(job => {
          if (job.notes) {
            notes[job.id] = job.notes;
          }
        });
        setJobNotes(notes);
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load saved jobs. Please try again later.');
        setIsLoading(false);
      }
    };

    loadSavedJobs();
  }, []);

  // Apply filters
  const applyFilters = () => {
    let results = [...savedJobs];
    
    // Filter by status
    if (filters.status !== 'all') {
      results = results.filter(job => job.status === filters.status);
    }
    
    // Sort jobs
    if (filters.sortBy === 'dateDesc') {
      results.sort((a, b) => b.bookmarkedAt.getTime() - a.bookmarkedAt.getTime());
    } else if (filters.sortBy === 'dateAsc') {
      results.sort((a, b) => a.bookmarkedAt.getTime() - b.bookmarkedAt.getTime());
    } else if (filters.sortBy === 'company') {
      results.sort((a, b) => a.company.localeCompare(b.company));
    }
    
    setFilteredJobs(results);
    setShowFilters(false);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: 'all',
      sortBy: 'dateDesc'
    });
    setFilteredJobs(savedJobs);
    setShowFilters(false);
  };

  // Handle status change
  const handleStatusChange = (jobId: string, status: SavedJob['status']) => {
    const updatedJobs = savedJobs.map(job => 
      job.id === jobId ? { ...job, status } : job
    );
    setSavedJobs(updatedJobs);
    
    // Re-apply current filters
    const updated = updatedJobs.filter(job => 
      filters.status === 'all' || job.status === filters.status
    );
    setFilteredJobs(updated);
  };

  // Handle note save
  const handleNoteSave = (jobId: string) => {
    const updatedJobs = savedJobs.map(job => 
      job.id === jobId ? { ...job, notes: jobNotes[jobId] || '' } : job
    );
    setSavedJobs(updatedJobs);
    setShowNotesFor(null);
  };

  // Handle job removal
  const handleRemoveJob = (jobId: string) => {
    const updatedJobs = savedJobs.filter(job => job.id !== jobId);
    setSavedJobs(updatedJobs);
    setFilteredJobs(updatedJobs.filter(job => 
      filters.status === 'all' || job.status === filters.status
    ));
  };

  // Get badge color based on job status
  const getStatusBadgeColor = (status: SavedJob['status']) => {
    switch (status) {
      case 'saved': return 'bg-blue-100 text-blue-800';
      case 'applied': return 'bg-yellow-100 text-yellow-800';
      case 'interviewing': return 'bg-purple-100 text-purple-800';
      case 'offered': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-4">Saved Jobs</h1>
        <p className="text-gray-600 mb-6">
          Keep track of jobs you're interested in and manage your application process
        </p>

        {/* Filters */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter size={18} />
              <span>Filters & Sort</span>
            </button>
          </div>
          <div className="text-gray-500">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
          </div>
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
              <h3 className="font-semibold">Filter & Sort Jobs</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Filter */}
              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Statuses</option>
                  <option value="saved">Saved</option>
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <h4 className="font-medium mb-2">Sort By</h4>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="dateDesc">Date (Newest First)</option>
                  <option value="dateAsc">Date (Oldest First)</option>
                  <option value="company">Company Name</option>
                </select>
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
                Apply
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
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <Bookmark size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Saved Jobs Yet</h2>
          <p className="text-gray-600 mb-6">
            Browse job listings and save the ones you're interested in to keep track of them here.
          </p>
          <Link href="/jobs">
            <span className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
              Browse Jobs
            </span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-1">{job.title}</h2>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Building size={16} className="mr-2" />
                    <span className="mr-4">{job.company}</span>
                    <MapPin size={16} className="mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock size={14} className="mr-1" />
                    <span>Saved on {job.bookmarkedAt.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(job.status)}`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                  
                  {job.salary && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {job.salary}
                    </span>
                  )}
                </div>
              </div>
              
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
              
              {/* Notes Section */}
              <div className="mb-4 border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Notes:</h3>
                  <button 
                    onClick={() => setShowNotesFor(showNotesFor === job.id ? null : job.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {showNotesFor === job.id ? 'Close' : 'Edit'}
                  </button>
                </div>
                
                {showNotesFor === job.id ? (
                  <div>
                    <textarea
                      value={jobNotes[job.id] || ''}
                      onChange={(e) => setJobNotes({...jobNotes, [job.id]: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md mb-2"
                      rows={3}
                      placeholder="Add notes about this job"
                    />
                    <button
                      onClick={() => handleNoteSave(job.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Save Notes
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">
                    {job.notes || 'No notes yet. Click Edit to add some.'}
                  </p>
                )}
              </div>
              
              <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <Link href={`/jobs/${job.id}`}>
                    <span className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                      View Details
                    </span>
                  </Link>
                  <Link href={`/match/${job.id}`}>
                    <span className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                      <BarChart3 size={14} className="mr-1" />
                      Match Resume
                    </span>
                  </Link>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                  <select
                    value={job.status}
                    onChange={(e) => handleStatusChange(job.id, e.target.value as SavedJob['status'])}
                    className="p-1.5 text-sm border border-gray-300 rounded-md"
                  >
                    <option value="saved">Saved</option>
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offered">Offered</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  
                  <button
                    onClick={() => handleRemoveJob(job.id)}
                    className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 