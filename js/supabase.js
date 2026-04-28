// Supabase Configuration
const SUPABASE_URL = 'https://nynfmzlvgqcxuxwgniht.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'; // Replace with your actual anon key

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export as global
window.supabase = supabaseClient;