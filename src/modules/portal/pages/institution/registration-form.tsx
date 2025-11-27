'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Building2, Mail, Phone, User, FileText, CheckCircle2 } from 'lucide-react'
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
import { Checkbox } from '@/components/ui/checkbox'
import {
  InstitutionForm,
  institutionTypes,
  RegistrationInstitutionForm,
  requestInstitutionSchema
} from '../../lib/register.institution'
import { toast } from 'react-toastify'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'
import {
  createInstitutionWithRequest,
  searchInstitutionFunction
} from '@/services/institution.services'

type FormStep = 'institution' | 'contact'

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
  const [currentStep, setCurrentStep] = useState<FormStep>('institution')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingName, setIsCheckingName] = useState(false)
  const [nameCheckError, setNameCheckError] = useState<string | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)

  const form = useForm<RegistrationInstitutionForm>({
    resolver: zodResolver(requestInstitutionSchema),
    defaultValues: {
      institution_name: initialName || '',
      institution_type: '',
      institution_email: '',
      contact_email: '',
      contact_phone: '',
      contact_person: '',
      description: '',
      request_status: 'pending'
    }
  })

  const validateInstitutionName = async (name: string) => {
    const trimmedName = name?.trim()
    if (!trimmedName) {
      form.setError('institution_name', {
        type: 'manual',
        message: 'Ingresa el nombre de la institucion'
      })
      return false
    }

    setIsCheckingName(true)
    try {
      const { data, error } = await searchInstitutionFunction({
        query: trimmedName
      })

      if (error) {
        setNameCheckError('No pudimos validar el nombre. Intenta de nuevo.')
        form.setError('institution_name', {
          type: 'manual',
          message: 'Error al validar la institucion'
        })
        return false
      }

      const exists = Boolean(data && data.length > 0)
      if (exists) {
        setNameCheckError('Esta institucion ya esta registrada.')
        form.setError('institution_name', {
          type: 'manual',
          message: 'Esta institucion ya esta registrada'
        })
        return false
      }

      setNameCheckError(null)
      form.clearErrors('institution_name')
      return true
    } catch (err) {
      console.error('Error al validar institucion:', err)
      setNameCheckError('No pudimos validar el nombre. Intenta de nuevo.')
      form.setError('institution_name', {
        type: 'manual',
        message: 'Error al validar la institucion'
      })
      return false
    } finally {
      setIsCheckingName(false)
    }
  }

  const handleNext = async () => {
    const nameValid = await validateInstitutionName(
      form.getValues('institution_name')
    )
    const fieldsValid = await form.trigger([
      'institution_name',
      'institution_type',
      'institution_email',
      'description'
    ])

    if (!nameValid || !fieldsValid) {
      toast.error(
        <ToastCustom
          title="Revisa los datos de la institucion"
          description="Corrige los campos requeridos antes de continuar."
        />
      )
      return
    }

    setCurrentStep('contact')
  }

  const onSubmit = async (formData: RegistrationInstitutionForm) => {
    if (currentStep !== 'contact') {
      await handleNext()
      return
    }

    if (!termsAccepted || !privacyAccepted) {
      toast.error(
        <ToastCustom
          title="Aceptacion requerida"
          description="Debes aceptar los terminos, condiciones y politica de privacidad para continuar."
        />
      )
      return
    }

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
          Institucion "${result.institution?.institution_name}"
          y solicitud de registro creadas correctamente.
          Estado: ${result.request?.status || 'pending'}
        `}
        />
      )

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
          description="Ocurrio un error inesperado durante el proceso de registro"
        />
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepIndicator = (
    <div className="flex items-center gap-4 mb-6 text-sm">
      {[
        { id: 'institution', label: 'Institucion' },
        { id: 'contact', label: 'Informacion de contacto' }
      ].map((step) => {
        const isActive = currentStep === step.id
        const isDone =
          currentStep === 'contact' && step.id === 'institution'
        return (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                isDone
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : isActive
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'bg-muted text-muted-foreground border-border'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <span className="text-xs font-semibold">
                  {step.id === 'institution' ? '1' : '2'}
                </span>
              )}
            </div>
            <span
              className={`font-medium ${
                isActive ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="text-xl">Registro de nueva institucion</CardTitle>
            <CardDescription>
              Completa los datos de tu institucion para solicitar el registro
            </CardDescription>
          </div>
        </div>
        {stepIndicator}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 'institution' && (
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="institution_name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Nombre de la institucion
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej. Universidad Nacional"
                          {...field}
                          onBlur={async () => {
                            await validateInstitutionName(field.value)
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Ingresa el nombre completo de la institucion.
                      </FormDescription>
                      {isCheckingName && (
                        <p className="text-xs text-muted-foreground">
                          Validando nombre de institucion...
                        </p>
                      )}
                      {nameCheckError &&
                        !form.formState.errors.institution_name && (
                          <p className="text-xs text-destructive">
                            {nameCheckError}
                          </p>
                        )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="institution_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de institucion</FormLabel>
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
                        Correo institucional
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
                          Descripcion (opcional)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Breve descripcion de la institucion y sus actividades"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {currentStep === 'contact' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-lg font-semibold">Informacion de contacto</h3>
                  <p className="text-sm text-muted-foreground">
                    El contacto ingresado sera registrado con el rol de Owner y recibira todas las indicaciones.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="contact_person"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Persona de contacto
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
                        Telefono (opcional)
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
                          Correo electronico
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

                <div className="col-span-1 md:col-span-2 space-y-4 pt-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) =>
                        setTermsAccepted(checked as boolean)
                      }
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Acepto los{' '}
                      <a
                        href="/terminos-y-condiciones"
                        target="_blank"
                        className="text-primary hover:underline"
                      >
                        Terminos y Condiciones
                      </a>{' '}
                      del servicio
                    </label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="privacy"
                      checked={privacyAccepted}
                      onCheckedChange={(checked) =>
                        setPrivacyAccepted(checked as boolean)
                      }
                    />
                    <label
                      htmlFor="privacy"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      He leido y acepto la{' '}
                      <a
                        href="/politica-de-privacidad"
                        target="_blank"
                        className="text-primary hover:underline"
                      >
                        Politica de Privacidad
                      </a>{' '}
                      y el tratamiento de mis datos
                    </label>
                  </div>
                  {!termsAccepted || !privacyAccepted ? (
                    <p className="text-xs text-destructive">
                      Debes aceptar los términos y la política de privacidad para continuar.
                    </p>
                  ) : null}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              {currentStep === 'contact' ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep('institution')}
                    className="flex-1 bg-transparent"
                    disabled={isSubmitting}
                  >
                    Volver
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !termsAccepted || !privacyAccepted}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Enviando solicitud...' : 'Enviar solicitud'}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="flex-1 bg-transparent"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isCheckingName}
                    className="flex-1"
                  >
                    {isCheckingName ? 'Validando...' : 'Continuar'}
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
