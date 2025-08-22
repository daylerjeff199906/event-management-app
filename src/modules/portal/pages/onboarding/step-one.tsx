'use client'
// import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// import { Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormDescription,
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
  // const [imagePreview, setImagePreview] = useState<string>(
  //   data.profileImage || ''
  // )
  const form = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: data
  })

  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]
  //   if (file) {
  //     const reader = new FileReader()
  //     reader.onloadend = () => {
  //       const result = reader.result as string
  //       setImagePreview(result)
  //       form.setValue('profileImage', result)
  //     }
  //     reader.readAsDataURL(file)
  //   }
  // }

  const onSubmit = (data: PersonalInfo) => {
    onNext({ ...data })
  }

  // const watchedValues = form.watch()

  return (
    <div className="animate-fade-in-up">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">¡Bienvenido!</CardTitle>
          <CardDescription className="text-lg max-w-md mx-auto">
            Registra tu información personal. Completa los campos obligatorios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* <div className="flex flex-col items-center space-y-4">
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
                className="absolute -bottom-2 -right-2 text-accent-foreground rounded-full p-2 cursor-pointer transition-colors"
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
          </div> */}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 md:gap-6"
            >
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tu nombre"
                        {...field}
                        className={
                          form.formState.errors.firstName
                            ? 'border-destructive'
                            : ''
                        }
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.firstName?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tu apellido"
                        {...field}
                        className={
                          form.formState.errors.lastName
                            ? 'border-destructive'
                            : ''
                        }
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.lastName?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono *</FormLabel>
                    <FormControl>
                      <InputPhone {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.phone?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de nacimiento *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={
                          field.value
                            ? typeof field.value === 'string'
                              ? field.value
                              : field.value instanceof Date
                              ? field.value.toISOString().slice(0, 10)
                              : ''
                            : ''
                        }
                        className={
                          form.formState.errors.birthDate
                            ? 'border-destructive'
                            : ''
                        }
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.birthDate?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tu país"
                        {...field}
                        className={
                          form.formState.errors.country
                            ? 'border-destructive'
                            : ''
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Introduce tu país de residencia
                    </FormDescription>
                    <FormMessage>
                      {form.formState.errors.country?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" className="flex-1 animate-pulse">
                  Continuar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
