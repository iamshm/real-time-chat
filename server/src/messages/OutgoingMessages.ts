export enum SupportedOutgoingMessage {
  AddChat = "ADD_CHAT",
  UpdateChat = "UPDATE_CHAT",
}

type OutgoingMessagePayload = {
  roomId: string;
  message: string;
  name: string;
  upvotes: number;
  chatId: string;
};

export type OutgoingMessage =
  | {
      type: SupportedOutgoingMessage.AddChat;
      payload: OutgoingMessagePayload;
    }
  | {
      type: SupportedOutgoingMessage.UpdateChat;
      payload: Partial<OutgoingMessagePayload>;
    };
