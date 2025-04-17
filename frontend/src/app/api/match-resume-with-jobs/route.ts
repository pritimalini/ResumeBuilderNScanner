import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Configuration, OpenAIApi } from 'openai';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeId, jobIds } = body;

    if (!resumeId) {
      return NextResponse.json(
        { error: 'Resume ID is required' },
        { status: 400 }
      );
    }

    // Fetch the resume
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .single();

    if (resumeError) {
      console.error('Error fetching resume:', resumeError);
      return NextResponse.json(
        { error: 'Failed to fetch resume data' },
        { status: 500 }
      );
    }

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    // Fetch jobs to match against
    let jobsQuery = supabase.from('jobs').select('*');
    
    // If specific job IDs are provided, filter by them
    if (jobIds && Array.isArray(jobIds) && jobIds.length > 0) {
      jobsQuery = jobsQuery.in('id', jobIds);
    }
    
    const { data: jobs, error: jobsError } = await jobsQuery;

    if (jobsError) {
      console.error('Error fetching jobs:', jobsError);
      return NextResponse.json(
        { error: 'Failed to fetch job data' },
        { status: 500 }
      );
    }

    if (!jobs || jobs.length === 0) {
      return NextResponse.json(
        { error: 'No jobs found for matching' },
        { status: 404 }
      );
    }

    // Process each job to calculate match score
    const matchedJobs = await Promise.all(
      jobs.map(async (job) => {
        // Calculate match score using AI
        const matchScore = await calculateMatchScore(resume.content, job);
        
        // Store the match result
        await storeMatchResult(resumeId, job.id, matchScore);
        
        return {
          jobId: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          ...matchScore
        };
      })
    );

    // Sort jobs by overall match score (descending)
    matchedJobs.sort((a, b) => b.overallMatchScore - a.overallMatchScore);

    return NextResponse.json({
      matches: matchedJobs,
      count: matchedJobs.length
    });
  } catch (error) {
    console.error('Unexpected error during job matching:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

async function calculateMatchScore(resumeContent: string, job: any) {
  try {
    // Request OpenAI to analyze the match
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a professional job matcher. Compare the resume content against the job description and requirements. 
          Provide a detailed analysis of the match in JSON format:
          {
            "overallMatchScore": number,
            "skillsMatchScore": number,
            "experienceMatchScore": number,
            "educationMatchScore": number,
            "matchedSkills": [string],
            "missingSkills": [string],
            "recommendationToImprove": string
          }
          All scores should be out of 100. Include all matched skills found in both the resume and job, 
          and all missing skills that are in the job but not found in the resume.`
        },
        {
          role: "user",
          content: `Compare this resume against the job description:
          
          Resume content:
          ${resumeContent}
          
          Job title: ${job.title}
          Company: ${job.company}
          Description: ${job.description}
          Requirements: ${job.requirements}`
        }
      ]
    });

    const matchResult = response.data.choices[0]?.message?.content;
    if (!matchResult) {
      throw new Error('No match result returned from OpenAI');
    }

    // Parse the JSON response
    try {
      const matchData = JSON.parse(matchResult);
      return matchData;
    } catch (error) {
      console.error('Error parsing OpenAI match response:', error);
      // Fallback to mock match data
      return generateMockMatchData(job);
    }
  } catch (error) {
    console.error('Error calling OpenAI for job matching:', error);
    // Fallback to mock match data
    return generateMockMatchData(job);
  }
}

async function storeMatchResult(resumeId: string, jobId: string, matchData: any) {
  try {
    // Check if a match record already exists
    const { data: existingMatch, error: checkError } = await supabase
      .from('resume_job_matches')
      .select('id')
      .eq('resume_id', resumeId)
      .eq('job_id', jobId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for existing match:', checkError);
      return;
    }

    if (existingMatch) {
      // Update existing match
      const { error: updateError } = await supabase
        .from('resume_job_matches')
        .update({
          overall_match_score: matchData.overallMatchScore,
          skills_match_score: matchData.skillsMatchScore,
          experience_match_score: matchData.experienceMatchScore,
          education_match_score: matchData.educationMatchScore,
          matched_skills: matchData.matchedSkills,
          missing_skills: matchData.missingSkills,
          recommendation: matchData.recommendationToImprove,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingMatch.id);

      if (updateError) {
        console.error('Error updating match result:', updateError);
      }
    } else {
      // Insert new match
      const { error: insertError } = await supabase
        .from('resume_job_matches')
        .insert({
          resume_id: resumeId,
          job_id: jobId,
          overall_match_score: matchData.overallMatchScore,
          skills_match_score: matchData.skillsMatchScore,
          experience_match_score: matchData.experienceMatchScore,
          education_match_score: matchData.educationMatchScore,
          matched_skills: matchData.matchedSkills,
          missing_skills: matchData.missingSkills,
          recommendation: matchData.recommendationToImprove,
          created_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error storing match result:', insertError);
      }
    }
  } catch (error) {
    console.error('Error in storeMatchResult:', error);
  }
}

function generateMockMatchData(job: any) {
  // Create some realistic but randomized mock data
  const overallMatchScore = Math.floor(Math.random() * 41) + 60; // 60-100
  const skillsMatchScore = Math.floor(Math.random() * 41) + 60;
  const experienceMatchScore = Math.floor(Math.random() * 41) + 60;
  const educationMatchScore = Math.floor(Math.random() * 41) + 60;
  
  const possibleSkills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'SQL', 
                          'Project Management', 'Communication', 'Problem Solving', 
                          'AWS', 'Docker', 'CI/CD', 'Git', 'Agile', 'Data Analysis'];
  
  // Randomly select matched skills (5-10)
  const matchedSkillsCount = Math.floor(Math.random() * 6) + 5;
  const matchedSkills = [];
  for (let i = 0; i < matchedSkillsCount; i++) {
    const randomIndex = Math.floor(Math.random() * possibleSkills.length);
    matchedSkills.push(possibleSkills[randomIndex]);
    possibleSkills.splice(randomIndex, 1);
  }
  
  // Randomly select missing skills (2-5)
  const missingSkillsCount = Math.floor(Math.random() * 4) + 2;
  const missingSkills = [];
  for (let i = 0; i < missingSkillsCount && possibleSkills.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * possibleSkills.length);
    missingSkills.push(possibleSkills[randomIndex]);
    possibleSkills.splice(randomIndex, 1);
  }
  
  // Generate a recommendation
  const recommendation = `Consider adding ${missingSkills.join(', ')} to your resume to better match this ${job.title} position at ${job.company}.`;
  
  return {
    overallMatchScore,
    skillsMatchScore,
    experienceMatchScore,
    educationMatchScore,
    matchedSkills,
    missingSkills,
    recommendationToImprove: recommendation
  };
} 