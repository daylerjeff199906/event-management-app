'use client'

import { useState } from 'react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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

interface ProfileEditorProps {
  initialData?: Partial<PersonalInfo>
  email?: string
  onSave?: (data: PersonalInfo) => void
}

export function ProfileEditor({
  initialData,
  email,
  onSave
}: ProfileEditorProps) {
  const [profileProgress] = useState(75) // Ejemplo de progreso

  const form = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      profileImage: initialData?.profileImage || '',
      country: initialData?.country || '',
      birthDate: initialData?.birthDate || '',
      phone: initialData?.phone || '',
      gender: initialData?.gender || undefined
    }
  })

  const firstName = form.watch('firstName')
  const lastName = form.watch('lastName')
  const profileImage = form.watch('profileImage')

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    return 'U'
  }

  const onSubmit = (data: PersonalInfo) => {
    onSave?.(data)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Editar perfil</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Completa tu perfil y obtén</span>
          <span className="font-semibold text-green-600">300₽</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full">
        <Progress value={profileProgress} className="h-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Image & Social */}
        <div className="space-y-6">
          {/* Profile Image */}
          <Card className="shadow-none bg-white">
            <CardContent className="p-6 text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarImage
                  src={profileImage || '/placeholder.svg'}
                  alt="Perfil"
                />
                <AvatarFallback className="text-2xl bg-pink-500 text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-muted-foreground mb-2">
                Arrastra aquí tu imagen de perfil
              </p>
              <Button variant="link" className="text-blue-500 p-0">
                o sube una foto
              </Button>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const url = URL.createObjectURL(file)
                    form.setValue('profileImage', url)
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Form */}
        <div className="lg:col-span-2">
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
                      name="firstName"
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
                      name="lastName"
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
                      name="userName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-600">
                            Usuario
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="mt-1 bg-gray-100 border-0"
                              placeholder="jose.santos33090"
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
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-600">
                            Cumpleaños
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
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
                      disabled={form.formState.isSubmitting}
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
        </div>
      </div>
    </div>
  )
}
