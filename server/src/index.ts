import { server as WebSocketServer, connection } from "websocket";
import http from "http";
import {
  IncomingMessage,
  SupportedIncomingMessage,
} from "./messages/IncomingMessages";
import { UserManager } from "./UserManager";
import { InMemoryStore } from "./store/InMemoryStore";
import {
  OutgoingMessage,
  SupportedOutgoingMessage,
} from "./messages/OutgoingMessages";

const userManager = new UserManager();
const store = new InMemoryStore();

const server = http.createServer(function (request, response) {
  console.log(new Date() + " Received request for " + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(8080, function () {
  console.log(new Date() + " Server is listening on port 8080");
});

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

function originIsAllowed(origin) {
  console.log(origin);

  return true;
}

wsServer.on("request", (request) => {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    return;
  }

  const connection = request.accept("echo-protocol", request.origin); // creating connection of websocket with the incoming request

  connection.on("message", (message) => {
    // adding event listener on the created connection
    if (message.type === "utf8") {
      try {
        messageHandler(connection, {
          type: SupportedIncomingMessage.JoinRoom,
          payload: {
            name: "",
            roomId: "",
            userId: "",
          },
        });
      } catch (error) {}
    } else if (message.type === "binary") {
      connection.sendBytes(message.binaryData);
    }
  });

  connection.on("close", (reasonCode, description) => {});
});

const messageHandler = (ws: connection, message: IncomingMessage) => {
  if (message.type === SupportedIncomingMessage.JoinRoom) {
    const payload = message.payload;
    userManager.addUser(payload.name, payload.userId, payload.roomId, ws);
  }

  if (message.type === SupportedIncomingMessage.SendMessage) {
    const payload = message.payload;
    const user = userManager.getUser(payload.roomId, payload.userId);

    if (!user) {
      console.error("User not found");
      return;
    }
    const chat = store.addChat(
      payload.roomId,
      user.name,
      payload.userId,
      payload.message,
    );
    if (!chat) return;

    const outgoingPayload: OutgoingMessage = {
      type: SupportedOutgoingMessage.AddChat,
      payload: {
        chatId: chat.id,
        roomId: payload.roomId,
        message: payload.message,
        name: user.name,
        upvotes: 0,
      },
    };

    userManager.broadCast(payload.userId, payload.roomId, outgoingPayload);
  }

  if (message.type === SupportedIncomingMessage.UpvoteMessage) {
    const payload = message.payload;

    const chat = store.upVote(payload.userId, payload.roomId, payload.chatId);
    if (!chat) {
      return;
    }

    const outgoingPayload: OutgoingMessage = {
      type: SupportedOutgoingMessage.UpdateChat,
      payload: {
        chatId: payload.chatId,
        roomId: payload.roomId,
        upvotes: chat.upvotes.length,
      },
    };

    userManager.broadCast(payload.userId, payload.roomId, outgoingPayload);
  }
};
