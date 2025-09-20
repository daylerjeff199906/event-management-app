'use client'
// import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// import { ImageIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
// import { ImageUploadModal } from './image-upload-modal'
import {
  institutionSchema,
  institutionTypes,
  type InstitutionForm
} from '@/modules/portal/lib/register.institution'

interface InstitutionFormProps {
  initialData?: Partial<InstitutionForm>
  onSubmit: (data: InstitutionForm) => void
  isLoading?: boolean
}

export function InstitutionFormData({
  initialData,
  onSubmit,
  isLoading = false
}: InstitutionFormProps) {
  //   const [imageModalOpen, setImageModalOpen] = useState(false)

  const form = useForm<InstitutionForm>({
    resolver: zodResolver(institutionSchema),
    defaultValues: {
      institution_name: '',
      institution_type: '',
      description: '',
      institution_email: '',
      contact_phone: '',
      address: '',
      document_number: '',
      brand: '',
      acronym: '',
      cover_image_url: '',
      map_iframe_url: '',
      status: 'ACTIVE',
      ...initialData
    }
  })

  //   const handleImageSelect = (imageUrl: string) => {
  //     form.setValue('cover_image_url', imageUrl)
  //   }

  //   const coverImageUrl = form.watch('cover_image_url')

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información general</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="institution_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la institución</FormLabel>
                      <FormControl>
                        <Input placeholder="Universidad Nacional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="acronym"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Acrónimo</FormLabel>
                      <FormControl>
                        <Input placeholder="UN" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="institution_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de institución</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo" />
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="inactive">Inactivo</SelectItem>
                          <SelectItem value="pending">Pendiente</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descripción de la institución..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Información de contacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="institution_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email institucional</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contacto@universidad.edu"
                          {...field}
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
                      <FormLabel>Teléfono de contacto</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 8900" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Calle Principal 123, Ciudad, País"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Información adicional */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="document_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de documento</FormLabel>
                      <FormControl>
                        <Input placeholder="123456789" {...field} />
                      </FormControl>
                      <FormDescription>
                        RUC, NIT o número de identificación fiscal
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre comercial" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Imagen de portada */}
              {/* <FormField
                control={form.control}
                name="cover_image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagen de portada</FormLabel>
                    <div className="space-y-2">
                      {coverImageUrl ? (
                        <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border">
                          <img
                            src={coverImageUrl || '/placeholder.svg'}
                            alt="Imagen de portada"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-32 w-full max-w-md items-center justify-center rounded-lg border border-dashed">
                          <div className="text-center">
                            <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              Sin imagen
                            </p>
                          </div>
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setImageModalOpen(true)}
                      >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        {coverImageUrl ? 'Cambiar imagen' : 'Subir imagen'}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* URL del mapa */}
              <FormField
                control={form.control}
                name="map_iframe_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL del mapa (iframe)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.google.com/maps/embed?pb=..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL del iframe de Google Maps para mostrar la ubicación
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Botones de acción */}
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* <ImageUploadModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onImageSelect={handleImageSelect}
        currentImage={coverImageUrl}
      /> */}
    </div>
  )
}
