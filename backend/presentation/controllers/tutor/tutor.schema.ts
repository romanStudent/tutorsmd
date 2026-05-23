import { z } from 'zod';

export const UpdateTutorProfileSchema = z.object({
  fulldescribeDe: z.string().max(5000).nullable().optional(),
  fulldescribeRu: z.string().max(5000).nullable().optional(),

  highlightDe: z.string().max(500).nullable().optional(),
  highlightRu: z.string().max(500).nullable().optional(),

  nameDe: z.string().max(100).nullable().optional(),
  nameRu: z.string().max(100).nullable().optional(),

  surnameDe: z.string().max(100).nullable().optional(),
  surnameRu: z.string().max(100).nullable().optional(),

  hourlyRate: z.number().positive().max(10000).nullable().optional(),
});

export type TutorIdParams = {
  tutorId: string;
};

export const RejectTutorSchema = z.object({
  reason: z.string().min(1).max(500).optional(),
});

export type UpdateTutorProfileDto =
  z.infer<typeof UpdateTutorProfileSchema>;

export type RejectTutorDto =
  z.infer<typeof RejectTutorSchema>;