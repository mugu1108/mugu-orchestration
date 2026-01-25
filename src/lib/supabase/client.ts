import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials. Check your .env file.');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export async function testConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('skills').select('count');
    return !error;
  } catch (error) {
    return false;
  }
}
