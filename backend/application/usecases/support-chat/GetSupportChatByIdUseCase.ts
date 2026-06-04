import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { ForbiddenError } from "../../../domain/errors/ForbiddenError";
import {
  ISupportChatRepository,
  SupportChatDto,
} from "../../ports/support-chat/ISupportChatFactory";

export interface GetSupportChatByIdOutput {
  chat: SupportChatDto;
}

export class GetSupportChatByIdUseCase {
  constructor(
    private readonly supportChatRepo: ISupportChatRepository,
  ) {}

  async execute(
    chatId: string,
    requesterRole: string,
  ): Promise<GetSupportChatByIdOutput> {

    if (requesterRole !== "admin") {
      throw new ForbiddenError("Only admins can access support chats");
    }

    const chat = await this.supportChatRepo.findChatById(chatId);

    if (!chat) {
      throw new NotFoundError("Support chat not found");
    }

    return { chat };
  }
}