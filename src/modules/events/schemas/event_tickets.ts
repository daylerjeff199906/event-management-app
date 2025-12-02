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