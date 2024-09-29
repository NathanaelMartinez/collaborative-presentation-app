import { useEffect, useState } from 'react';
import { Message } from "../shared/types/message";

export const useWebSocket = (url: string) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const socket = new WebSocket(url);
    setWs(socket);

    socket.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, JSON.parse(event.data)]);
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      socket.close();
    };
  }, [url]);

  const sendMessage = (message: Message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  };

  return { messages, sendMessage };
};
