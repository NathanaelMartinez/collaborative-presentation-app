import express, { Application, Request, Response } from "express";
import { createServer } from "http";
import WebSocket from "ws";
import cors from "cors";

const app: Application = express();
const server = createServer(app);  // create HTTP server
const wss = new WebSocket.Server({ server });  // create WebSocket server using HTTP server

// Middleware
app.use(cors());
app.use(express.json());

// typescript requires
interface Message {
  type: string;
  payload: any;
}

// handle WebSocket connections
wss.on("connection", (ws: WebSocket) => {
  console.log("A new user connected");

  ws.on("message", (data: string) => {
    // parse incoming message
    const message: Message = JSON.parse(data);

    // broadcast the message to all other connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));  // Send message to each client
      }
    });
  });

  // handle WebSocket disconnection
  ws.on("close", () => {
    console.log("User disconnected");
  });
});

// test route
app.get("/", (req: Request, res: Response) => {
  res.send("Collaborative Presentation.");
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
