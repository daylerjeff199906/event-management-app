'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { configImages } from '@/data/config.images'
// import { fetchLogin } from '@/api/auth'
import { APP_URL } from '@/data/config-app-url'
import { toast } from 'react-toastify'
import { ToastCustom } from '../miscellaneous/toast-custom'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthLayout } from '../miscellaneous/auth-layout'

const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rememberMe: z.boolean().optional()
})

type LoginFormData = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorsList, setErrorsList] = useState<Array<string>>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || null

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setErrorsList([])

    // const response = await fetchLogin(data)
    const response = await Promise.resolve({
      status: 200,
      data: {
        first_name: 'John',
        last_name: 'Doe'
      }
    })
    if (response.status === 200 && response.data) {
      toast.success(
        <ToastCustom
          title="Inicio de sesión exitoso"
          description={`Bienvenido, ${response?.data?.first_name} ${response?.data?.last_name}.`}
        />
      )
      router.push(redirectUrl || APP_URL.DASHBOARD.BASE)
    } else {
      // setErrorsList(response.errors || ['Error desconocido.'])
    }

    setIsLoading(false)
  }

  return (
    <AuthLayout
      hiddenApp
      title="¡Bienvenido!"
      subTitle="Ingresa tus credenciales para acceder a tu cuenta. Descubre las novedades que tenemos para ti."
      backgroundImage={configImages.BACKGROUND_DEFAULT.src}
    >
      <div className="space-y-6 w-full max-w-sm mx-auto">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
            <p className="text-gray-600 text-sm mb-4">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>

          {errorsList?.length > 0 && (
            <section className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative dark:bg-red-500 dark:border-red-400 dark:text-red-100">
              <ul className="flex flex-col gap-1">
                {errorsList?.map((error, index) => (
                  <li
                    key={index}
                    className="text-red-500 text-sm list-disc list-inside"
                  >
                    {error}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">
                      Usuario
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Tu usuario"
                        className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">
                      Contraseña
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Tu contraseña"
                        className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-teal-500 data-[state=checked]:bg-teal-500"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">Recordarme</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <Link
                  href={APP_URL.AUTH.FORGOT_PASSWORD}
                  className="text-sm hover:underline text-primary"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </Form>

          <div className="mt-8 flex flex-col items-center">
            <span className="text-gray-500 text-sm mb-2">
              ¿No tienes cuenta?{' '}
              <Link
                href={APP_URL.AUTH.REGISTER}
                className="text-primary hover:underline font-semibold"
              >
                Regístrate gratis
              </Link>
            </span>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
