import { z } from 'zod'

export const eventTicketSchema = z.object({
    id: z.string().optional(),
    event_id: z.string(),
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    price: z.preprocess(
        (val) => (typeof val === 'string' ? parseFloat(val) : val),
        z.number().nonnegative()
    ),
    currency: z.string().optional().default('USD'),
    quantity_total: z.number().int().nonnegative(),
    quantity_sold: z.number().int().nonnegative().optional().default(0),
    max_per_user: z.number().int().nullable().optional().default(5),
    sales_start_at: z.string().optional().default(() => new Date().toISOString()),
    sales_end_at: z.string().nullable().optional(),
    is_active: z.boolean().nullable().optional().default(true),
     created_at: z.date().optional(),
    updated_at: z.date().optional(),
})

export type EventTicketform = z.infer<typeof eventTicketSchema>

export const mapConfigSchema = z.object({
  shape: z.enum(['rectangle', 'square', 'vertical', 'stadium']).optional(),
  borderRadius: z.string().optional(),
  fillColor: z.string().optional(),
  gridEnabled: z.boolean().optional()
})

export type MapConfig = z.infer<typeof mapConfigSchema>

// Events Maps ticket schema
export const eventMapSchema = z.object({
    id: z.string().optional(),
    event_id: z.string(),
    name: z.string().min(1),
    background_image_url: z.string().nullable().optional(),
    width: z.number().int().nonnegative().optional(),
    height: z.number().int().nonnegative().optional(),
    config: mapConfigSchema.optional(),
    created_at: z.string().optional(),
})

export type EventMap = z.infer<typeof eventMapSchema>


//Events Maps zone schema
export const eventMapZoneSchema = z.object({
    id: z.string().optional(),
    map_id: z.string(),
    ticket_id: z.string().nullable().optional(),
    element_type: z.enum(['STAGE', 'SEATING_AREA', 'OBJECT']).optional().default('SEATING_AREA'),
    label: z.string().nullable().optional(),
    geometry_data: z
        .object({
            x: z.number(),
            y: z.number(),
            width: z.number().nonnegative(),
            height: z.number().nonnegative(),
            rotation: z.number().optional().default(0),
            shape: z.string(), // e.g. "rect", "circle", "polygon"
            color: z.string().optional(),
        }),
    created_at: z.string().optional().default(() => new Date().toISOString()),
})

export type EventMapZone = z.infer<typeof eventMapZoneSchema>