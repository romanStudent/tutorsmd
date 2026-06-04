import z from "zod";


const SUPPORT_FILE_SIZE_LIMIT = Number(process.env.SUPPORT_FILE_SIZE_LIMIT) || 25 * 1024 * 1024;

export const JoinSchema = z.object({
  targetUserId: z.string().uuid().optional(),
}).nullable();

export const AdminJoinSchema = z.object({
  targetUserId: z.string().uuid({ message: "targetUserId must be a valid UUID" }),
});

export const FileMetadataSchema = z.object({
  key:      z.string().min(1).max(500),
  name:     z.string().min(1).max(255),
  mimeType: z.string().min(1).max(100),
  size:     z.number().int().positive().max(SUPPORT_FILE_SIZE_LIMIT),
});

export const MessageSchema = z.object({
  text:  z.string().max(5000).optional(),
  files: z.array(FileMetadataSchema).max(5).optional(),
}).refine(
  (d) => d.text?.trim() || (d.files && d.files.length > 0),
  { message: "Message must contain text or files" },
);

export const PresignSchema = z.object({
  fileName: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(100),
  size:     z.number().int().positive().max(SUPPORT_FILE_SIZE_LIMIT),
});

export const TypingSchema = z.object({
  isTyping: z.boolean(),
});

export const HistoryMoreSchema = z.object({
  chatId: z.string().uuid(),
  before: z.string().datetime(),
  limit:  z.number().int().min(1).max(100).optional(),
});