import supabase from '../utils/supabaseClient.js';

export interface Resume {
  id: string;
  title: string;
  content: string;
  file_type: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  atsScore?: number;
  updatedAt?: string; // Alias for updated_at for frontend consistency
}

export interface SectionScore {
  score: number;
  feedback: string;
}

export interface KeywordMatch {
  keyword: string;
  found: boolean;
  importance: string;
  context: string;
}

export interface Recommendation {
  section: string;
  recommendation: string;
  impact: string;
  difficulty: string;
}

export interface ResumeAnalysis {
  id: string;
  resumeId: string;
  overallScore: number;
  contentMatchScore: number;
  formatCompatibilityScore: number;
  sectionEvaluationScore: number;
  sectionScores: {
    [key: string]: SectionScore;
  };
  keywordMatches: KeywordMatch[];
  recommendations: Recommendation[];
  createdAt: string;
}

export const resumeService = {
  /**
   * Upload and analyze a resume
   */
  async uploadAndAnalyzeResume(file: File): Promise<{ analysisId: string; resumeId: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload and analyze resume');
      }

      const data = await response.json();
      return {
        analysisId: data.analysisId,
        resumeId: data.resumeId,
      };
    } catch (error) {
      console.error('Error uploading and analyzing resume:', error);
      throw error;
    }
  },

  /**
   * Get resume analysis by ID
   */
  async getResumeAnalysis(analysisId: string): Promise<ResumeAnalysis | null> {
    try {
      const response = await fetch(`/api/resume-analyses/${analysisId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch resume analysis');
      }
      
      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error('Error fetching resume analysis:', error);
      throw error;
    }
  },

  /**
   * Get resume by ID
   */
  async getResumeById(resumeId: string): Promise<Resume | null> {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', resumeId)
        .single();

      if (error) {
        console.error('Error fetching resume:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching resume:', error);
      throw error;
    }
  },

  /**
   * Get all resumes for the current user
   */
  async getUserResumes(userId?: string): Promise<Resume[]> {
    try {
      let query = supabase.from('resumes').select('*');
      
      // If userId is provided, filter by it
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user resumes:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user resumes:', error);
      throw error;
    }
  },

  /**
   * Get analyses for a specific resume
   */
  async getResumeAnalyses(resumeId: string): Promise<ResumeAnalysis[]> {
    try {
      const { data, error } = await supabase
        .from('resume_analyses')
        .select('*')
        .eq('resumeId', resumeId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching resume analyses:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching resume analyses:', error);
      throw error;
    }
  },

  /**
   * Delete a resume
   */
  async deleteResume(resumeId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId);

      if (error) {
        console.error('Error deleting resume:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  }
};

export default resumeService; 