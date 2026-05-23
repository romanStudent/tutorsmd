// presentation/controllers/support-chat/support.schema.ts

import { z } from 'zod';

export const SupportAttachmentSchema = z.object({
  name: z.string().min(1).max(255),
  key: z.string().min(1).max(2000),
  mimeType: z.string().min(1).max(255),
  size: z.number().int().positive(),
});

export const SendSupportMessageSchema = z.object({
  text: z
    .string()
    .max(5000)
    .nullable()
    .optional(),

  attachments: z
    .array(SupportAttachmentSchema)
    .max(10)
    .optional(),
});

export const GetSupportHistoryQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .optional(),

  before: z
    .string()
    .datetime()
    .optional(),
});

export type ChatIdParams = {
  chatId: string;
};

export type SendSupportChatMessageBody =
  z.infer<typeof SendSupportMessageSchema>;

export type GetSupportHistoryQueryDto =
  z.infer<typeof GetSupportHistoryQuerySchema>;