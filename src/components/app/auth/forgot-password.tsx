'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ToastCustom } from '../miscellaneous/toast-custom'
import { AuthLayout } from '../miscellaneous/auth-layout'
import { ForgotPasswordSendLink } from './forgot-password-send-link'
import { ForgotPasswordWithToken } from './forgot-password-with-token'
import { ForgotPasswordWithOTP } from './ForgotPasswordWithOTP'
import { toast } from 'react-toastify'

type StepType = 'with-otp' | 'with-token'

interface ForgotPasswordProps {
  token?: string | null
  error?: string | null
  type?: StepType | null
}

export const ForgotPassword = ({ token, error, type }: ForgotPasswordProps) => {
  const [currentStep, setCurrentStep] = useState<'send-link' | 'send-success'>(
    'send-link'
  )
  const [email, setEmail] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()

  const handleLinkSent = (userEmail: string) => {
    setEmail(userEmail)
    setCurrentStep('send-success')
  }

  const handlePasswordChanged = () => {
    // Redirigir después de cambiar la contraseña
    setTimeout(() => router.push('/auth/login'), 2000)
  }

  const getStepTitle = () => {
    switch (type) {
      case 'with-otp':
        return 'Verificar código'
      case 'with-token':
        return 'Cambiar contraseña'
      default:
        return 'Recuperar contraseña'
    }
  }

  const getStepSubtitle = () => {
    switch (type) {
      case 'with-otp':
        return 'Ingresa el código que recibiste por correo y tu nueva contraseña.'
      case 'with-token':
        return 'Tu enlace de recuperación es válido. Ingresa tu nueva contraseña.'
      default:
        return 'Recupera el acceso a tu cuenta.'
    }
  }

  useEffect(() => {
    if (error) {
      toast.error(
        <ToastCustom
          title="Error"
          description={error || 'Ha ocurrido un error.'}
        />
      )
    }
  }, [error])

  return (
    <AuthLayout
      hiddenName
      logoSize={120}
      title={getStepTitle()}
      subTitle={getStepSubtitle()}
    >
      {!token && (
        <>
          {currentStep === 'send-link' && (
            <ForgotPasswordSendLink onLinkSent={handleLinkSent} />
          )}
          {currentStep === 'send-success' && (
            <div className="space-y-6 max-w-sm mx-auto">
              <h2 className="text-2xl font-bold">¡Enlace enviado!</h2>
              <p className="text-sm text-gray-600">
                Revisa tu correo electrónico ({email}) para obtener el enlace de
                recuperación.
              </p>
            </div>
          )}
        </>
      )}
      {token && type === 'with-token' && (
        <ForgotPasswordWithToken onPasswordChanged={handlePasswordChanged} />
      )}

      {token && type === 'with-otp' && (
        <ForgotPasswordWithOTP
          email={searchParams.get('email') || ''}
          onPasswordChanged={handlePasswordChanged}
          onBack={() => router.push('/auth/forgot-password')}
        />
      )}
    </AuthLayout>
  )
}
