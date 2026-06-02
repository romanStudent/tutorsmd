import { z } from 'zod';

export const schema = z.object({
  oldPassword:     z.string().min(1, 'Required'),
  newPassword:     z.string().min(15, 'Min 15 characters'),
  confirmPassword: z.string().min(1, 'Required'),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type FormData = z.infer<typeof schema>;