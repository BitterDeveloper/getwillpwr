import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(254),
  subject: z.string().min(1).max(150),
  message: z.string().min(10).max(5000),
  _hp: z.string().max(0),
})

export type ContactInput = z.infer<typeof contactSchema>
