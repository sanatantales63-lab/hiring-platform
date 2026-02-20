import { createBrowserClient } from '@supabase/ssr'

// Apni wahi URL aur Key wapis yahan dalein
const supabaseUrl = 'https://rzupnioldebttwozpuga.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6dXBuaW9sZGVidHR3b3pwdWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDk3NjQsImV4cCI6MjA4Njk4NTc2NH0.bP01PugxkcqDQogRZfDHKKtErY5FK2wCmf2oD101HGw'; 

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);