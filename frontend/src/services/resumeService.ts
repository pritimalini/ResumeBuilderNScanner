interface Resume {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  atsScore: number | null;
  status: 'draft' | 'complete';
  fileName?: string;
}

// Mock data for resumes
const mockResumes: Resume[] = [
  {
    id: '1',
    title: 'Software Engineer Resume',
    createdAt: new Date('2023-11-10'),
    updatedAt: new Date('2023-11-15'),
    atsScore: 85,
    status: 'complete'
  },
  {
    id: '2',
    title: 'Product Manager Resume',
    createdAt: new Date('2023-10-05'),
    updatedAt: new Date('2023-10-20'),
    atsScore: 78,
    status: 'complete'
  },
  {
    id: '3',
    title: 'UX Designer Draft',
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2023-11-01'),
    atsScore: null,
    status: 'draft'
  }
];

// Service for resume operations
const resumeService = {
  // Get all resumes for a user
  getUserResumes: async (): Promise<Resume[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockResumes;
  },

  // Get a specific resume by ID
  getResumeById: async (id: string): Promise<Resume | null> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const resume = mockResumes.find(r => r.id === id);
    return resume || null;
  },

  // Create a new resume
  createResume: async (title: string): Promise<Resume> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newResume: Resume = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      atsScore: null,
      status: 'draft'
    };
    
    return newResume;
  },

  // Update an existing resume
  updateResume: async (id: string, data: Partial<Resume>): Promise<Resume> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const resumeIndex = mockResumes.findIndex(r => r.id === id);
    if (resumeIndex === -1) {
      throw new Error('Resume not found');
    }
    
    const updatedResume = {
      ...mockResumes[resumeIndex],
      ...data,
      updatedAt: new Date()
    };
    
    return updatedResume;
  },

  // Delete a resume
  deleteResume: async (id: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    return true;
  },

  // Upload a resume file
  uploadResume: async (file: File): Promise<Resume> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const newResume: Resume = {
      id: Math.random().toString(36).substring(2, 9),
      title: file.name.replace(/\.\w+$/, ''),
      createdAt: new Date(),
      updatedAt: new Date(),
      atsScore: null,
      status: 'complete',
      fileName: file.name
    };
    
    return newResume;
  },

  // Analyze a resume against a job description
  analyzeResume: async (resumeId: string, jobDescription?: string): Promise<number> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return a random score between 65 and 95
    const score = Math.floor(Math.random() * 30) + 65;
    return score;
  }
};

export default resumeService;
export type { Resume }; 