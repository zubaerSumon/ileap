import { z } from 'zod';

export const sendMessageSchema = z.object({
  receiverId: z.string(),
  content: z.string().min(1, 'Message content cannot be empty'),
});

export const getMessagesSchema = z.object({
  userId: z.string(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type GetMessagesInput = z.infer<typeof getMessagesSchema>;