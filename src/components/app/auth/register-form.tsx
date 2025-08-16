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
import Image from 'next/image'

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
    <div className="flex h-screen">
      {/* Formulario (25% del ancho) */}
      <div className="w-1/3 p-8 overflow-y-auto bg-white">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Bienvenido a Joinnus
            </h1>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                            <SelectTrigger className="border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                              <SelectValue placeholder="País" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="peru">Perú</SelectItem>
                              <SelectItem value="colombia">Colombia</SelectItem>
                              <SelectItem value="mexico">México</SelectItem>
                              <SelectItem value="argentina">
                                Argentina
                              </SelectItem>
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
                            <SelectTrigger className="border-gray-200 focus:border-teal-500 focus:ring-teal-500">
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
                            <RadioGroupItem
                              value="male"
                              id="male"
                              className="border-teal-500 text-teal-500"
                            />
                            <Label htmlFor="male" className="text-sm">
                              Hombre
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="female"
                              id="female"
                              className="border-teal-500 text-teal-500"
                            />
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
                            className="border-teal-500 data-[state=checked]:bg-teal-500"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <Label className="text-sm">
                            He leído y acepto los{' '}
                            <Link
                              href="#"
                              className="text-teal-600 hover:underline"
                            >
                              Términos y Condiciones
                            </Link>{' '}
                            y la{' '}
                            <Link
                              href="#"
                              className="text-teal-600 hover:underline"
                            >
                              Política de Privacidad
                            </Link>
                          </Label>
                        </div>
                        <FormMessage />
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
                            className="border-teal-500 data-[state=checked]:bg-teal-500"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <Label className="text-sm">
                            Doy mi consentimiento para recibir notificaciones y
                            disfrutar de los beneficios, promociones y
                            descuentos creados para mí.
                          </Label>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="text-xs text-gray-500">
                  * Campos obligatorios
                </div>

                {/* reCAPTCHA placeholder */}
                <div className="bg-gray-50 border border-gray-200 rounded p-4 flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 border-2 border-gray-300 rounded"></div>
                    <span className="text-sm text-gray-600">
                      No soy un robot
                    </span>
                    <div className="ml-4">
                      <div className="w-8 h-8 bg-blue-500 rounded"></div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creando cuenta...' : 'Ingresar'}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <div className="text-xs text-gray-500 mb-2">Powered by</div>
              <div className="text-sm font-semibold text-gray-700">JOINNUS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Imagen (75% del ancho) */}
      <div className="w-2/3 bg-gray-100 flex items-center justify-center">
        {/* Reemplaza con tu imagen real */}
        <div className="relative w-full h-full">
          <Image
            src="/register-background.jpg" // Reemplaza con tu ruta de imagen
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="text-center p-8 text-white">
              <h2 className="text-4xl font-bold mb-4">
                Únete a nuestra comunidad
              </h2>
              <p className="text-xl max-w-2xl">
                Descubre los mejores eventos y experiencias que tenemos
                preparados para ti
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
