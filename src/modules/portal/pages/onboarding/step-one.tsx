'use client'

import type React from 'react'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Camera,  } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { personalInfoSchema, type PersonalInfo } from '../../lib/validations'

interface StepOneProps {
  data: PersonalInfo
  onNext: (data: PersonalInfo) => void
  onSkip: () => void
}

export function StepOne({ data, onNext, onSkip }: StepOneProps) {
  const [imagePreview, setImagePreview] = useState<string>(
    data.profileImage || ''
  )

  const form = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: data
  })

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        form.setValue('profileImage', result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = (data: PersonalInfo) => {
    onNext({ ...data, profileImage: imagePreview })
  }

  const watchedValues = form.watch()

  return (
    <div className="animate-fade-in-up">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            ¡Bienvenido a Eventify!
          </CardTitle>
          <CardDescription className="text-lg">
            Cuéntanos un poco sobre ti para personalizar tu experiencia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={imagePreview || '/placeholder.svg'}
                  alt="Vista previa del perfil"
                />
                <AvatarFallback className="text-lg">
                  {watchedValues.firstName?.[0]?.toUpperCase() || 'U'}
                  {watchedValues.lastName?.[0]?.toUpperCase() || ''}
                </AvatarFallback>
              </Avatar>
              <Label
                htmlFor="profile-image"
                className="absolute -bottom-2 -right-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full p-2 cursor-pointer transition-colors"
              >
                <Camera className="w-4 h-4" />
              </Label>
              <Input
                id="profile-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Haz clic en la cámara para subir tu foto
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  placeholder="Tu nombre"
                  {...form.register('firstName')}
                  className={
                    form.formState.errors.firstName ? 'border-destructive' : ''
                  }
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  placeholder="Tu apellido"
                  {...form.register('lastName')}
                  className={
                    form.formState.errors.lastName ? 'border-destructive' : ''
                  }
                />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onSkip}
                className="flex-1 bg-transparent"
              >
                Omitir por ahora
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-accent hover:bg-accent/90"
              >
                Continuar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
