import express, { Application, Request, Response } from "express";
import { createServer } from "http";
import cors from "cors";
import { createWebSocketServer } from "./websocket/ws-server";
import "reflect-metadata";
import apiRoutes from "./routes/api-routes";

// init Express app and HTTP server
const app: Application = express();
const server = createServer(app);

// middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", apiRoutes);

// init WebSocket Server
createWebSocketServer(server);

// start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
