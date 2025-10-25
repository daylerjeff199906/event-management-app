import { Suspense } from 'react'
import { ForgotPassword } from '@/components/app/auth/forgot-password'

export default function Page() {
  return (
    <>
      <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
        <ForgotPassword />
      </Suspense>
    </>
  )
}
