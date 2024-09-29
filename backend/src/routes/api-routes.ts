import { Router, Request, Response } from "express";
import { Presentation } from "../models/presentation";
import { AppDataSource } from "../data-source";
import { User } from "../models/user";

const router = Router();

router.post("/users", async (req: Request, res: Response) => {
  const { displayName } = req.body;

  if (!displayName) {
    return res.status(400).json({ error: "Display name is required" });
  }

  try {
    const userRepository = AppDataSource.getRepository(User);

    // Check if a user with this display name already exists
    const existingUser = await userRepository.findOne({
      where: { username: displayName },
    });

    if (existingUser) {
      // If user exists, return their ID
      return res.status(200).json({ userId: existingUser.id });
    }

    // create new user with display name
    console.log("Creating user with displayName:", displayName);

    const newUser = userRepository.create({ username: displayName });

    // save new user to database
    await userRepository.save(newUser);

    console.log("New user saved with ID:", newUser.id);

    // return new user id
    res.status(200).json({ userId: newUser.id });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// fetch all presentations
router.get("/presentations", async (req: Request, res: Response) => {
  try {
    const presentationRepository = AppDataSource.getRepository(Presentation);
    const allPresentations = await presentationRepository.find({
      relations: ["users", "slides"],
    });

    if (allPresentations.length === 0) {
      // if no presentations exist, send an appropriate message
      return res.status(200).json({ message: "No presentations available" });
    }

    // return the presentations
    res.json(allPresentations);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching presentations:", error.message);
      res.status(500).json({ error: "Failed to fetch presentations" });
    }
  }
});

// route for health check
router.get("/test", (req: Request, res: Response) => {
  res.status(200).json({ message: "App is running" });
});

export default router;
