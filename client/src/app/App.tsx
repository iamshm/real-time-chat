import InputBox from "./input-box/input-box";
import Messages from "./messages/messages";
import SocketContextProvider from "./socket-context";
import styles from "./App.module.css";

const App = () => {
  return (
    <SocketContextProvider>
      <div className={styles.container}>
        <Messages />

        <InputBox />
      </div>
    </SocketContextProvider>
  );
};

export default App;
