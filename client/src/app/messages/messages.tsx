import { useSocketContext } from "../socket-context";
import styles from "./styles.module.css";
const Messages = () => {
  const context = useSocketContext();

  if (!context) return <></>;

  const { messages, currentUserId } = context;

  const getClassNameForMessage = (userId: string) => {
    return userId === currentUserId ? styles.myMessage : styles.othersMessage;
  };

  return (
    <div className={styles.messageContainer}>
      {messages.map((message, index) => (
        <p key={index} className={getClassNameForMessage(message.userId)}>
          {message.message}
        </p>
      ))}
    </div>
  );
};

export default Messages;
