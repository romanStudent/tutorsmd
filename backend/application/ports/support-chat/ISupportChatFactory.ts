import { FileMetadataDto } from '../file/FileMetadataDto';

export interface SupportChatDto {
  id:        string;
  userId:    string;
  createdAt: Date;
}

export interface SupportAttachmentDto extends FileMetadataDto {
  id: string; // id из БД - нужен для удаления конкретного вложения
}

export interface SupportMessageDto {
  id:          string;
  chatId:      string;
  senderId:    string;
  senderRole:  string; 
  text:        string | null;
  attachments: SupportAttachmentDto[]; 
  createdAt:   Date;
}


export interface AttachmentCreateInput {
  name:     string;  
  key:      string;    
  mimeType: string;
  size:     number;
}

export interface CreateMessageInput {
  chatId:       string;
  senderId:     string;
  senderRole:   string;
  text?:        string | null;
  attachments?: AttachmentCreateInput[];
}


export interface ISupportChatRepository {
  findOrCreateChat(userId: string): Promise<SupportChatDto>;
  findChatById(chatId: string): Promise<SupportChatDto | null>;

  createMessage(input: CreateMessageInput): Promise<SupportMessageDto>;
  getMessages(chatId: string, limit?: number, before?: Date): Promise<SupportMessageDto[]>;
  findAllChats(): Promise<SupportChatDto[]>; // для admin-панели
}