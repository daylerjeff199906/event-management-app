import { z } from 'zod'

// Schema para elementos key-value
const keyValueSchema = z.object({
  key: z.string().min(1, 'La clave es requerida'),
  value: z.string().min(1, 'El valor es requerido')
})

// Schema principal para los detalles del evento
export const eventDetailsSchema = z.object({
  social_links: z.array(keyValueSchema).optional(),
  media: z.array(keyValueSchema).optional(),
  sponsors: z.array(keyValueSchema).optional(),
  faqs: z.array(keyValueSchema).optional(),
  content: z.array(keyValueSchema).optional(),
  event_id: z.string().uuid('ID de evento inválido')
})

export type EventDetailsFormData = z.infer<typeof eventDetailsSchema>
export type KeyValuePair = z.infer<typeof keyValueSchema>
