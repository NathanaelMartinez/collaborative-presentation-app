import WebSocket from "ws";
import { handlePresentationActions } from "../controllers/presentation-controller";
import { Message } from "../models/message";

// WebSocket Server
export const createWebSocketServer = (server: any) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws: WebSocket) => {
    console.log("A new user connected");

    // listen for messages
    ws.on("message", (data: string) => {
      const message: Message = JSON.parse(data);
      handlePresentationActions(message, wss, ws); // process actions from clients
    });

    // Handle disconnects
    ws.on("close", () => {
      console.log("User disconnected");
    });
  });
};
