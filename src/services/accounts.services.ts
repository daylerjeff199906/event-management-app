'use server'
import { getSupabase } from './core.supabase'
// import {
//   PersonalInfo,
//   Interests,
//   Notifications
// } from '@/modules/portal/lib/validations'

export async function createAccount(email: string, password: string) {
  const supabase = getSupabase()
  const { data, error } = await (
    await supabase
  ).auth.signUp({
    email,
    password
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteAccount(userId: string) {
  const supabase = getSupabase()
  const { error } = await (await supabase)
    .from('users')
    .delete()
    .eq('id', userId)

  if (error) {
    throw new Error(error.message)
  }

  return { success: true }
}
