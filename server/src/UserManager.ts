import { connection } from "websocket";
import { OutgoingMessage } from "./messages/OutgoingMessages";

interface User {
  id: string;
  name: string;
  connection: connection;
}

interface Room {
  users: User[];
}

export class UserManager {
  private rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map<string, Room>();
  }

  initUser(roomId: string) {
    this.rooms.set(roomId, {
      users: [],
    });
  }

  getUser(userId: string, roomId: string): User | null {
    const user = this.rooms
      .get(roomId)
      ?.users.find((user) => user.id === userId);
    return user ?? null;
  }

  addUser(
    name: string,
    userId: string,
    roomId: string,
    connection: connection,
  ) {
    if (!this.rooms.get(roomId)) {
      this.initUser(roomId);
    }

    this.rooms.get(roomId)?.users.push({
      id: userId,
      name,
      connection,
    });
  }

  removeUser(userId: string, roomId: string) {
    this.rooms.get(roomId)?.users.filter((user) => user.id !== userId);
  }

  broadCast(userId: string, roomId: string, message: OutgoingMessage) {
    const user = this.getUser(userId, roomId);
    const room = this.rooms.get(roomId);

    if (!user || !room) {
      console.error("Invalid data");
      return;
    }

    room.users.forEach((user) => {
      if (user.id === userId) return;

      user.connection.sendUTF(JSON.stringify(message));
    });
  }
}
