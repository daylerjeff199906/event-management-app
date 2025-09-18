'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  personalInfoSchema,
  PersonalInfo
} from '@/modules/portal/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { InputPhone } from '@/components/app/miscellaneous/input-phone'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { updateUserData } from '@/services/user.services'
import { toast } from 'react-toastify'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'
import { AvatarUploadPage, InterestForm } from '../../components'

interface ProfileEditorProps {
  userId?: string
  initialData?: Partial<PersonalInfo>
  email?: string
  interestsData?: {
    interests: string[]
    eventTypes: string[]
  }
}

export function ProfileEditor({
  initialData,
  interestsData,
  email,
  userId
}: ProfileEditorProps) {
  const form = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      first_name: initialData?.first_name || '',
      last_name: initialData?.last_name || '',
      profile_image: initialData?.profile_image || '',
      country: initialData?.country || '',
      birth_date: initialData?.birth_date || null,
      phone: initialData?.phone || '',
      gender: initialData?.gender || undefined,
      username: initialData?.username || undefined
    }
  })

  const isDirty = form.formState.isDirty

  const onSubmit = async (data: PersonalInfo) => {
    try {
      const response = await updateUserData({
        id: String(userId),
        dataForm: data
      })
      if (response.data) {
        toast.success(
          <ToastCustom
            title="Perfil actualizado"
            description="Tu perfil se ha actualizado con éxito."
          />
        )
        form.reset(data) // Resetea el estado "sucio" del formulario
      } else {
        toast.error(
          <ToastCustom
            title="Error al actualizar el perfil"
            description="No se pudo actualizar el perfil."
          />
        )
      }
    } catch (error) {
      const errorMessage =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message || 'Error desconocido'
          : 'Error desconocido'
      toast.error(
        <ToastCustom
          title="Error al actualizar el perfil"
          description={errorMessage}
        />
      )
    }
  }

  const onAvatarChange = async (url: string) => {
    try {
      const response = await updateUserData({
        id: String(userId),
        dataForm: {
          ...form.getValues(),
          profile_image: url
        }
      })
      if (response.data) {
        toast.success(
          <ToastCustom
            title="Perfil actualizado"
            description="Tu perfil se ha actualizado con éxito."
          />
        )
        form.reset({
          ...form.getValues(),
          profile_image: url
        }) // Reset form state
      }
    } catch (error) {
      const errorMessage =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message || 'Error desconocido'
          : 'Error desconocido'
      toast.error(
        <ToastCustom
          title="Error al actualizar el avatar"
          description={errorMessage}
        />
      )
    }
  }

  function calculateProfileEmpty(data: Partial<PersonalInfo>): number {
    const fields: (keyof PersonalInfo)[] = [
      'first_name',
      'last_name',
      'profile_image',
      'country',
      'birth_date',
      'phone',
      'gender',
      'username'
    ]
    const filled = fields.filter((key) => {
      const value = data[key]
      return value !== undefined && value !== null && value !== ''
    }).length
    return Math.round(((fields.length - filled) / fields.length) * 100)
  }

  const profileEmpty = calculateProfileEmpty(form.getValues())

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Editar perfil</h1>
      </div>

      {/* Progress Bar */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column - Profile Image & Social */}

        <div className="space-y-6">
          {/* Profile Image */}
          <div
            className="border-2 border-dashed px-6 rounded-lg py-20 bg-white sticky top-24"
            style={{ borderWidth: '3px' }}
          >
            <AvatarUploadPage
              username={form.getValues().username}
              onAvatarChange={onAvatarChange}
              urlImage={form.getValues().profile_image}
            />
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="w-full col-span-1 md:col-span-2">
            <div>
              <p className="text-xs text-muted-foreground italic text-end pb-2">
                Completa tu perfil y manténlo actualizado para obtener una mejor
                experiencia.
              </p>
              <Progress value={100 - profileEmpty} className="h-2" />
            </div>
          </div>
          <Card className="shadow-none bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-slate-700">
                Tus Datos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Names */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-600">
                            Nombres
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="mt-1 bg-gray-100 border-0"
                              placeholder="Jhon"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-600">
                            Apellidos
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="mt-1 bg-gray-100 border-0"
                              placeholder="Doe"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Username & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-600">
                            Usuario
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value || ''}
                              className="mt-1 bg-gray-100 border-0"
                              placeholder="Ingrese su usuario"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <Label className="text-sm font-medium text-slate-600">
                        Email
                      </Label>
                      <Input
                        value={email}
                        className="mt-1 bg-gray-100 border-0"
                        placeholder="jose.santos@unapiquitos.edu.pe"
                        disabled
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-600">
                          Teléfono Móvil
                        </FormLabel>
                        <FormControl>
                          <InputPhone
                            value={field.value || ''}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Gender & Birthday */}
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-medium text-slate-600">
                            Género
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="male" id="male" />
                                <Label htmlFor="male" className="text-sm">
                                  Masculino
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="female" id="female" />
                                <Label htmlFor="female" className="text-sm">
                                  Femenino
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="other" id="other" />
                                <Label htmlFor="other" className="text-sm">
                                  Otro
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="birth_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-600">
                            Cumpleaños
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={field.value || ''}
                              className="mt-1 bg-gray-100 border-0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting || !isDirty}
                      className="w-full md:w-auto px-8"
                    >
                      {form.formState.isSubmitting
                        ? 'Guardando...'
                        : 'Guardar cambios'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <InterestForm
            data={{
              eventTypes: interestsData?.eventTypes || [],
              interests: interestsData?.interests || []
            }}
            idUser={String(userId)}
          />
        </div>
      </div>
    </div>
  )
}
