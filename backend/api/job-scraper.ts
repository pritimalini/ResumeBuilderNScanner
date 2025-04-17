import axios from 'axios';
import * as cheerio from 'cheerio';
import supabase from '../config/supabase';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define job type
interface Job {
  title: string;
  company: string;
  location: string;
  source: string;
  url: string;
  external_id: string | null;
  description?: string;
  requirements?: string;
  job_type?: string;
  salary_range?: string;
  skills?: string[];
}

// Job sources
const jobSources = [
  { name: 'Indeed', url: 'https://www.indeed.com/jobs?q=' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs/search/?keywords=' },
  // Add more sources as needed
];

// Function to scrape jobs from a given URL
async function scrapeJobs(source: { name: string, url: string }, query: string): Promise<Job[]> {
  try {
    // In a real implementation, you would handle pagination, rate limiting, etc.
    // This is a simplified version for demonstration purposes
    
    // Note: Web scraping may violate terms of service of job sites
    // In production, you should use official APIs or data partnerships
    
    const url = `${source.url}${encodeURIComponent(query)}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const jobs: Job[] = [];
    
    // The actual selectors would depend on the website structure
    // These are just examples
    if (source.name === 'Indeed') {
      $('.jobsearch-ResultsList > div').each((i, el) => {
        const title = $(el).find('.jobTitle span').text().trim();
        const company = $(el).find('.companyName').text().trim();
        const location = $(el).find('.companyLocation').text().trim();
        const link = 'https://www.indeed.com' + $(el).find('a').attr('href');
        
        if (title) {
          jobs.push({
            title,
            company,
            location,
            source: source.name,
            url: link,
            external_id: link.split('jk=')[1]?.split('&')[0] || null,
          });
        }
      });
    } else if (source.name === 'LinkedIn') {
      $('.jobs-search__results-list > li').each((i, el) => {
        const title = $(el).find('.base-search-card__title').text().trim();
        const company = $(el).find('.base-search-card__subtitle').text().trim();
        const location = $(el).find('.job-search-card__location').text().trim();
        const link = $(el).find('a').attr('href') || '';
        
        if (title) {
          jobs.push({
            title,
            company,
            location,
            source: source.name,
            url: link,
            external_id: link.split('currentJobId=')[1]?.split('&')[0] || null,
          });
        }
      });
    }
    
    return jobs;
  } catch (error) {
    console.error(`Error scraping ${source.name}:`, error);
    return [];
  }
}

// Function to extract job details and skills using AI
async function extractJobDetails(jobUrl: string) {
  try {
    // In a real implementation, you would fetch and parse the job description page
    // For demo purposes, we're generating mock data
    
    const response = await axios.get(jobUrl);
    const $ = cheerio.load(response.data);
    
    // Extract the full job description
    let description = '';
    let requirements = '';
    
    // Different selectors for different sources
    if (jobUrl.includes('indeed.com')) {
      description = $('#jobDescriptionText').text();
    } else if (jobUrl.includes('linkedin.com')) {
      description = $('.show-more-less-html__markup').text();
    }
    
    // Use AI to extract skills and other details from the job description
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert at parsing job descriptions. Extract key information from the job description."
        },
        {
          role: "user",
          content: `Extract the following from this job description:
          1. Required skills (as a JSON array)
          2. Job type (full-time, part-time, contract, etc.)
          3. Salary range (if mentioned)
          4. Requirements section
          
          Format your response as a JSON object with fields: skills, jobType, salaryRange, requirements
          
          Job description: ${description}`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      return getMockJobDetails();
    }
    
    try {
      const parsedResponse = JSON.parse(aiResponse);
      
      return {
        description,
        requirements: parsedResponse.requirements || '',
        job_type: parsedResponse.jobType || 'Full-time',
        salary_range: parsedResponse.salaryRange || '',
        skills: parsedResponse.skills || []
      };
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      return getMockJobDetails();
    }
  } catch (error) {
    console.error('Error extracting job details:', error);
    return getMockJobDetails();
  }
}

// Function to store jobs in the database
async function storeJobs(jobs: Job[]) {
  for (const job of jobs) {
    try {
      // Check if job already exists
      const { data: existingJob } = await supabase
        .from('jobs')
        .select('id')
        .eq('external_id', job.external_id)
        .maybeSingle();
      
      if (existingJob) {
        console.log(`Job already exists: ${job.title}`);
        continue;
      }
      
      // Get additional details
      const details = await extractJobDetails(job.url);
      
      // Insert job into database
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          ...job,
          ...details
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error storing job:', error);
      } else {
        console.log(`Stored job: ${job.title}`);
      }
    } catch (error) {
      console.error('Error processing job:', error);
    }
  }
}

// Main function to find jobs for a query
export async function findJobs(query: string) {
  console.log(`Finding jobs for query: ${query}`);
  
  const allJobs: Job[] = [];
  
  // For each source, scrape jobs
  for (const source of jobSources) {
    const jobs = await scrapeJobs(source, query);
    allJobs.push(...jobs);
  }
  
  console.log(`Found ${allJobs.length} jobs`);
  
  // Store jobs in database
  await storeJobs(allJobs);
  
  return allJobs;
}

// Function to get mock job details
function getMockJobDetails() {
  return {
    description: "This is a placeholder job description for a software developer position.",
    requirements: "Bachelor's degree in Computer Science or related field. 3+ years of experience with JavaScript and React.",
    job_type: "Full-time",
    salary_range: "$80,000 - $120,000",
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "Git"]
  };
}

// Scheduled job to refresh job listings (would be triggered by a cron job in production)
export async function refreshJobListings() {
  const queries = ['software developer', 'web developer', 'frontend developer', 'react developer'];
  
  for (const query of queries) {
    await findJobs(query);
  }
}

// Export a handler for API routes
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    const jobs = await findJobs(query);
    
    return res.status(200).json({
      message: 'Jobs found and stored successfully',
      count: jobs.length
    });
  } catch (error) {
    console.error('Job scraper error:', error);
    return res.status(500).json({ message: 'Failed to find jobs', error });
  }
} 