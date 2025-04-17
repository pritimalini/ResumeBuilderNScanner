import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Resume ID is required' },
        { status: 400 }
      );
    }
    
    // Try to fetch the resume from the database
    const { data: resume, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching resume:', error);
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
    
    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 