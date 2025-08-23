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
import { Twitter, Facebook } from 'lucide-react'

interface ProfileEditorProps {
  initialData?: Partial<PersonalInfo>
  onSave?: (data: PersonalInfo) => void
}

export function ProfileEditor({ initialData, onSave }: ProfileEditorProps) {
  const [profileProgress] = useState(75) // Ejemplo de progreso

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<PersonalInfo>({
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

  const firstName = watch('firstName')
  const lastName = watch('lastName')
  const profileImage = watch('profileImage')

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
          <Card>
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
                    setValue('profileImage', url)
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Social Login */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Iniciar sesión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-blue-400 text-white border-blue-400"
              >
                <Twitter className="w-4 h-4" />
                Conecta con Twitter
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-blue-600 text-white border-blue-600"
              >
                <Facebook className="w-4 h-4" />
                Conecta con Facebook
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                También puedes ingresar a Platzi con email y contraseña
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-slate-700">
                Tus Datos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-slate-600"
                    >
                      Nombres
                    </Label>
                    <Input
                      id="firstName"
                      {...register('firstName')}
                      className="mt-1 bg-gray-100 border-0"
                      placeholder="JOSE JEFFERSON"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-slate-600"
                    >
                      Apellidos
                    </Label>
                    <Input
                      id="lastName"
                      {...register('lastName')}
                      className="mt-1 bg-gray-100 border-0"
                      placeholder="SANTOS PANAIFO"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Username & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">
                      Usuario
                    </Label>
                    <Input
                      className="mt-1 bg-gray-100 border-0"
                      placeholder="jose.santos33090"
                      disabled
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">
                      Email
                    </Label>
                    <Input
                      className="mt-1 bg-gray-100 border-0"
                      placeholder="jose.santos@unapiquitos.edu.pe"
                      disabled
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <Label className="text-sm font-medium text-slate-600">
                    Teléfono Móvil
                  </Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Código de país
                      </Label>
                      <div className="flex items-center bg-gray-100 rounded-md px-3 py-2">
                        <span className="text-lg mr-2">🇺🇸</span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs text-muted-foreground">
                        Número
                      </Label>
                      <Input
                        {...register('phone')}
                        className="bg-gray-100 border-0"
                        placeholder="Número de teléfono"
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Website */}
                <div>
                  <Label className="text-sm font-medium text-slate-600">
                    Sitio web personal
                  </Label>
                  <Input
                    className="mt-1 bg-gray-100 border-0"
                    placeholder="https://tu-sitio-web.com"
                  />
                </div>

                {/* Gender & Birthday */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600 mb-3 block">
                      Género
                    </Label>
                    <RadioGroup
                      value={watch('gender')}
                      onValueChange={(value) =>
                        setValue('gender', value as 'male' | 'female' | 'other')
                      }
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
                  </div>
                  <div>
                    <Label
                      htmlFor="birthDate"
                      className="text-sm font-medium text-slate-600"
                    >
                      Cumpleaños
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      {...register('birthDate')}
                      className="mt-1 bg-gray-100 border-0"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8"
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
