import { useContext, useState } from "react";
import InputBox from "./input-box/input-box";
import SocketContextProvider, { SocketContext } from "./socket-context";

const App = () => {
  return (
    <SocketContextProvider>
      <InputBox />
    </SocketContextProvider>
  );
};

export default App;
