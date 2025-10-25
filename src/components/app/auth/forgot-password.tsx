/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ToastCustom } from '../miscellaneous/toast-custom'
import { AuthLayout } from '../miscellaneous/auth-layout'
import { ForgotPasswordSendLink } from './forgot-password-send-link'
import { ForgotPasswordWithToken } from './forgot-password-with-token'
import { ForgotPasswordWithOTP } from './ForgotPasswordWithOTP'
import { toast } from 'react-toastify'

export const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState<
    'send-link' | 'with-otp' | 'with-token'
  >('send-link')
  const [email, setEmail] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get('token')
  const error = searchParams.get('error')
  const type = searchParams.get('type')

  useEffect(() => {
    // Verificar si hay un token válido en los parámetros
    if (error) {
      toast.error(
        <ToastCustom
          title="Error"
          description="El enlace de recuperación es inválido o ha expirado."
        />
      )
    }

    if (token && type === 'recovery') {
      setCurrentStep('with-token')
    }

    // Función para analizar los parámetros del fragmento de la URL
    const parseFragmentParams = () => {
      if (typeof window !== 'undefined') {
        const fragment = window.location.hash.substring(1)
        const params = new URLSearchParams(fragment)

        const fragmentError = params.get('error')
        const errorDescription = params.get('error_description')

        if (fragmentError) {
          const errorMessage = errorDescription
            ? `${fragmentError}: ${errorDescription.replace(/\+/g, ' ')}`
            : 'Ha ocurrido un error inesperado'

          toast.error(<ToastCustom title="Error" description={errorMessage} />)

          // Limpiar el fragmento de la URL
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname + window.location.search
          )
        }
      }
    }

    parseFragmentParams()
  }, [searchParams])

  const handleLinkSent = (userEmail: string) => {
    setEmail(userEmail)
    setCurrentStep('with-otp')
  }

  const handlePasswordChanged = () => {
    // Redirigir después de cambiar la contraseña
    setTimeout(() => router.push('/auth/login'), 2000)
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 'send-link':
        return 'Recuperar contraseña'
      case 'with-otp':
        return 'Verificar código'
      case 'with-token':
        return 'Cambiar contraseña'
      default:
        return 'Recuperar contraseña'
    }
  }

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 'send-link':
        return 'Ingresa tu correo electrónico para recibir un enlace de recuperación.'
      case 'with-otp':
        return 'Ingresa el código que recibiste por correo y tu nueva contraseña.'
      case 'with-token':
        return 'Tu enlace de recuperación es válido. Ingresa tu nueva contraseña.'
      default:
        return 'Recupera el acceso a tu cuenta.'
    }
  }

  return (
    <AuthLayout
      hiddenName
      logoSize={120}
      title={getStepTitle()}
      subTitle={getStepSubtitle()}
    >
      {currentStep === 'send-link' && (
        <ForgotPasswordSendLink onLinkSent={handleLinkSent} />
      )}

      {currentStep === 'with-otp' && (
        <ForgotPasswordWithOTP
          email={email}
          onPasswordChanged={handlePasswordChanged}
          onBack={() => setCurrentStep('send-link')}
        />
      )}

      {currentStep === 'with-token' && (
        <ForgotPasswordWithToken onPasswordChanged={handlePasswordChanged} />
      )}
    </AuthLayout>
  )
}
