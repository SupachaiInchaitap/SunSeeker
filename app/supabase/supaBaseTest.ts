import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!; // Replace with your Supabase URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Replace with your Supabase key
const supabase = createClient(supabaseUrl, supabaseKey);

export async function testSupabaseConnection() {
  try {
    // Fetch a small piece of data (like the row count from a table, or the auth status)
    const { data, error } = await supabase.from('your-table-name').select().limit(1); // Replace with any existing table

    if (error) {
      console.error('Error fetching data from Supabase:', error);
      return;
    }

    console.log('Successfully connected to Supabase. Data:', data);
  } catch (err) {
    console.error('Error connecting to Supabase:', err);
  }
}