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
        { error: 'Analysis ID is required' },
        { status: 400 }
      );
    }
    
    // Try to fetch the analysis from the database
    const { data: analysis, error } = await supabase
      .from('resume_analyses')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching analysis:', error);
      return NextResponse.json(
        { error: 'Failed to fetch analysis data' },
        { status: 500 }
      );
    }
    
    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 