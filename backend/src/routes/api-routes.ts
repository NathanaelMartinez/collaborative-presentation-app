import { Router, Request, Response } from "express";
import { Presentation } from "../models/presentation";

const router = Router();
let presentations: Map<string, Presentation> = new Map(); // TEMPORARY

// fetch all presentations
router.get("/", (req: Request, res: Response) => {
  const allPresentations = Array.from(presentations.values()).map((p) => ({
    id: p.id,
    creatorId: p.creatorId,
  }));
  res.json(allPresentations);
});

// route for health check
router.get("/test", (req: Request, res: Response) => {
  res.status(200).json({ message: "App is running" });
});

export default router;
