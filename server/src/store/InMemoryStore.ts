import { Chat, Store } from "./Store";

export interface Room {
  roomId: string;
  chats: Chat[];
}

let globalChatId = 0;

export class InMemoryStore implements Store {
  private store: Map<string, Room>;

  constructor() {
    this.store = new Map<string, Room>();
  }

  initRoom(roomId: string) {
    this.store.set(roomId, {
      roomId,
      chats: [],
    });
  }

  getChats(roomId: string, limit: number, offset: number) {
    const room = this.store.get(roomId);
    if (!room) return [];
    return room.chats
      .reverse()
      .slice(0, limit)
      .slice(-1 * limit);
  }

  addChat(roomId: string, name: string, userId: string, message: string) {
    const room = this.store.get(roomId);
    if (!room) return null;

    const chat = {
      id: (globalChatId++).toString(),
      name,
      userId,
      message,
      upvotes: [],
    };
    room.chats.push(chat);

    return chat;
  }

  upVote(userId: string, roomId: string, chatId: string) {
    const room = this.store.get(roomId);
    if (!room) return null;

    const chat = room.chats.find((chat) => chat.id === chatId);
    if (!chat) return null;

    chat.upvotes.push(userId);

    return chat;
  }
}
