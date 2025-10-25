import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const type = searchParams.get('type')

  // Verificar que sea un token de recuperación
  if (type !== 'recovery' || !token) {
    return NextResponse.redirect(
      new URL('/forgot-password?error=invalid_token', request.url)
    )
  }

  const supabase = await createClient()

  try {
    // Verificar el token con Supabase
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'recovery'
    })

    if (error) {
      console.error('Error verifying token:', error)
      return NextResponse.redirect(
        new URL(`/forgot-password?error=${error.message}`, request.url)
      )
    }

    // Token válido - redirigir a la página de cambio de contraseña
    return NextResponse.redirect(
      new URL(`/forgot-password?token=${token}`, request.url)
    )
  } catch (error) {
    console.error('Error in token verification:', error)
    return NextResponse.redirect(
      new URL('/forgot-password?error=verification_failed', request.url)
    )
  }
}
