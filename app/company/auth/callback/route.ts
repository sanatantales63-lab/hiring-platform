import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      'https://rzupnioldebttwozpuga.supabase.co', 
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6dXBuaW9sZGVidHR3b3pwdWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDk3NjQsImV4cCI6MjA4Njk4NTc2NH0.bP01PugxkcqDQogRZfDHKKtErY5FK2wCmf2oD101HGw', 
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {}
          },
        },
      }
    )
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.session) {
      // Login hote hi check karega agar company database me nahi hai, toh add kar dega (Pending status ke sath)
      const user = data.session.user;
      const { data: existingCompany } = await supabase.from('companies').select('id').eq('id', user.id).single();
      
      if (!existingCompany) {
         await supabase.from('companies').insert({
            id: user.id,
            name: user.user_metadata?.full_name || "New Company",
            email: user.email,
            status: "pending"
         });
      }
      return NextResponse.redirect(`${origin}/company/dashboard`)
    }
  }
  return NextResponse.redirect(`${origin}/company/login`)
}