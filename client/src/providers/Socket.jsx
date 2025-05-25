import React, { createContext, useContext, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "../store/useAuthStore";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = (props) => {
  const { authUser } = useAuthStore();
  const socket = useMemo(() =>io("ws://localhost:8900"),[]);

  useEffect(() => {
    if (authUser?._id) {
      socket.emit("addUser", authUser._id);
    }
  }, [authUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};
