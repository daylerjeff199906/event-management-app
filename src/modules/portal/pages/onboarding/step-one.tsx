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
import { ArrowRight, Lock } from 'lucide-react'

interface StepOneProps {
  data: PersonalInfo
  onNext: (data: PersonalInfo) => void
}

export function StepOne({ data, onNext }: StepOneProps) {
  const form = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: data
  })

  const onSubmit = (data: PersonalInfo) => {
    onNext({
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone
    } as PersonalInfo)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
          ¡Bienvenido! Empecemos por lo primero.
        </h1>
        <p className="text-slate-500 font-medium">
          Cuéntanos un poco sobre ti para personalizar tu experiencia.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Nombre
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Steve"
                    {...field}
                    className="h-12 border-slate-200 focus:border-primary focus:ring-primary rounded-xl transition-all"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Apellido
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Jobs"
                    {...field}
                    className="h-12 border-slate-200 focus:border-primary focus:ring-primary rounded-xl transition-all"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Teléfono
                </FormLabel>
                <FormControl>
                  <InputPhone {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <div className="pt-6">
            <Button type="submit" className="w-full h-12 rounded-xl text-md font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
              Crear Perfil
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
