import { z } from 'zod'

export interface ForgotPasswordForm {
  email: string
  code: string
  newPassword: string
  confirmPassword: string
}

export interface ResponsePasswordRecovery {
  data: {
    code_token: string
  }
  message: string
}

export interface EmailSignupForm {
  email: string
  code: string
}

export const loginSchema = z.object({
  username: z.string().min(5, 'El usuario es requerido.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.')
})

export type LoginFormValues = z.infer<typeof loginSchema>

export interface LoginProps {
  subTitle?: string
}
