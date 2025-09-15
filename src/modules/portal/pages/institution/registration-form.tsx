'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Building2, Mail, Phone, User, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  InstitutionForm,
  institutionTypes,
  RegistrationInstitutionForm,
  requestInstitutionSchema
} from '../../lib/register.institution'
import { toast } from 'react-toastify'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'
import { createInstitutionWithRequest } from '@/services/institution.services'

interface RegistrationFormProps {
  initialName?: string
  onBack: () => void
  onSuccess: () => void
  onInstitutionCreated: (data: InstitutionForm) => void
}

export function RegistrationForm({
  initialName,
  onBack,
  onSuccess,
  onInstitutionCreated
}: RegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(requestInstitutionSchema),
    defaultValues: {
      institution_name: initialName || '',
      institution_type: '',
      contact_email: '',
      contact_phone: '',
      request_status: 'pending'
    }
  })

  const onSubmit = async (formData: RegistrationInstitutionForm) => {
    setIsSubmitting(true)

    try {
      const result = await createInstitutionWithRequest(formData)

      if (!result.success) {
        toast.error(
          <ToastCustom
            title="Error en el registro"
            description={
              result.error || 'Error desconocido al procesar la solicitud'
            }
          />
        )
        return
      }

      toast.success(
        <ToastCustom
          title="Registro completado exitosamente"
          description={`
          Institución "${result.institution?.institution_name}" 
          y solicitud de registro creadas correctamente.
          Estado: ${result.request?.status || 'pending'}
        `}
        />
      )

      // Llama a tus callbacks de éxito
      if (result.institution) {
        onInstitutionCreated({
          id: result.institution.id,
          institution_name: result.institution.institution_name,
          institution_email: result.institution.institution_email,
          institution_type: result.institution.institution_type
        })
      }
      onSuccess()
    } catch (error) {
      console.error('Error inesperado:', error)
      toast.error(
        <ToastCustom
          title="Error inesperado"
          description="Ocurrió un error inesperado durante el proceso de registro"
        />
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="text-xl">
              Registro de Nueva Institución
            </CardTitle>
            <CardDescription>
              Completa los datos de tu institución para solicitar el registro
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="institution_name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Nombre de la Institución
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej. Universidad Nacional"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Por favor, ingresa el nombre completo de la institución.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="institution_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Institución</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {institutionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="institution_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Correo Institucional
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="contacto@institucion.edu"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-1 md:col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Descripción (Opcional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Breve descripción de la institución y sus actividades"
                          className="min-h-[100px] "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1 md:col-span-2 pt-4">
                <h3 className="text-lg font-semibold">
                  Información de Contacto
                </h3>
                <p className="text-sm text-muted-foreground">
                  Proporciona la información de contacto de la institución para
                  facilitar la comunicación.
                </p>
              </div>

              <FormField
                control={form.control}
                name="contact_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Persona de Contacto
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nombre completo"
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Teléfono (Opcional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+1 234 567 8900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-1 md:col-span-2">
                <FormField
                  control={form.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Correo Electrónico
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contacto@institucion.edu"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1 bg-transparent"
              >
                Volver
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Enviando Solicitud...' : 'Enviar Solicitud'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
