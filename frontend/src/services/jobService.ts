import { JobPosting } from "@/types/job";

// Mock job data
const mockJobs: JobPosting[] = [
  {
    id: "job-1",
    title: "Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    remote: true,
    salary: "$90,000 - $120,000",
    description: "We are looking for a skilled Frontend Developer to join our team. The ideal candidate will have experience with React, Next.js, and TypeScript.",
    experienceLevel: "Mid-Level",
    employmentType: "Full-time",
    skills: ["React", "TypeScript", "HTML/CSS", "Next.js", "Redux"],
    datePosted: "2023-10-15",
    requirements: [
      "3+ years of experience with React",
      "Strong knowledge of TypeScript",
      "Experience with state management (Redux, Context API)",
      "Bachelor's degree in Computer Science or related field"
    ],
    benefits: [
      "Flexible working hours",
      "Remote work options",
      "Health insurance",
      "401(k) matching",
      "Professional development budget"
    ],
    applicationUrl: "https://techcorp.com/careers/frontend-developer"
  },
  {
    id: "job-2",
    title: "UX/UI Designer",
    company: "Creative Solutions",
    location: "New York, NY",
    remote: false,
    salary: "$80,000 - $110,000",
    description: "Creative Solutions is seeking a talented UX/UI Designer to create beautiful, intuitive user experiences for our clients. You will work closely with our development team to transform concepts into user-friendly interfaces.",
    experienceLevel: "Senior",
    employmentType: "Full-time",
    skills: ["Figma", "Adobe XD", "Sketch", "User Research", "Prototyping"],
    datePosted: "2023-10-10",
    requirements: [
      "5+ years of experience in UX/UI design",
      "Portfolio demonstrating strong design skills",
      "Experience with user research and testing",
      "Excellent communication skills"
    ],
    benefits: [
      "Creative work environment",
      "Health and dental insurance",
      "Paid time off",
      "Design conference stipend"
    ]
  },
  {
    id: "job-3",
    title: "Data Scientist",
    company: "Insight Analytics",
    location: "Boston, MA",
    remote: true,
    salary: "$120,000 - $150,000",
    description: "Join our data science team to develop machine learning models and analyze complex datasets. You will help drive business decisions through data insights and build predictive models.",
    experienceLevel: "Senior",
    employmentType: "Full-time",
    skills: ["Python", "Machine Learning", "SQL", "Data Visualization", "Statistical Analysis"],
    datePosted: "2023-10-05",
    requirements: [
      "Master's or PhD in Computer Science, Statistics, or related field",
      "Experience with machine learning frameworks (TensorFlow, PyTorch)",
      "Strong SQL skills",
      "Experience with data visualization tools"
    ],
    benefits: [
      "Flexible schedule",
      "Remote work option",
      "Comprehensive benefits package",
      "Continuing education support"
    ]
  },
  {
    id: "job-4",
    title: "Backend Developer",
    company: "ServerStack",
    location: "Seattle, WA",
    remote: true,
    salary: "$95,000 - $130,000",
    description: "ServerStack is looking for a Backend Developer to build robust and scalable server-side applications. You will be responsible for implementing API endpoints, optimizing database queries, and ensuring high performance.",
    experienceLevel: "Mid-Level",
    employmentType: "Full-time",
    skills: ["Node.js", "Express", "MongoDB", "RESTful APIs", "GraphQL"],
    datePosted: "2023-10-12",
    requirements: [
      "3+ years of experience with Node.js",
      "Experience with NoSQL databases",
      "Knowledge of API design principles",
      "Understanding of server security concepts"
    ],
    benefits: [
      "Competitive salary",
      "Health and wellness benefits",
      "Flexible work environment",
      "Professional development opportunities"
    ]
  },
  {
    id: "job-5",
    title: "Full Stack Developer",
    company: "Innovate Solutions",
    location: "Austin, TX",
    remote: false,
    salary: "$100,000 - $140,000",
    description: "We're seeking a Full Stack Developer who can work on both frontend and backend technologies. You'll be involved in all stages of development, from concept to deployment.",
    experienceLevel: "Senior",
    employmentType: "Full-time",
    skills: ["JavaScript", "React", "Node.js", "SQL", "AWS", "Docker"],
    datePosted: "2023-10-08",
    requirements: [
      "5+ years of full stack development experience",
      "Strong JavaScript skills",
      "Experience with cloud services (AWS, Azure, GCP)",
      "Knowledge of CI/CD pipelines"
    ],
    benefits: [
      "Competitive compensation package",
      "Health and retirement benefits",
      "Flexible work hours",
      "Modern office environment"
    ]
  }
];

class JobService {
  // Get all jobs
  async getAllJobs(): Promise<JobPosting[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockJobs);
      }, 800);
    });
  }

  // Get job by ID
  async getJobById(id: string): Promise<JobPosting | null> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const job = mockJobs.find(job => job.id === id);
        resolve(job || null);
      }, 500);
    });
  }

  // Search jobs by query (title, company, description)
  async searchJobs(query: string): Promise<JobPosting[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!query.trim()) {
          resolve(mockJobs);
          return;
        }
        
        const lowerQuery = query.toLowerCase();
        const filtered = mockJobs.filter(job => 
          job.title.toLowerCase().includes(lowerQuery) ||
          job.company.toLowerCase().includes(lowerQuery) ||
          job.description.toLowerCase().includes(lowerQuery) ||
          job.skills.some((skill: string) => skill.toLowerCase().includes(lowerQuery))
        );
        
        resolve(filtered);
      }, 600);
    });
  }

  // Match resume to job
  async matchResumeToJob(jobId: string, resumeId: string): Promise<{
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    feedback: string;
  }> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const job = mockJobs.find(job => job.id === jobId);
        
        if (!job) {
          throw new Error("Job not found");
        }
        
        // Mock match result - in a real app this would analyze the resume against the job
        const matchedSkills = job.skills.filter((_, index) => index % 2 === 0);
        const missingSkills = job.skills.filter((_, index) => index % 2 !== 0);
        const score = Math.floor(70 + Math.random() * 30);
        
        resolve({
          score,
          matchedSkills,
          missingSkills,
          feedback: score > 80 
            ? "Your resume is a strong match for this position. Consider highlighting your experience with " + matchedSkills.join(", ") + "."
            : "Your resume partially matches this job. Consider adding more details about your experience with " + missingSkills.join(", ") + "."
        });
      }, 1200);
    });
  }
}

export const jobService = new JobService(); 