import z from "zod";
import { SIZE_LIMITS } from "../../../../../domain/entities/file/fileConstants";
import { CompleteLessonUseCase } from "../../../../../application/usecases/lesson/CompleteLessonUseCase";
import { PrismaClient } from '@prisma/client';
import { IFileStorageFactory } from "../../../../../application/ports/file/IFileStorageFactory";

export const JoinLessonSchema = z.object({
  lessonId: z.string().uuid(),
});
 
export const LessonMessageSchema = z.object({
  lessonId: z.string().uuid(),
  text:     z.string().max(5000).optional(),
  fileKey:  z.string().max(500).optional(),
}).refine(
  d => d.text?.trim() || d.fileKey,
  { message: "Message must contain text or fileKey" }
);
 
export const PresignSchema = z.object({
  lessonId: z.string().uuid(),
  fileName: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(100),
  size:     z.number().int().positive().max(SIZE_LIMITS["lessons"]),
});
 
// ── Типы ──────────────────────────────────────────────────────────────────────
 
export interface LessonContext {
  lessonId: string;
  clientId: string;   // Client.id
  tutorId:  string;   // Tutor.id
  clientUserId: string;  
  tutorUserId: string;
  startAt:  Date;
  status:   string;
}

export interface LessonHandlerDeps {
  completeLessonUseCase: CompleteLessonUseCase;
  fileStorage:           IFileStorageFactory;
  prisma:                PrismaClient;
}