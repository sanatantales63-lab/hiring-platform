import { createBrowserClient } from '@supabase/ssr'

// Hybrid Approach: Agar environment file fail ho jaye, toh direct fallback URL aur Key use karega
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://talexo-api.talexoprivatelimited.workers.dev';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6dXBuaW9sZGVidHR3b3pwdWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDk3NjQsImV4cCI6MjA4Njk4NTc2NH0.bP01PugxkcqDQogRZfDHKKtErY5FK2wCmf2oD101HGw';

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);