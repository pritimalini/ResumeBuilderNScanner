-- Resume Builder & Scanner Database Schema

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  salary_range VARCHAR(100),
  description TEXT NOT NULL,
  requirements TEXT,
  skills TEXT[],
  job_type VARCHAR(100),
  link VARCHAR(500),
  source VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Resume analyses table
CREATE TABLE IF NOT EXISTS resume_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resumeId UUID REFERENCES resumes(id) ON DELETE CASCADE,
  overallScore INTEGER NOT NULL,
  contentMatchScore INTEGER NOT NULL,
  formatCompatibilityScore INTEGER NOT NULL,
  sectionEvaluationScore INTEGER NOT NULL,
  sectionScores JSONB NOT NULL,
  keywordMatches JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Resume-Job matches table
CREATE TABLE IF NOT EXISTS resume_job_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  overall_match_score INTEGER NOT NULL,
  skills_match_score INTEGER NOT NULL,
  experience_match_score INTEGER NOT NULL,
  education_match_score INTEGER NOT NULL,
  matched_skills TEXT[],
  missing_skills TEXT[],
  recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(resume_id, job_id)
);

-- Users table (for future authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraints
ALTER TABLE resumes
ADD CONSTRAINT fk_user_id
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_jobs_title_company ON jobs(title, company);
CREATE INDEX idx_resume_analyses_resume_id ON resume_analyses(resumeId);
CREATE INDEX idx_resume_job_matches_resume_id ON resume_job_matches(resume_id);
CREATE INDEX idx_resume_job_matches_job_id ON resume_job_matches(job_id);

-- Functions for automatic updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic updated_at
CREATE TRIGGER update_resumes_modtime
BEFORE UPDATE ON resumes
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_jobs_modtime
BEFORE UPDATE ON jobs
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_resume_analyses_modtime
BEFORE UPDATE ON resume_analyses
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_resume_job_matches_modtime
BEFORE UPDATE ON resume_job_matches
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;  -- For text search capabilities 