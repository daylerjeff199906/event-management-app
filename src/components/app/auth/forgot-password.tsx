'use client'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { LoaderIcon, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useRouter, useSearchParams } from 'next/navigation'
import { APP_URL } from '@/data/config-app-url'
import { ForgotPasswordForm } from '@/types/auth/auth.interfaces'
import { ToastCustom } from '../miscellaneous/toast-custom'
import { AuthLayout } from '../miscellaneous/auth-layout'
import { createClient } from '@/utils/supabase/client'

interface IProps {
  email?: string
}

export const ForgotPassword = (props: IProps) => {
  const { email: defaultEmail } = props
  const { control, handleSubmit, watch, formState } =
    useForm<ForgotPasswordForm>({
      defaultValues: {
        email: defaultEmail,
        code: '',
        newPassword: '',
        confirmPassword: ''
      }
    })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [codeSent, setCodeSent] = useState(false)
  const [hasValidToken, setHasValidToken] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const { errors: formErrors } = formState

  useEffect(() => {
    // Verificar si hay un token válido en los parámetros
    const token = searchParams.get('token')
    const error = searchParams.get('error')

    if (error) {
      toast.error(
        <ToastCustom
          title="Error"
          description="El enlace de recuperación es inválido o ha expirado."
        />
      )
    }

    if (token) {
      setHasValidToken(true)
      setCodeSent(true)
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

  const handleSendCode = async (email: string) => {
    setIsLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/forgot-password`
    })

    if (error) {
      toast.error(
        <ToastCustom
          title="Error"
          description={
            error.message || 'No se pudo enviar el código de verificación.'
          }
        />
      )
      setIsLoading(false)
      return false
    }

    toast.success(
      <ToastCustom
        title="¡Código enviado!"
        description="Revisa tu correo electrónico para obtener el código de verificación."
      />
    )
    setCodeSent(true)
    setIsLoading(false)
    return true
  }

  const handleChangePassword = async (data: ForgotPasswordForm) => {
    const { email, newPassword, confirmPassword, code } = data

    if (newPassword !== confirmPassword) {
      toast.error(
        <ToastCustom
          title="Error"
          description="Las contraseñas no coinciden."
        />
      )
      return
    }

    setIsLoading(true)

    if (!codeSent && !hasValidToken) {
      // Primero enviar el código
      await handleSendCode(email)
      return
    }

    // Verificar que el código esté presente (solo si no hay token válido)
    if (!hasValidToken && !code) {
      toast.error(
        <ToastCustom
          title="Error"
          description="El código de verificación es requerido."
        />
      )
      setIsLoading(false)
      return
    }

    try {
      // Si tenemos un token válido de la URL, no necesitamos verificar OTP nuevamente
      if (hasValidToken) {
        // Actualizar la contraseña directamente
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        })

        if (error) throw error
      } else {
        // Verificar el OTP y luego actualizar la contraseña
        const { error: verifyError } = await supabase.auth.verifyOtp({
          email,
          token: code!,
          type: 'recovery'
        })

        if (verifyError) throw verifyError

        // Actualizar la contraseña después de verificar el OTP
        const { error: updateError } = await supabase.auth.updateUser({
          password: newPassword
        })

        if (updateError) throw updateError
      }

      toast.success(
        <ToastCustom
          title="¡Éxito!"
          description="Contraseña cambiada correctamente. Serás redirigido al inicio de sesión en unos segundos."
        />
      )
      setTimeout(() => router.push(APP_URL.AUTH.LOGIN), 2000)
    } catch (error) {
      const errorObj = error as { message: string }

      toast.error(
        <ToastCustom
          title="Error"
          description={errorObj.message || 'No se pudo cambiar la contraseña.'}
        />
      )
      setErrors([errorObj.message])
    }

    setIsLoading(false)
  }

  return (
    <AuthLayout
      hiddenName
      logoSize={120}
      title="Cambiar contraseña"
      subTitle={
        hasValidToken
          ? 'Tu enlace de recuperación es válido. Ingresa tu nueva contraseña.'
          : 'Recupera el acceso a tu cuenta. Ingresa tu correo y espera el código de verificación.'
      }
    >
      <div className="space-y-6 max-w-sm mx-auto">
        <h2 className="text-2xl font-bold">Cambiar contraseña</h2>
        <p className="text-sm text-gray-600">
          {hasValidToken
            ? 'Ingresa tu nueva contraseña.'
            : codeSent
            ? 'Ingresa el código que recibiste por correo y tu nueva contraseña.'
            : 'Por favor, ingresa tu correo electrónico para recibir un código de verificación.'}
        </p>

        {errors.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <button
              onClick={() => setErrors([])}
              className="absolute top-0 right-0 mt-1 mr-2 text-red-500 hover:text-red-700 focus:outline-none"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index} className="text-red-500 text-sm mt-1">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className="space-y-4"
        >
          {!hasValidToken && (
            <>
              <Controller
                name="email"
                control={control}
                defaultValue={defaultEmail}
                rules={{
                  required: 'El correo electrónico es requerido',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'El correo electrónico no es válido'
                  }
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Correo electrónico"
                    disabled={codeSent}
                  />
                )}
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.email.message}
                </p>
              )}
            </>
          )}

          {(codeSent || hasValidToken) && (
            <>
              {!hasValidToken && (
                <>
                  <Controller
                    name="code"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: 'El código de verificación es requerido'
                    }}
                    render={({ field }) => (
                      <Input {...field} placeholder="Código de verificación" />
                    )}
                  />
                  {formErrors.code && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.code.message}
                    </p>
                  )}
                </>
              )}

              <Controller
                name="newPassword"
                control={control}
                defaultValue=""
                rules={{
                  required: 'La nueva contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                  }
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="password"
                    placeholder="Nueva contraseña"
                  />
                )}
              />
              {formErrors?.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors?.newPassword?.message}
                </p>
              )}

              <Controller
                name="confirmPassword"
                control={control}
                defaultValue=""
                rules={{
                  required: 'Debes confirmar tu contraseña',
                  validate: (value) =>
                    value === watch('newPassword') ||
                    'Las contraseñas no coinciden'
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="password"
                    placeholder="Confirmar contraseña"
                  />
                )}
              />
              {formErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.confirmPassword.message}
                </p>
              )}
            </>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <LoaderIcon className="animate-spin mr-2" />}
            {hasValidToken
              ? 'Cambiar contraseña'
              : codeSent
              ? 'Cambiar contraseña'
              : 'Enviar código'}
          </Button>

          <Button
            type="button"
            onClick={() => router.push(APP_URL.AUTH.LOGIN)}
            variant="link"
            className="w-full"
          >
            Regresar al inicio de sesión
          </Button>
        </form>
      </div>
    </AuthLayout>
  )
}
