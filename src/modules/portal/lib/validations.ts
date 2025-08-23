import { z } from 'zod'

export const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  profileImage: z.string().optional(),
  country: z.string().optional(),
  birthDate: z.string().optional(),
  phone: z
    .string()
    .min(10, 'El número de teléfono debe tener al menos 10 caracteres')
    .optional(),
  gender: z.enum(['male', 'female', 'other']).optional()
})

export const interestsSchema = z.object({
  interests: z.array(z.string()).min(1, 'Selecciona al menos un interés'),
  eventTypes: z
    .array(z.string())
    .min(1, 'Selecciona al menos un tipo de evento')
})

export const notificationsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  eventReminders: z.boolean(),
  weeklyDigest: z.boolean(),
  profileVisibility: z.enum(['public', 'friends', 'private']),
  showLocation: z.boolean()
})

export const completeOnboardingSchema = personalInfoSchema
  .merge(interestsSchema)
  .merge(notificationsSchema)

export type PersonalInfo = z.infer<typeof personalInfoSchema>
export type Interests = z.infer<typeof interestsSchema>
export type Notifications = z.infer<typeof notificationsSchema>
export type CompleteOnboarding = z.infer<typeof completeOnboardingSchema>
