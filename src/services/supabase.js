import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://mbehgukaiafkgmqfeboa.supabase.co';

// JWT expiry time
export const jwtExpiry = 6 * 60 * 60 * 1000;

let supabaseKey = ;
if (import.meta.env.NETLIFY === 'true') {
  supabaseKey = process.env.VITE_SUPABASE_KEY;
} else {
  supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
}
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
