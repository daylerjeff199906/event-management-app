'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
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
import {
  InstitutionForm,
  institutionSchema,
  institutionTypes
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

  const isDirty = form.formState.isDirty

  return (
    <div className="max-w-7xl mx-auto ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Información General Section */}
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Información General
          </h2>
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="institution_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Nombre de la institución
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Universidad Nacional"
                          className="border-gray-300 focus:border-gray-400 focus:ring-0"
                          {...field}
                        />
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
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Acrónimo
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="UN"
                          className="border-gray-300 focus:border-gray-400 focus:ring-0"
                          {...field}
                        />
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
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Tipo de institución
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-gray-400 focus:ring-0 w-full">
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
                      <FormDescription className="text-xs text-gray-500">
                        Tipo de institución (universidad, empresa, etc.)
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="document_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Número de documento
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123456789"
                          className="border-gray-300 focus:border-gray-400 focus:ring-0"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        RUC, NIT o número de identificación fiscal
                      </FormDescription>
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
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Descripción
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Breve descripción de la institución"
                        className="min-h-[100px] border-gray-300 focus:border-gray-400 focus:ring-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription className="text-xs text-gray-500">
                      Breve descripción de la institución, a qué se dedica, etc.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Información de Contacto Section */}
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Información de Contacto
          </h2>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="institution_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Email institucional
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contacto@universidad.edu"
                          className="border-gray-300 focus:border-gray-400 focus:ring-0"
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
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Teléfono de contacto
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1 234 567 8900"
                          className="border-gray-300 focus:border-gray-400 focus:ring-0"
                          {...field}
                        />
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
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Dirección
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Calle Principal 123, Ciudad, País"
                        className="border-gray-300 focus:border-gray-400 focus:ring-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Información Adicional Section */}
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Información Adicional
          </h2>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="map_iframe_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      URL del mapa (iframe)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.google.com/maps/embed?pb=..."
                        className="border-gray-300 focus:border-gray-400 focus:ring-0"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      URL del iframe de Google Maps para mostrar la ubicación
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !isDirty}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
