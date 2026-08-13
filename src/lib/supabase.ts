import { createClient } from '@supabase/supabase-js';

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[Rituno] VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias. Configure-as na Vercel em Settings > Environment Variables.'
  );
}

// Garantir que a URL tem http/https para não crachar o SDK do Supabase
if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  supabaseUrl = 'https://' + supabaseUrl;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
