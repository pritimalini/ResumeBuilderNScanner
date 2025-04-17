// Note: Using JS instead of TS to work around module resolution issues
const { createClient } = require('@supabase/supabase-js');

// Set default values for development if no env variables are present
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-id.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase; 