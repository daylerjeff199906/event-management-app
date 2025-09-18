'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  PlusIcon,
  TrashIcon,
  LinkIcon,
  ImageIcon,
  UsersIcon,
  HelpCircleIcon,
  Loader
} from 'lucide-react'

import { Button } from '@/components/ui/button'
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
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  eventDetailsSchema,
  type EventDetailsFormData
} from '../schemas/events-details-schema'
import { upsertInstitutionDetails } from '@/services/events.info.services'
import { toast } from 'react-toastify'
import { ToastCustom } from '@/components/app/miscellaneous/toast-custom'

// Configuración de secciones
const sections = [
  {
    name: 'social_links' as const,
    title: 'Enlaces Sociales',
    description:
      'Agrega enlaces a redes sociales y sitios web relacionados con el evento',
    icon: LinkIcon,
    keyPlaceholder: 'Plataforma (ej: Facebook, Twitter)',
    valuePlaceholder: 'URL del enlace'
  },
  {
    name: 'media' as const,
    title: 'Medios',
    description: 'Incluye imágenes, videos y otros recursos multimedia',
    icon: ImageIcon,
    keyPlaceholder: 'Tipo de medio (ej: Imagen, Video)',
    valuePlaceholder: 'URL del recurso'
  },
  {
    name: 'sponsors' as const,
    title: 'Patrocinadores',
    description: 'Lista los patrocinadores y colaboradores del evento',
    icon: UsersIcon,
    keyPlaceholder: 'Nombre del patrocinador',
    valuePlaceholder: 'Sitio web o descripción'
  },
  {
    name: 'faqs' as const,
    title: 'Preguntas Frecuentes',
    description: 'Responde las preguntas más comunes sobre el evento',
    icon: HelpCircleIcon,
    keyPlaceholder: 'Pregunta',
    valuePlaceholder: 'Respuesta'
  }
]

interface EventDetailsEditFormProps {
  eventId: string
  initialData?: Partial<EventDetailsFormData>
}

export const EventDetailsEditForm = ({
  eventId,
  initialData
}: EventDetailsEditFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<EventDetailsFormData>({
    resolver: zodResolver(eventDetailsSchema),
    defaultValues: {
      event_id: eventId,
      social_links: initialData?.social_links || [],
      media: initialData?.media || [],
      sponsors: initialData?.sponsors || [],
      faqs: initialData?.faqs || []
    }
  })

  const handleSubmit = async (data: EventDetailsFormData) => {
    setIsSubmitting(true)
    try {
      const response = await upsertInstitutionDetails({
        eventId: eventId,
        details: data
      })

      if (response.error) {
        toast.error(
          <ToastCustom
            title="Error"
            variant="destructive"
            description={response.error}
          />
        )
      } else {
        toast.success(
          <ToastCustom
            title="Éxito"
            description="Detalles del evento guardados correctamente"
          />
        )
        form.reset(data) // Resetea el formulario con los datos actuales
      }
    } catch (error) {
      console.error('Error al guardar:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Componente para manejar arrays de key-value
  type SectionName = keyof Pick<
    EventDetailsFormData,
    'social_links' | 'media' | 'sponsors' | 'faqs'
  >

  interface KeyValueSectionProps {
    sectionName: SectionName
    title: string
    description: string
    icon: React.ElementType
    keyPlaceholder: string
    valuePlaceholder: string
  }

  //   type KeyValueItem = { key: string; value: string }

  const KeyValueSection = ({
    sectionName,
    title,
    description,
    icon: Icon,
    keyPlaceholder,
    valuePlaceholder
  }: KeyValueSectionProps) => {
    const { fields, append, remove } = useFieldArray<
      EventDetailsFormData,
      SectionName
    >({
      control: form.control,
      name: sectionName
    })

    const addItem = () => {
      append({ key: '', value: '' })
    }

    return (
      <Card className="shadow-none border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={`${field.id}-${index}`}
              className="flex gap-2 items-start"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name={`${sectionName}.${index}.key` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder={keyPlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`${sectionName}.${index}.value` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder={valuePlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => remove(index)}
                className="shrink-0"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            className="w-full bg-transparent"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Agregar {title.toLowerCase()}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Detalles Adicionales del Evento</h1>
        <p className="text-gray-600">
          Agrega información adicional para enriquecer tu evento. Todos los
          campos son opcionales.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {sections.map((section) => (
            <KeyValueSection
              key={section.name}
              sectionName={section.name}
              title={section.title}
              description={section.description}
              icon={section.icon}
              keyPlaceholder={section.keyPlaceholder}
              valuePlaceholder={section.valuePlaceholder}
            />
          ))}

          {/* Botones de acción */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => form.reset()}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar detalles'}
              {isSubmitting && <Loader className="ml-2 h-4 w-4 animate-spin" />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
