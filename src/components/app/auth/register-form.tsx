'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { toast } from 'react-toastify'
import { AuthLayout } from '../miscellaneous/auth-layout'
import { APP_URL } from '@/data/config-app-url'
import { createClient } from '@/utils/supabase/client'
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'

// Esquema de validación con Zod
const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
    email: z.string().email('Ingresa un email válido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[a-z]/, 'La contraseña debe contener al menos una minúscula')
      .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
      .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
      .regex(
        /[^a-zA-Z0-9]/,
        'La contraseña debe contener al menos un carácter especial'
      ),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  })

type RegisterFormData = z.infer<typeof registerSchema>

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  // Función para evaluar la fortaleza de la contraseña
  const evaluatePasswordStrength = (password: string) => {
    let strength = 0

    // Longitud mínima
    if (password.length >= 8) strength += 20

    // Contiene minúsculas
    if (/[a-z]/.test(password)) strength += 20

    // Contiene mayúsculas
    if (/[A-Z]/.test(password)) strength += 20

    // Contiene números
    if (/[0-9]/.test(password)) strength += 20

    // Contiene caracteres especiales
    if (/[^a-zA-Z0-9]/.test(password)) strength += 20

    setPasswordStrength(strength)
  }

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const supabase = createClient()

      // Registrar usuario con email y contraseña
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username
          }
        }
      })
      console.log('authData', authData)
      if (error) throw error

      // Redirigir a completar perfil
      if (authData.user) {
        window.location.href = '/onboarding'
      } else {
        toast.success(
          '¡Cuenta creada! Por favor revisa tu email para confirmar tu cuenta.'
        )
      }
    } catch {
      toast.error('Error al crear la cuenta. Por favor intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const password = form.watch('password')

  return (
    <AuthLayout
      logoSize={120}
      title="Crea tu cuenta"
      subTitle="Estas a un paso de unirte a nuestra comunidad. Descubre las novedades que tenemos para ti."
      hiddenName
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Bienvenido</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nombre de usuario */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-600 uppercase tracking-wide">
                    Nombre de usuario
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="josejefferson"
                      className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Correo */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-600 uppercase tracking-wide">
                    Correo electrónico
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jose.santos@gmail.com"
                      className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contraseña */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-600 uppercase tracking-wide">
                    Contraseña
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Ingresa tu contraseña"
                        className="border-gray-200 focus:border-teal-500 focus:ring-teal-500 pr-10"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          evaluatePasswordStrength(e.target.value)
                        }}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />

                  {/* Indicador de fortaleza de contraseña */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-500">
                          Seguridad de la contraseña:
                        </span>
                        <span className="text-xs font-medium">
                          {passwordStrength < 60
                            ? 'Débil'
                            : passwordStrength < 80
                            ? 'Media'
                            : 'Fuerte'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            passwordStrength < 60
                              ? 'bg-red-500'
                              : passwordStrength < 80
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>

                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-xs">
                          {password.length >= 8 ? (
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-500 mr-1" />
                          )}
                          Al menos 8 caracteres
                        </div>
                        <div className="flex items-center text-xs">
                          {/[a-z]/.test(password) ? (
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-500 mr-1" />
                          )}
                          Al menos una minúscula
                        </div>
                        <div className="flex items-center text-xs">
                          {/[A-Z]/.test(password) ? (
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-500 mr-1" />
                          )}
                          Al menos una mayúscula
                        </div>
                        <div className="flex items-center text-xs">
                          {/[0-9]/.test(password) ? (
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-500 mr-1" />
                          )}
                          Al menos un número
                        </div>
                        <div className="flex items-center text-xs">
                          {/[^a-zA-Z0-9]/.test(password) ? (
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-500 mr-1" />
                          )}
                          Al menos un carácter especial
                        </div>
                      </div>
                    </div>
                  )}
                </FormItem>
              )}
            />

            {/* Confirmar Contraseña */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-600 uppercase tracking-wide">
                    Confirmar Contraseña
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirma tu contraseña"
                        className="border-gray-200 focus:border-teal-500 focus:ring-teal-500 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botón principal */}
            <Button
              type="submit"
              className="w-full text-white py-3"
              disabled={isLoading}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>

            <div className="flex flex-col items-center">
              <span className="text-gray-500 text-sm mb-2">
                ¿Ya tienes una cuenta?{' '}
                <Link
                  href={APP_URL.AUTH.LOGIN}
                  className="text-primary hover:underline font-semibold"
                >
                  Inicia sesión
                </Link>
              </span>
            </div>
          </form>
        </Form>
      </div>
    </AuthLayout>
  )
}
