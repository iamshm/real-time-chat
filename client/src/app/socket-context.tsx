import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface Context {
  currentUserId: string;
  onSendMessage: (message: string) => void;
  messages: MessageType[];
}

export const SocketContext = createContext<Context | null>(null);
SocketContext.displayName = "SocketContext";

export const useSocketContext = () => {
  const context = useContext(SocketContext);

  return context;
};

interface ElementProps {
  children: ReactNode;
}

interface MessageType {
  userId: string;
  chatId: string;
  roomId: string;
  message: string;
  name: string;
  upvotes: number;
}

const SocketContextProvider = ({ children }: ElementProps) => {
  const [socketState, setSocketState] = useState<WebSocket>();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/", ["echo-protocol"]);
    setSocketState(socket);

    const userId = Math.ceil(Math.random() * 1000).toString();
    setUserId(userId);

    socket.addEventListener("open", (event) => {
      console.log("WebSocket connection opened:", event);

      alert(userId);
      const payload = {
        type: "JOIN_ROOM",
        payload: {
          name: `Suraj ${userId}`,
          roomId: "1",
          userId: userId,
        },
      };
      socket.send(JSON.stringify(payload));
    });

    socket.addEventListener("message", (event) => {
      // Handle incoming messages
      const parsedReceivedMessage = JSON.parse(event.data);

      if (!!parsedReceivedMessage?.payload) {
        setMessages((prev) => [...prev, parsedReceivedMessage.payload]);
      }
    });

    socket.addEventListener("close", (event) => {
      console.log("WebSocket connection closed:", event);
    });

    return () => {
      socket.close();
    };
  }, []);

  if (!socketState || !userId) return <div>Socket not connected</div>;

  const onSendMessage = (message: string) => {
    const stringifiedPayload = JSON.stringify({
      type: "SEND_MESSAGE",
      payload: {
        message,
        roomId: "1",
        userId: userId,
      },
    });

    socketState.send(stringifiedPayload);
  };

  return (
    <SocketContext.Provider
      value={{
        onSendMessage,
        messages,
        currentUserId: userId,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
