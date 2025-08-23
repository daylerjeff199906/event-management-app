'use server'
const APP_NAME = process.env.APP_NAME
import { getSupabase } from '@/services/core.supabase'
import { cookies } from 'next/headers'

export async function deleteSession() {
  const cookieStore = await cookies()
  const supabase = await getSupabase()
  await supabase.auth.signOut()
  cookieStore.delete(`${APP_NAME}_session`)
}
