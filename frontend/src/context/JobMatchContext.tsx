'use client';

import React, { createContext, useContext, useState } from 'react';
import jobService, { Job, JobMatch } from '../services/jobService';

interface JobMatchContextType {
  jobs: Job[];
  jobMatches: JobMatch[];
  filteredJobs: Job[];
  selectedJob: Job | null;
  loading: boolean;
  error: string | null;
  fetchJobs: () => Promise<Job[]>;
  fetchJobById: (jobId: string) => Promise<Job | null>;
  searchJobs: (query: string) => Promise<void>;
  filterJobsByLocation: (location: string) => Promise<void>;
  filterJobsBySkills: (skills: string[]) => Promise<void>;
  matchResumeWithJobs: (resumeId: string, jobIds?: string[]) => Promise<JobMatch[]>;
  getJobMatchesForResume: (resumeId: string) => Promise<void>;
  setSelectedJob: (job: Job | null) => void;
  resetFilters: () => Promise<void>;
}

const JobMatchContext = createContext<JobMatchContextType | undefined>(undefined);

export function JobMatchProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedJobs = await jobService.getAllJobs();
      setJobs(fetchedJobs);
      setFilteredJobs(fetchedJobs);
      return fetchedJobs;
    } catch (error: any) {
      setError(error.message || 'Failed to fetch jobs');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchJobById = async (jobId: string) => {
    try {
      setLoading(true);
      setError(null);
      const job = await jobService.getJobById(jobId);
      return job;
    } catch (error: any) {
      setError(error.message || `Failed to fetch job with ID ${jobId}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const searchJobs = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!query.trim()) {
        setFilteredJobs(jobs);
        return;
      }
      
      const searchResults = await jobService.searchJobs(query);
      setFilteredJobs(searchResults);
    } catch (error: any) {
      setError(error.message || 'Failed to search jobs');
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterJobsByLocation = async (location: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!location.trim()) {
        setFilteredJobs(jobs);
        return;
      }
      
      const filteredResults = await jobService.filterJobsByLocation(location);
      setFilteredJobs(filteredResults);
    } catch (error: any) {
      setError(error.message || 'Failed to filter jobs by location');
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterJobsBySkills = async (skills: string[]) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!skills.length) {
        setFilteredJobs(jobs);
        return;
      }
      
      const filteredResults = await jobService.filterJobsBySkills(skills);
      setFilteredJobs(filteredResults);
    } catch (error: any) {
      setError(error.message || 'Failed to filter jobs by skills');
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const matchResumeWithJobs = async (resumeId: string, jobIds?: string[]) => {
    try {
      setLoading(true);
      setError(null);
      const matches = await jobService.matchResumeWithJobs(resumeId, jobIds);
      setJobMatches(matches);
      return matches;
    } catch (error: any) {
      setError(error.message || 'Failed to match resume with jobs');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getJobMatchesForResume = async (resumeId: string) => {
    try {
      setLoading(true);
      setError(null);
      const matches = await jobService.getJobMatchesForResume(resumeId);
      setJobMatches(matches);
    } catch (error: any) {
      setError(error.message || 'Failed to get job matches for resume');
      setJobMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    try {
      await fetchJobs();
    } catch (error: any) {
      setError(error.message || 'Failed to reset filters');
    }
  };

  const value = {
    jobs,
    jobMatches,
    filteredJobs,
    selectedJob,
    loading,
    error,
    fetchJobs,
    fetchJobById,
    searchJobs,
    filterJobsByLocation,
    filterJobsBySkills,
    matchResumeWithJobs,
    getJobMatchesForResume,
    setSelectedJob,
    resetFilters,
  };

  return <JobMatchContext.Provider value={value}>{children}</JobMatchContext.Provider>;
}

export function useJobMatch() {
  const context = useContext(JobMatchContext);
  
  if (context === undefined) {
    throw new Error('useJobMatch must be used within a JobMatchProvider');
  }
  
  return context;
}

export default JobMatchContext; 