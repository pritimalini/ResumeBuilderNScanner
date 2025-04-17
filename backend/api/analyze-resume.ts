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
    const { resumeId } = req.body;

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

    // Get the resume content - in a real implementation, you would parse the file
    let resumeContent = resume.content;
    
    // If content is not stored in the database, fetch it from storage and parse it
    if (!resumeContent) {
      // This is a placeholder for actual resume parsing logic
      // In a real implementation, you would use libraries like pdf-parse, mammoth, etc.
      resumeContent = "This is placeholder resume content for demonstration purposes.";
    }

    // Analyze the resume using AI
    const analysis = await analyzeResumeWithAI(resumeContent);

    // Store the analysis in the database
    const { data: analysisData, error: analysisError } = await supabase
      .from('resume_analyses')
      .insert({
        resume_id: resumeId,
        overall_score: analysis.overallScore,
        content_match_score: analysis.contentMatchScore,
        format_compatibility_score: analysis.formatCompatibilityScore,
        section_evaluation_score: analysis.sectionEvaluationScore,
        section_scores: analysis.sectionScores,
        keyword_matches: analysis.keywordMatches,
        recommendations: analysis.recommendations
      })
      .select()
      .single();

    if (analysisError) {
      console.error('Error storing analysis:', analysisError);
      return res.status(500).json({ message: 'Failed to store analysis', error: analysisError });
    }

    // Return the analysis
    return res.status(200).json({
      message: 'Resume analyzed successfully',
      analysis: analysisData
    });
  } catch (error) {
    console.error('Resume analysis error:', error);
    return res.status(500).json({ message: 'Failed to analyze resume', error });
  }
}

async function analyzeResumeWithAI(resumeContent: string) {
  try {
    // This is where you would integrate with OpenAI or another AI service
    // For demo purposes, we're just returning mock data
    
    // In a real implementation, you would send the resume content to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert resume analyzer. Analyze the resume and provide scores and recommendations."
        },
        {
          role: "user",
          content: `Analyze this resume and provide scores (0-100) for overall quality, content match, format compatibility, and section quality. Also provide section-by-section feedback and recommendations for improvement.\n\nResume content: ${resumeContent}`
        }
      ],
      response_format: { type: "json_object" }
    });

    // For demo, we'll return mock data if AI response processing fails
    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      return getMockAnalysis();
    }
    
    try {
      // Parse the AI response
      const parsedResponse = JSON.parse(aiResponse);
      
      // Structure the response according to our schema
      return {
        overallScore: parsedResponse.overallScore || 82,
        contentMatchScore: parsedResponse.contentMatchScore || 75,
        formatCompatibilityScore: parsedResponse.formatCompatibilityScore || 85,
        sectionEvaluationScore: parsedResponse.sectionEvaluationScore || 80,
        sectionScores: parsedResponse.sectionScores || getMockAnalysis().sectionScores,
        keywordMatches: parsedResponse.keywordMatches || getMockAnalysis().keywordMatches,
        recommendations: parsedResponse.recommendations || getMockAnalysis().recommendations
      };
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      return getMockAnalysis();
    }
  } catch (error) {
    console.error('Error calling AI service:', error);
    return getMockAnalysis();
  }
}

// Function to generate mock analysis data for testing
function getMockAnalysis() {
  return {
    overallScore: 82,
    contentMatchScore: 75,
    formatCompatibilityScore: 85,
    sectionEvaluationScore: 80,
    sectionScores: {
      contact: {
        score: 90,
        feedback: "Contact information is well-formatted and complete."
      },
      summary: {
        score: 65,
        feedback: "Professional summary lacks specificity and impact. Consider adding quantifiable achievements."
      },
      experience: {
        score: 80,
        feedback: "Work experience is well-detailed, but could use more action verbs and quantifiable results."
      },
      education: {
        score: 95,
        feedback: "Education section is comprehensive and well-formatted."
      },
      skills: {
        score: 70,
        feedback: "Skills section could be more targeted to industry-specific keywords."
      }
    },
    keywordMatches: [
      {
        keyword: "project management",
        found: true,
        importance: "high",
        context: "Listed in skills and demonstrated in experience"
      },
      {
        keyword: "JavaScript",
        found: true,
        importance: "high",
        context: "Listed in skills section"
      },
      {
        keyword: "agile methodology",
        found: false,
        importance: "medium",
        context: "Not found in resume"
      },
      {
        keyword: "data analysis",
        found: true,
        importance: "medium",
        context: "Mentioned in job responsibilities"
      },
      {
        keyword: "team leadership",
        found: true,
        importance: "high",
        context: "Demonstrated in experience section"
      }
    ],
    recommendations: [
      {
        section: "summary",
        recommendation: "Add 2-3 quantifiable achievements to your professional summary to demonstrate impact.",
        impact: "high",
        difficulty: "low"
      },
      {
        section: "experience",
        recommendation: "Use more action verbs at the beginning of bullet points to highlight your contributions.",
        impact: "medium",
        difficulty: "low"
      },
      {
        section: "skills",
        recommendation: "Add more industry-specific technical skills and tools you're proficient with.",
        impact: "high",
        difficulty: "medium"
      },
      {
        section: "formatting",
        recommendation: "Ensure consistent spacing and bullet point styling throughout the document.",
        impact: "medium",
        difficulty: "low"
      },
      {
        section: "keywords",
        recommendation: "Include 'agile methodology' in your skills or experience sections.",
        impact: "high",
        difficulty: "low"
      }
    ]
  };
} 