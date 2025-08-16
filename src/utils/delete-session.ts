'use server'
const APP_NAME = process.env.APP_NAME
import { cookies } from 'next/headers'

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(`${APP_NAME}_session`)
}
