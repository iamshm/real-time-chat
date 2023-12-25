import z from "zod";

export enum SupportedIncomingMessage {
  JoinRoom = "JOIN_ROOM",
  SendMessage = "SEND_MESSAGE",
  UpvoteMessage = "UPVOTE_MESSAGE",
}

export const InitMessage = z.object({
  name: z.string(),
  roomId: z.string(),
  userId: z.string(),
});

export type InitMessageType = z.infer<typeof InitMessage>;

export const UserMessage = z.object({
  message: z.string(),
  roomId: z.string(),
  userId: z.string(),
});

export type UserMessageType = z.infer<typeof UserMessage>;

export const UpvoteMessage = z.object({
  chatId: z.string(),
  roomId: z.string(),
  userId: z.string(),
});

export type UpvoteMessageType = z.infer<typeof UpvoteMessage>;

export type IncomingMessage =
  | {
      type: SupportedIncomingMessage.JoinRoom;
      payload: InitMessageType;
    }
  | {
      type: SupportedIncomingMessage.SendMessage;
      payload: UserMessageType;
    }
  | {
      type: SupportedIncomingMessage.UpvoteMessage;
      payload: UpvoteMessageType;
    };
