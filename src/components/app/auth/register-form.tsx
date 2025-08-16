'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
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

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: z.string().email('Ingresa un email válido'),
    confirmEmail: z.string().email('Ingresa un email válido'),
    country: z.string().min(1, 'Selecciona un país'),
    city: z.string().min(1, 'Selecciona una ciudad'),
    gender: z.enum(['male', 'female'], {
      error: 'Selecciona un género'
    }),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Debes aceptar los términos y condiciones'
    }),
    acceptPromotions: z.boolean().optional()
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: 'Los emails no coinciden',
    path: ['confirmEmail']
  })

type RegisterFormData = z.infer<typeof registerSchema>

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      confirmEmail: '',
      country: '',
      city: '',
      gender: undefined,
      acceptTerms: false,
      acceptPromotions: false
    }
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.success('Cuenta creada exitosamente!')
      console.log('Register data:', data)
    } catch {
      toast.error('Error al crear la cuenta. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
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
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-gray-600 uppercase tracking-wide">
                      Nombre
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="JOSE JEFFERSON"
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
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-gray-600 uppercase tracking-wide">
                      Apellido
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="SANTOS PANAFO"
                        className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email Fields */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
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

            <FormField
              control={form.control}
              name="confirmEmail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Repetir correo electrónico"
                      className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="border-gray-200 w-full">
                          <SelectValue placeholder="País" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="peru">Perú</SelectItem>
                          <SelectItem value="colombia">Colombia</SelectItem>
                          <SelectItem value="mexico">México</SelectItem>
                          <SelectItem value="argentina">Argentina</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="border-gray-200 w-full">
                          <SelectValue placeholder="Ciudad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lima">Lima</SelectItem>
                          <SelectItem value="pasco">Pasco</SelectItem>
                          <SelectItem value="arequipa">Arequipa</SelectItem>
                          <SelectItem value="cusco">Cusco</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="text-sm">
                          Hombre
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="text-sm">
                          Mujer
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Checkboxes */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="flex space-x-1 flex-col">
                      <Label className="text-xs text-gray-600 text-nowrap">
                        Acepto los{' '}
                        <Link href="#" className="text-primary hover:underline">
                          Términos y Condiciones
                        </Link>{' '}
                        y la{' '}
                        <Link href="#" className="text-primary hover:underline">
                          Política de Privacidad
                        </Link>
                      </Label>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acceptPromotions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <Label className="text-xs text-gray-600">
                        Doy mi consentimiento para recibir notificaciones y
                        disfrutar de los beneficios, promociones y descuentos
                        creados para mí.
                      </Label>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="text-xs text-gray-500">* Campos obligatorios</div>

            {/* reCAPTCHA placeholder */}
            {/*end reCAPTCHA placeholder */}

            <Button
              type="submit"
              className="w-full  text-white py-3 rounded-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Creando cuenta...' : 'Ingresar'}
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
