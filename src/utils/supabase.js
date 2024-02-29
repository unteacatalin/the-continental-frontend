import { createClient } from '@supabase/supabase-js';

let supabaseKey;
let supabaseUrl;

if (import.meta.env.NETLIFY === 'true') {
    supabaseKey = process.env.VITE_SUPABASE_KEY;
    supabaseUrl = process.env.VITE_SUPABASE_URL;
  } else {
    supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
    supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

export {supabaseUrl};

export default supabase;
