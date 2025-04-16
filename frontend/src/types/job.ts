export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  salary?: string;
  description: string;
  experienceLevel: string;
  employmentType: string;
  skills: string[];
  datePosted: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  requirements?: string[];
  benefits?: string[];
  applicationUrl?: string;
}

export interface JobFilterCriteria {
  query?: string;
  location?: string;
  skills?: string[];
  remote?: boolean;
  experienceLevel?: string;
  employmentType?: string;
} 