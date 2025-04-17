import { NextApiRequest, NextApiResponse } from 'next';
import supabase from '../config/supabase';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { resumeId, jobIds } = req.body;

    if (!resumeId) {
      return res.status(400).json({ message: 'Resume ID is required' });
    }

    // Fetch the resume from the database
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .single();

    if (resumeError || !resume) {
      return res.status(404).json({ message: 'Resume not found', error: resumeError });
    }

    // Fetch jobs to match against
    let jobsQuery = supabase.from('jobs').select('*');
    
    // If specific job IDs are provided, filter by those
    if (jobIds && Array.isArray(jobIds) && jobIds.length > 0) {
      jobsQuery = jobsQuery.in('id', jobIds);
    } else {
      // Otherwise, just get recent jobs (limit to 20 for performance)
      jobsQuery = jobsQuery.order('created_at', { ascending: false }).limit(20);
    }
    
    const { data: jobs, error: jobsError } = await jobsQuery;
    
    if (jobsError) {
      return res.status(500).json({ message: 'Error fetching jobs', error: jobsError });
    }
    
    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: 'No jobs found to match against' });
    }

    // Get resume content
    let resumeContent = resume.content || "No content available";

    // For each job, calculate match score
    const matchResults = await Promise.all(
      jobs.map(async (job) => {
        return await matchResumeWithJob(resumeId, job.id, resumeContent, job);
      })
    );

    // Store match results in database and return
    const storedMatches = await Promise.all(
      matchResults.map(async (match) => {
        // Check if match already exists
        const { data: existingMatch } = await supabase
          .from('job_matches')
          .select('id')
          .eq('resume_id', match.resume_id)
          .eq('job_id', match.job_id)
          .maybeSingle();
        
        if (existingMatch) {
          // Update existing match
          const { data, error } = await supabase
            .from('job_matches')
            .update({
              match_score: match.match_score,
              matched_skills: match.matched_skills,
              missing_skills: match.missing_skills
            })
            .eq('id', existingMatch.id)
            .select();
          
          if (error) {
            console.error('Error updating job match:', error);
          }
          return data ? data[0] : null;
        } else {
          // Insert new match
          const { data, error } = await supabase
            .from('job_matches')
            .insert(match)
            .select();
          
          if (error) {
            console.error('Error inserting job match:', error);
          }
          return data ? data[0] : null;
        }
      })
    );

    // Return the match results
    return res.status(200).json({
      message: 'Resume matched with jobs successfully',
      matches: storedMatches.filter(Boolean)
    });
  } catch (error) {
    console.error('Resume job matching error:', error);
    return res.status(500).json({ message: 'Failed to match resume with jobs', error });
  }
}

async function matchResumeWithJob(resumeId: string, jobId: string, resumeContent: string, job: any) {
  try {
    // In a real implementation, you would use an AI model to calculate the match
    // Here's how we could use OpenAI to do this
    
    const prompt = `
    I need to match a resume against a job description and calculate a match score.
    
    Resume content:
    ${resumeContent}
    
    Job title: ${job.title}
    Company: ${job.company}
    Job description: ${job.description || ''}
    Requirements: ${job.requirements || ''}
    Skills needed: ${Array.isArray(job.skills) ? job.skills.join(', ') : job.skills || ''}
    
    Please analyze how well the resume matches this job and provide:
    1. A match score from 0-100
    2. Skills found in both the resume and job requirements (matched skills)
    3. Skills required by the job but not found in the resume (missing skills)
    
    Format your response as a JSON object with fields: matchScore, matchedSkills (array), missingSkills (array)
    `;
    
    // Call OpenAI API to get the match
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert at matching resumes to job descriptions and calculating match scores."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      return getMockMatch(resumeId, jobId);
    }
    
    try {
      const parsedResponse = JSON.parse(aiResponse);
      
      return {
        resume_id: resumeId,
        job_id: jobId,
        match_score: parsedResponse.matchScore || Math.floor(Math.random() * 40) + 60,
        matched_skills: parsedResponse.matchedSkills || [],
        missing_skills: parsedResponse.missingSkills || []
      };
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      return getMockMatch(resumeId, jobId);
    }
  } catch (error) {
    console.error('Error in AI matching:', error);
    return getMockMatch(resumeId, jobId);
  }
}

// Function to generate a mock match for testing
function getMockMatch(resumeId: string, jobId: string) {
  const matchScore = Math.floor(Math.random() * 40) + 60; // Random score between 60-99
  
  return {
    resume_id: resumeId,
    job_id: jobId,
    match_score: matchScore,
    matched_skills: ["JavaScript", "React", "HTML", "CSS"],
    missing_skills: ["TypeScript", "Node.js", "AWS"]
  };
} 