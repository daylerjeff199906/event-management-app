'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  email: z.string().email('Ingresa un email válido')
})

type RegisterFormData = z.infer<typeof registerSchema>

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '' }
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const origin = window.location.origin
      // Tras confirmar el email, pasamos por /auth/confirm y luego iremos a /onboarding
      const next = encodeURIComponent('/onboarding')
      const emailRedirectTo = `${origin}/auth/confirm?next=${next}`

      // Magic link: si el usuario no existe, lo crea y envía link al correo. :contentReference[oaicite:5]{index=5}
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: { emailRedirectTo }
      })

      if (error) throw error

      // Guardamos temporalmente el username para aplicarlo tras el login
      localStorage.setItem('pending_username', data.username)

      toast.success(
        'Te enviamos un enlace a tu correo para completar el acceso.'
      )
    } catch {
      toast.error('Error al crear la cuenta.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      const supabase = createClient()
      const origin = window.location.origin
      // Guardamos el username que haya escrito (si lo hubiera) para onboarding
      const u = form.getValues('username')
      if (u) localStorage.setItem('pending_username', u)

      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
            '/onboarding'
          )}`
        }
      }) // Redirige a Google automáticamente. :contentReference[oaicite:6]{index=6}
    } catch {
      toast.error('Error al iniciar sesión con Google.')
    }
  }

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

            {/* Botón principal */}
            <Button
              type="submit"
              className="w-full text-white py-3 rounded-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta / Enviar enlace'}
            </Button>

            {/* Google */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogle}
              className="w-full py-3 rounded-lg font-medium"
            >
              Continuar con Google
            </Button>

            <div className="flex flex-col items-center">
              <span className="text-gray-500 text-sm mb-2">
                <Link
                  href={APP_URL.AUTH.LOGIN}
                  className="text-primary hover:underline font-semibold"
                >
                  Volver al inicio de sesión
                </Link>
              </span>
            </div>
          </form>
        </Form>
      </div>
    </AuthLayout>
  )
}
