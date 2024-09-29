import express, { Application, Request, Response } from "express";
import { createServer } from "http";
import cors from "cors";
import "dotenv/config";
import { createWebSocketServer } from "./websocket/ws-server";
import "reflect-metadata";
import apiRoutes from "./routes/api-routes";
import { AppDataSource } from "./data-source";

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

AppDataSource.initialize()
  .then(() => {
    console.log("DB has been initialized!");
  })
  .catch((err) => {
    console.error("Error during DB initialization:", err);
  });

// start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
