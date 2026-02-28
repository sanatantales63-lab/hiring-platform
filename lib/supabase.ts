import { createBrowserClient } from '@supabase/ssr'

// Hardcoded link hata diya, ab seedha Vercel ke Environment Variables se link aayega
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);