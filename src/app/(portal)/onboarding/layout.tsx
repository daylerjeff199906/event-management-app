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

  return <>{props.children}</>
}
