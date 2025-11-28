import { z } from 'zod'
import { EventMode } from './event-schema'
import { EventStatus } from '@/types'

export const eventActivitySchema = z
    .object({
        id: z.string().uuid().optional(),
        event_id: z.string().uuid(),
        parent_activity_id: z.string().uuid().optional().nullable(),
        activity_name: z
            .string()
            .min(1, 'El nombre de la actividad es requerido')
            .max(255, 'El nombre es muy largo'),
        description: z.string().optional().nullable(),
        start_time: z.date('La hora de inicio es requerida'),
        end_time: z.date('La hora de fin es requerida'),
        duration: z.number().optional().nullable(),
        meeting_url: z.string().optional().nullable(),
        custom_location: z.string().optional().nullable(),
        activity_mode: z
            .enum([EventMode.PRESENCIAL, EventMode.VIRTUAL, EventMode.HIBRIDO])
            .optional()
            .nullable(),
        status: z
            .enum([EventStatus.DRAFT, EventStatus.PUBLIC, EventStatus.DELETE])
            .optional(),
        order_index: z.number().int().optional(),
        created_at: z.date().optional(),
        updated_at: z.date().optional(),
    })
    .refine(
        (data) => {
            if (data.start_time && data.end_time) {
                return data.end_time >= data.start_time
            }
            return true
        },
        {
            message: 'La hora de fin debe ser posterior a la hora de inicio',
            path: ['end_time'],
        }
    )

export type EventActivityForm = z.infer<typeof eventActivitySchema>
