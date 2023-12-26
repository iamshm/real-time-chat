import { createContext, ReactNode, useEffect, useState } from "react";

interface Context {
  onSendMessage: (message: string) => void;
}

export const SocketContext = createContext<Context | null>(null);
SocketContext.displayName = "SocketContext";

interface ElementProps {
  children: ReactNode;
}
const SocketContextProvider = ({ children }: ElementProps) => {
  const [socketState, setSocketState] = useState<WebSocket>();
  const [userId, setUserId] = useState<number>();

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/", ["echo-protocol"]);
    setSocketState(socket);

    const userId = Math.ceil(Math.random() * 1000);
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
      console.log("WebSocket message received:", event);
      // Handle incoming messages
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
        userId: userId.toString(),
      },
    });
    console.log(stringifiedPayload);

    socketState.send(stringifiedPayload);
  };
  return (
    <SocketContext.Provider
      value={{
        onSendMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
