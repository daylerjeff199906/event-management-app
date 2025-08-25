// app/auth/callback/route.ts
import { createClient } from '@/utils/supabase/client'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirigir al usuario a la página de cambio de contraseña
  return NextResponse.redirect(new URL('/forgot-password', request.url))
}
