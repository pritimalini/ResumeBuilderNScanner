interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  skills: string[];
  salary?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for job postings
const mockJobs: JobPosting[] = [
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
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2023-11-01')
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
    createdAt: new Date('2023-10-25'),
    updatedAt: new Date('2023-10-25')
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
    createdAt: new Date('2023-11-05'),
    updatedAt: new Date('2023-11-05')
  }
];

// Service for job operations
const jobService = {
  // Get all job postings
  getAllJobs: async (): Promise<JobPosting[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockJobs;
  },

  // Get a specific job by ID
  getJobById: async (id: string): Promise<JobPosting | null> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const job = mockJobs.find(j => j.id === id);
    return job || null;
  },

  // Search for jobs by query
  searchJobs: async (query: string): Promise<JobPosting[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));
    
    if (!query) return mockJobs;
    
    query = query.toLowerCase();
    return mockJobs.filter(job => 
      job.title.toLowerCase().includes(query) || 
      job.company.toLowerCase().includes(query) ||
      job.skills.some(skill => skill.toLowerCase().includes(query))
    );
  },

  // Create a new job posting (for employers)
  createJob: async (jobData: Omit<JobPosting, 'id' | 'createdAt' | 'updatedAt'>): Promise<JobPosting> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newJob: JobPosting = {
      ...jobData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return newJob;
  },

  // Match a resume against job requirements
  matchResumeToJob: async (resumeId: string, jobId: string): Promise<{
    overallScore: number;
    skillsMatch: { skill: string; matched: boolean }[];
    recommendedSkills: string[];
  }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const job = mockJobs.find(j => j.id === jobId);
    if (!job) {
      throw new Error('Job not found');
    }
    
    // Generate fake match data
    const overallScore = Math.floor(Math.random() * 30) + 65;
    
    const skillsMatch = job.skills.map(skill => ({
      skill,
      matched: Math.random() > 0.3 // 70% chance of matching
    }));
    
    const recommendedSkills = job.skills
      .filter(() => Math.random() > 0.7) // Randomly select some skills as recommended
      .filter((_, index) => !skillsMatch[index].matched); // Only recommend skills that didn't match
    
    return {
      overallScore,
      skillsMatch,
      recommendedSkills
    };
  }
};

export default jobService;
export type { JobPosting }; 