import { EventStatus } from '@/types'
import { z } from 'zod'

export const eventSchema = z
  .object({
    id: z.string().optional(),
    event_name: z
      .string()
      .min(1, 'El nombre del evento es requerido')
      .max(255, 'El nombre es muy largo'),
    description: z.string().optional(),
    start_date: z.date('La fecha de inicio es requerida'),
    end_date: z.date().optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
    time: z.date().optional(),
    duration: z.number().optional(),
    cover_image_url: z.string().optional(),
    status: z
      .enum([EventStatus.DRAFT, EventStatus.PUBLIC, EventStatus.DELETE])
      .optional(),
    category: z.number().optional(),
    institution_id: z.string().optional(),
    user_id: z.string().optional(),
    author_id: z.string().optional(),
    address_uuid: z.string().optional(),
    is_recurring: z.boolean().optional(),
    recurrence_pattern: z.string().optional(),
    recurrence_interval: z.number().optional(),
    recurrence_end_date: z.date().optional()
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
