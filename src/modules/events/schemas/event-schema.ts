import { EventStatus } from '@/types'
import { z } from 'zod'

export const eventSchema = z
  .object({
    event_name: z
      .string()
      .min(1, 'El nombre del evento es requerido')
      .max(255, 'El nombre es muy largo'),
    description: z.string().optional(),
    start_date: z.date('La fecha de inicio es requerida'),
    end_date: z.date().optional(),
    time: z.string().optional(),
    duration: z.string().optional(),
    location: z.string().optional(),
    location_type: z.enum(['venue', 'online', 'tba']).optional(),
    cover_image_url: z.string().optional(),
    status: z
      .enum([EventStatus.DRAFT, EventStatus.PUBLIC, EventStatus.DELETE])
      .optional(),
    category: z.number().optional(),
    institution_id: z.string().optional(),
    link_meeting: z.string().optional(),
    user_id: z.string().optional(),
    author_id: z.string().optional(),
    lat: z.number().nullable().optional(),
    lon: z.number().nullable().optional(),
    adress_uuid: z.string().optional()
  })
  .refine(
    (data) => {
      if (data.end_date && data.start_date) {
        return data.end_date >= data.start_date
      }
      return true
    },
    {
      message: 'La fecha de fin debe ser posterior a la fecha de inicio',
      path: ['end_date']
    }
  )

export type EventFormData = z.infer<typeof eventSchema>
