import { useState } from "react";
import { useSocketContext } from "../socket-context";
import styles from "./styles.module.css";

const InputBox = () => {
  const [message, setMessage] = useState("");
  const context = useSocketContext();

  if (!context) return <div>Input failure</div>;

  const { onSendMessage } = context;
  const onSend = () => {
    onSendMessage(message);
    setMessage("");
  };

  return (
    <div className={styles.inputContainer}>
      <input
        placeholder="Enter a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={onSend}>Send</button>
    </div>
  );
};

export default InputBox;
