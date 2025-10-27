import { APP_URL } from '@/data/config-app-url'
import { getSupabase } from '@/services/core.supabase'
import { redirect } from 'next/navigation'
import React from 'react'

interface IProps {
  children: React.ReactNode
}

export default async function Layout(props: IProps) {
  const supabase = await getSupabase()
  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    // Si no hay usuario, redirigir a la página de login
    redirect(APP_URL.AUTH.LOGIN)
  }

  // Si hay sesión, continuar con el flujo normal
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.user?.id)
    .maybeSingle()

  if (!profile?.email) {
    // Si el perfil no tiene email, redirigir a la página de onboarding
    redirect(APP_URL.DASHBOARD.BASE)
  }

  return <>{props.children}</>
}
