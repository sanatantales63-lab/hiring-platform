import { createBrowserClient } from '@supabase/ssr'

const isBrowser = typeof window !== 'undefined';

// Browser mein Cloudflare bouncer, Server par direct Supabase
const supabaseUrl = isBrowser 
  ? 'https://talexo-api.talexoprivatelimited.workers.dev' 
  : 'https://rzupnioldebttwozpuga.supabase.co';

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6dXBuaW9sZGVidHR3b3pwdWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDk3NjQsImV4cCI6MjA4Njk4NTc2NH0.bP01PugxkcqDQogRZfDHKKtErY5FK2wCmf2oD101HGw';

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);