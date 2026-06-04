import { Request, Response } from 'express';
import { ChatIdParams, GetSupportHistoryQueryDto, SendSupportChatMessageBody } from './support-chat.schema';

export interface ISupportChatController {
  getAllChats(req: Request, res: Response): Promise<void>;
  getChatById(req: Request, res: Response): Promise<void>;
  join(req: Request, res: Response): Promise<void>;
  getMyChat(req: Request, res: Response): Promise<void>;

  getHistory(req: Request<
        ChatIdParams,
        {},
        {},
        GetSupportHistoryQueryDto
      >, res: Response): Promise<void>;

  sendMessage(req: Request<
      ChatIdParams,
      {},
      SendSupportChatMessageBody
    >, res: Response): Promise<void>;
}