import { Prisma, PrismaClient } from "../../../generated/prisma";
import {
  ISupportChatRepository,
  CreateMessageInput,
  SupportChatDto,
  SupportMessageDto,
  SupportAttachmentDto,
} from "../../../application/ports/support-chat/ISupportChatRepository";

// ── Select shapes ─────────────────────────────────────────────────────────────

const chatSelect = {
  id: true,
  userId: true,
  createdAt: true,
} satisfies Prisma.SupportChatSelect;

const messageSelect = {
  id: true,
  chatId: true,
  senderId: true,
  senderRole: true,
  text: true,
  createdAt: true,
  attachments: {
    select: {
      id: true,
      name: true,
      url: true,
      key: true,
      mimeType: true,
      size: true,
    },
  },
} satisfies Prisma.SupportMessageSelect;

type ChatRow = Prisma.SupportChatGetPayload<{ select: typeof chatSelect }>;
type MessageRow = Prisma.SupportMessageGetPayload<{ select: typeof messageSelect }>;

// ── Repository ────────────────────────────────────────────────────────────────

export class PrismaSupportChatRepository implements ISupportChatRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findOrCreateChat(userId: string): Promise<SupportChatDto> {
    // upsert по уникальному userId — атомарная операция, безопасна при concurrent запросах
    const chat = await this.prisma.supportChat.upsert({
      where: { userId },
      create: { userId },
      update: {},
      select: chatSelect,
    });
    return this.chatToDto(chat);
  }

  async createMessage(input: CreateMessageInput): Promise<SupportMessageDto> {
    const message = await this.prisma.supportMessage.create({
      data: {
        chatId: input.chatId,
        senderId: input.senderId,
        senderRole: input.senderRole,
        text: input.text?.trim() ?? null,
        attachments: {
          create: (input.attachments ?? []).map((a) => ({
            name: a.name,
            url: a.url,
            key: a.key,
            mimeType: a.mimeType,
            size: a.size,
          })),
        },
      },
      select: messageSelect,
    });
    return this.messageToDto(message);
  }

  async getMessages(chatId: string, limit = 50): Promise<SupportMessageDto[]> {
    const messages = await this.prisma.supportMessage.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      take: limit,
      select: messageSelect,
    });
    return messages.map((m: MessageRow) => this.messageToDto(m));
  }

  async findAllChats(): Promise<SupportChatDto[]> {
    const chats = await this.prisma.supportChat.findMany({
      orderBy: { createdAt: "desc" },
      select: chatSelect,
    });
    return chats.map((c: ChatRow) => this.chatToDto(c));
  }

  // ── Mappers ───────────────────────────────────────────────────────────────

  private chatToDto(c: ChatRow): SupportChatDto {
    return {
      id: c.id,
      userId: c.userId,
      createdAt: c.createdAt,
    };
  }

  private messageToDto(m: MessageRow): SupportMessageDto {
    return {
      id: m.id,
      chatId: m.chatId,
      senderId: m.senderId,
      senderRole: m.senderRole,
      text: m.text,
      attachments: m.attachments.map(
        (a: SupportAttachmentDto): SupportAttachmentDto => ({
          id: a.id,
          name: a.name,
          url: a.url,
          key: a.key,
          mimeType: a.mimeType,
          size: a.size,
        })
      ),
      createdAt: m.createdAt,
    };
  }
}