import React, { createContext, useEffect, useState, useContext, ReactNode } from "react";
import { Message } from "../shared/types/message";

// Define WebSocket context interface
interface WebSocketContextType {
  messages: Message[];
  sendMessage: (message: Message) => void;
}

// Create WebSocket Context with default value as `undefined`
const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// WebSocket Provider Component
export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);

    ws.onmessage = (event: MessageEvent) => {
      const message: Message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  // Send message over WebSocket
  const sendMessage = (message: Message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext.Provider value={{ messages, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom Hook to use WebSocket Context
export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider");
  }
  return context;
};
