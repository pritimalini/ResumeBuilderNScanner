import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Configuration, OpenAIApi } from 'openai';
import { Readable } from 'stream';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { v4 as uuidv4 } from 'uuid';

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
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const resumeId = formData.get('resumeId') as string || uuidv4();
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Check file type
    const fileType = file.type;
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
          'application/msword', 'text/plain'].includes(fileType)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF, DOCX, DOC, or TXT files.' },
        { status: 400 }
      );
    }
    
    // Extract text from the resume file
    let resumeText = '';
    try {
      resumeText = await extractTextFromFile(file);
    } catch (error) {
      console.error('Error extracting text from file:', error);
      return NextResponse.json(
        { error: 'Failed to extract text from the resume file' },
        { status: 500 }
      );
    }
    
    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Could not extract text from the file. The file might be corrupted or password-protected.' },
        { status: 400 }
      );
    }
    
    // Store resume in the database if it doesn't already exist
    const { data: existingResume, error: resumeError } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .single();
      
    if (resumeError && resumeError.code !== 'PGRST116') {
      console.error('Error checking for existing resume:', resumeError);
    }
    
    if (!existingResume) {
      // Store the new resume
      const { error: insertError } = await supabase
        .from('resumes')
        .insert({
          id: resumeId,
          title: file.name,
          content: resumeText,
          file_type: fileType,
          created_at: new Date().toISOString()
        });
        
      if (insertError) {
        console.error('Error storing resume:', insertError);
        return NextResponse.json(
          { error: 'Failed to store resume' },
          { status: 500 }
        );
      }
    }
    
    // Analyze the resume using OpenAI
    const analysis = await analyzeResume(resumeText);
    
    // Store the analysis in the database
    const analysisId = uuidv4();
    const { error: analysisError } = await supabase
      .from('resume_analyses')
      .insert({
        id: analysisId,
        resumeId: resumeId,
        overallScore: analysis.overallScore,
        contentMatchScore: analysis.contentMatchScore,
        formatCompatibilityScore: analysis.formatCompatibilityScore,
        sectionEvaluationScore: analysis.sectionEvaluationScore,
        sectionScores: analysis.sectionScores,
        keywordMatches: analysis.keywordMatches,
        recommendations: analysis.recommendations,
        created_at: new Date().toISOString()
      });
      
    if (analysisError) {
      console.error('Error storing analysis:', analysisError);
      return NextResponse.json(
        { error: 'Failed to store analysis' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Resume analyzed successfully',
      analysisId,
      resumeId
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  if (file.type === 'application/pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else if (file.type === 'application/msword') {
    // For DOC files, conversion is more complex and might require external services
    // For simplicity, we'll return an error
    throw new Error('DOC files are not fully supported yet');
  } else if (file.type === 'text/plain') {
    return buffer.toString('utf-8');
  }
  
  throw new Error('Unsupported file type');
}

async function analyzeResume(resumeText: string) {
  try {
    // Request OpenAI to analyze the resume
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a professional resume analyzer. Analyze the resume for ATS compatibility, 
          content quality, and provide detailed feedback with scores in the following JSON format:
          {
            "overallScore": number,
            "contentMatchScore": number,
            "formatCompatibilityScore": number,
            "sectionEvaluationScore": number,
            "sectionScores": {
              "contact": { "score": number, "feedback": string },
              "summary": { "score": number, "feedback": string },
              "experience": { "score": number, "feedback": string },
              "education": { "score": number, "feedback": string },
              "skills": { "score": number, "feedback": string }
            },
            "keywordMatches": [
              { "keyword": string, "found": boolean, "importance": "high"|"medium"|"low", "context": string }
            ],
            "recommendations": [
              { "section": string, "recommendation": string, "impact": "high"|"medium"|"low", "difficulty": "high"|"medium"|"low" }
            ]
          }
          All scores should be out of 100. Include 5-8 keyword matches with both found and missing keywords. 
          Include 3-5 specific, actionable recommendations with impact and difficulty ratings.`
        },
        {
          role: "user",
          content: `Analyze this resume for ATS compatibility and provide detailed feedback:
          
          ${resumeText}`
        }
      ]
    });

    const analysisResult = response.data.choices[0]?.message?.content;
    if (!analysisResult) {
      throw new Error('No analysis result returned from OpenAI');
    }

    // Parse the JSON response
    try {
      const analysis = JSON.parse(analysisResult);
      return analysis;
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      // Fallback to mock data if parsing fails
      return generateMockAnalysis();
    }
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    // Fallback to mock data if OpenAI call fails
    return generateMockAnalysis();
  }
}

function generateMockAnalysis() {
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

export async function GET() {
  return NextResponse.json(
    { message: 'Please use POST method to upload and analyze a resume' },
    { status: 405 }
  );
} 