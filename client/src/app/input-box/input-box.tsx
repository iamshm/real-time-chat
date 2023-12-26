import { useContext, useState } from "react";
import { SocketContext } from "../socket-context";

const InputBox = () => {
  const [message, setMessage] = useState("");
  const context = useContext(SocketContext);
  if (!context) return <div>Input failure</div>;

  const { onSendMessage } = context;
  const onSend = () => {
    onSendMessage(message);
    setMessage("");
  };

  return (
    <div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={onSend}>Send Chat</button>
    </div>
  );
};

export default InputBox;
