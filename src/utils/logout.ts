import { deleteSession } from './delete-session'

export async function handleLogout(redirectUrl: string) {
  await deleteSession()
  window.location.href = redirectUrl
}
