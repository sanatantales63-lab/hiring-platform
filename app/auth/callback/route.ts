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
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Server Components mein cookie set error ignore karein
            }
          },
        },
      }
    )
    
    // Google ka code session mein exchange karo
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Login success! Ab Dashboard par bhejo
      return NextResponse.redirect(`${origin}/student/dashboard`)
    }
  }

  // Agar koi error hai toh wapas login page par
  return NextResponse.redirect(`${origin}/student/login`)
}