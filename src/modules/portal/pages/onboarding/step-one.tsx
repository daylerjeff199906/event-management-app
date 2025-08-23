'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { personalInfoSchema, type PersonalInfo } from '../../lib/validations'
import { InputPhone } from '@/components/app/miscellaneous/input-phone'

interface StepOneProps {
  data: PersonalInfo
  onNext: (data: PersonalInfo) => void
  onSkip: () => void
}

export function StepOne({ data, onNext }: StepOneProps) {
  const form = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: data
  })

  const onSubmit = (data: PersonalInfo) => {
    onNext({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone
    } as PersonalInfo)
  }

  return (
    <div className="flex items-center justify-center p-4 ">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Hola! Bienvenido
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Estás comenzando una nueva experiencia. Queremos conocer más sobre
            ti, ayúdanos completando esta información básica.
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Nombre
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Escribe tu nombre"
                          {...field}
                          className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors"
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Apellido
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Escribe tu apellido"
                          {...field}
                          className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors"
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Teléfono
                      </FormLabel>
                      <FormControl>
                        <InputPhone {...field} />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                  >
                    Continuar →
                  </Button>
                </div>
              </form>
            </Form>

            <div className="text-center mt-6">
              <p className="text-xs text-gray-500">
                Tu información está segura con nosotros 🔒
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
