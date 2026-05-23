import { z } from 'zod';

export const CreateAppealSchema = z.object({
  lessonId: z.string().uuid(),
  text:   z.string().min(10).max(2000),
  expiresAt: z.string().datetime().optional(),
});

export const ResolveAppealSchema = z.object({});
export const RejectAppealSchema  = z.object({});
export type RejectAppealDto  = z.infer<typeof RejectAppealSchema>;
export type CreateAppealDto  = z.infer<typeof CreateAppealSchema>;
export type ResolveAppealDto = z.infer<typeof ResolveAppealSchema>;