import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const resumeData = await request.json();

    // Validate required fields
    if (!resumeData.personalInfo || !resumeData.personalInfo.name || !resumeData.personalInfo.email) {
      return NextResponse.json(
        { error: 'Missing required personal information' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Save the resume data to a database
    // 2. Generate the resume PDF/DOCX using a library
    // 3. Upload the generated file to storage
    // 4. Return the resume ID and download links

    // Mock response for demonstration
    const resumeId = `resume_${Date.now()}`;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({
      status: 'success',
      resumeId,
      templateUsed: resumeData.templateId || 'professional',
      generationTime: new Date().toISOString(),
      atsScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-99
      downloadLinks: {
        pdf: `/api/download/resume/${resumeId}/pdf`,
        docx: `/api/download/resume/${resumeId}/docx`,
        txt: `/api/download/resume/${resumeId}/txt`
      }
    });
  } catch (error) {
    console.error('Error building resume:', error);
    return NextResponse.json(
      { error: 'Failed to build resume' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Please use POST method to build a resume' },
    { status: 405 }
  );
} 