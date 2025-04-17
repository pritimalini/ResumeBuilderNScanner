import supabase from '../utils/supabaseClient.js';
import { JobPosting } from '../types/job';

export type Job = JobPosting;

export interface JobMatch {
  jobId: string;
  title: string;
  company: string;
  location: string;
  overallMatchScore: number;
  skillsMatchScore: number;
  experienceMatchScore: number;
  educationMatchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendationToImprove: string;
}

export const jobService = {
  /**
   * Fetch all jobs from the database
   */
  async getAllJobs(): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      throw error;
    }
  },

  /**
   * Fetch a single job by ID
   */
  async getJobById(jobId: string): Promise<Job | null> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) {
        console.error(`Error fetching job with ID ${jobId}:`, error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Failed to fetch job with ID ${jobId}:`, error);
      throw error;
    }
  },

  /**
   * Search for jobs based on a query
   */
  async searchJobs(query: string): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,company.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching jobs:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to search jobs:', error);
      throw error;
    }
  },

  /**
   * Filter jobs by location
   */
  async filterJobsByLocation(location: string): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .ilike('location', `%${location}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error filtering jobs by location:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to filter jobs by location:', error);
      throw error;
    }
  },

  /**
   * Filter jobs by skills
   */
  async filterJobsBySkills(skills: string[]): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*');

      if (error) {
        console.error('Error filtering jobs by skills:', error);
        throw error;
      }

      // Filter jobs that contain at least one of the specified skills
      const filteredJobs = data?.filter((job: Job) => {
        if (!job.skills) return false;
        return skills.some(skill => 
          job.skills.some((jobSkill: string) => 
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
      });

      return filteredJobs || [];
    } catch (error) {
      console.error('Failed to filter jobs by skills:', error);
      throw error;
    }
  },

  /**
   * Match a resume with jobs
   */
  async matchResumeWithJobs(resumeId: string, jobIds?: string[]): Promise<JobMatch[]> {
    try {
      const response = await fetch('/api/match-resume-with-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId,
          jobIds,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data.matches || [];
    } catch (error) {
      console.error('Failed to match resume with jobs:', error);
      throw error;
    }
  },

  /**
   * Get existing job matches for a resume
   */
  async getJobMatchesForResume(resumeId: string): Promise<JobMatch[]> {
    try {
      const { data, error } = await supabase
        .from('resume_job_matches')
        .select(`
          id,
          overall_match_score,
          skills_match_score,
          experience_match_score,
          education_match_score,
          matched_skills,
          missing_skills,
          recommendation,
          jobs (
            id,
            title,
            company,
            location
          )
        `)
        .eq('resume_id', resumeId)
        .order('overall_match_score', { ascending: false });

      if (error) {
        console.error('Error fetching job matches:', error);
        throw error;
      }

      // Transform data to the expected format
      const matches = data?.map((match: any) => ({
        jobId: match.jobs.id,
        title: match.jobs.title,
        company: match.jobs.company,
        location: match.jobs.location,
        overallMatchScore: match.overall_match_score,
        skillsMatchScore: match.skills_match_score,
        experienceMatchScore: match.experience_match_score,
        educationMatchScore: match.education_match_score,
        matchedSkills: match.matched_skills || [],
        missingSkills: match.missing_skills || [],
        recommendationToImprove: match.recommendation || '',
      })) || [];

      return matches;
    } catch (error) {
      console.error('Failed to fetch job matches:', error);
      throw error;
    }
  }
};

export default jobService; 