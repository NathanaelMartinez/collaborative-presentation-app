import WebSocket from "ws";
import { handlePresentationActions } from "../controllers/actions-controller";
import { Message } from "../shared/types/message";

// WebSocket Server
export const createWebSocketServer = (server: any) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws: WebSocket) => {
    console.log("A new user connected");

    // listen for messages
    ws.on("message", (data: string) => {
      const message: Message = JSON.parse(data);
      console.log("Received message:", message);
      handlePresentationActions(message, wss, ws); // process actions from clients
    });

    // handle disconnects
    ws.on("close", () => {
      console.log("User disconnected");
    });
  });
};
