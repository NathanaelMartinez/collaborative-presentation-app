import { useEffect, useState } from 'react';

interface Message {
  type: "action" | "chat"; // communication types
  action?:
    | "createPresentation"
    | "joinPresentation"
    | "deletePresentation"
    | "addSlide"
    | "deleteSlide"
    | "editText"
    | "setRole"; // specific actions for presentation
    payload:
    | { content: string } // for adding or editing slides
    | { presentationId: string } // for joining or deleting a presentation
    | { slideId: string }; // for deleting a slide
  userId?: string; // to keep track of which user sent which message
  role?: "creator" | "editor" | "viewer"; // user roles
}


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
