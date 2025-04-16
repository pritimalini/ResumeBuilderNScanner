import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.' },
        { status: 400 }
      );
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds the 5MB limit.' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Save the file to a storage service (S3, etc)
    // 2. Process the resume using a service/library
    // 3. Return the analysis results

    // Mock response for demonstration
    const resumeId = `resume_${Date.now()}`;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      status: 'success',
      resumeId,
      filename: file.name,
      content_type: file.type,
      file_size: file.size,
      upload_time: new Date().toISOString(),
      sections_found: [
        'contact',
        'summary',
        'experience',
        'education',
        'skills'
      ],
      word_count: 450,
      parsed_content: {
        // Mock parsed content
        contact: {
          name: 'Alex Johnson',
          email: 'alex@example.com',
          phone: '(123) 456-7890'
        },
        // Other sections would be included here
      }
    });
  } catch (error) {
    console.error('Error processing resume upload:', error);
    return NextResponse.json(
      { error: 'Failed to process resume' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Please use POST method to upload and analyze a resume' },
    { status: 405 }
  );
} 