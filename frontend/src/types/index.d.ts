import 'react';

declare module 'react' {
  interface CSSProperties {
    [key: string]: any;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Resume Analysis Response Types
export interface KeywordMatch {
  keyword: string;
  found: boolean;
  importance: 'high' | 'medium' | 'low';
  context?: string;
}

export interface SectionScore {
  name: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface ResumeAnalysisResponse {
  resumeId: string;
  overallScore: number;
  sectionScores: SectionScore[];
  keywordMatches: KeywordMatch[];
  missingKeywords: string[];
  recommendations: Recommendation[];
}

export interface Recommendation {
  id: string;
  category: 'format' | 'content' | 'keywords' | 'skills';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  examples?: string[];
}

// Job Description Types
export interface JobDescriptionResponse {
  jobId: string;
  title: string;
  company?: string;
  location?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  qualifications: string[];
  keyPhrases: string[];
}

// Resume Builder Types
export interface ResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
  };
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications?: Certification[];
  projects?: Project[];
  languages?: Language[];
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
  achievements?: string[];
}

export interface Skill {
  id: string;
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  url?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  technologies?: string[];
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Elementary' | 'Limited Working' | 'Professional Working' | 'Full Professional' | 'Native';
}
