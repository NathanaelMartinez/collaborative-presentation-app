import express, { Application, Request, Response } from "express";
import { createServer } from "http";

const app: Application = express();
const server = createServer(app);

// middleware
app.use(express.json());

// test route
app.get("/", (req: Request, res: Response) => {
    res.send("Collaborative Presentation API");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
