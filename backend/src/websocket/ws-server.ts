import WebSocket from "ws";
import { Message } from "../shared/types/message";
import { handlePresentationActions } from "../controllers/actions-controller";

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
