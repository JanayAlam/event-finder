import { IWorkplaceChatConversationItem } from "../../../common/types/ai.types";

export class ChatConversationShortMemory {
  private static instance: ChatConversationShortMemory =
    new ChatConversationShortMemory();
  private chats: IWorkplaceChatConversationItem[] = [];
  private static limit: number = 5;

  private constructor() {}

  static getInstance() {
    return ChatConversationShortMemory.instance;
  }

  add(chat: IWorkplaceChatConversationItem) {
    this.chats.push(chat);

    if (this.chats.length > ChatConversationShortMemory.limit) {
      this.chats.shift();
    }
  }

  get() {
    return this.chats;
  }

  clear() {
    this.chats = [];
  }
}
