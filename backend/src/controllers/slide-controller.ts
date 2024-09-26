import WebSocket from "ws";
import { Slide } from "../models/slide";
import { Presentation } from "../models/presentation";
import { AppDataSource } from "../data-source";
import { generateSlideId } from "../utils/id-generator";
import { User, UserRole } from "../models/user";

// validate if the user is either a creator or editor
export const validateUserIsEditorOrCreator = async (
  userId: number
): Promise<boolean> => {
  const userRepository = AppDataSource.getRepository(User);

  // find the user by id
  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  // check if user is either creator or editor
  return user.role === UserRole.Creator || user.role === UserRole.Editor;
};

// handle adding a new slide
export const addSlide = async (
  message: any,
  ws: WebSocket,
  wss: WebSocket.Server
) => {
  try {
    const hasPermissions = await validateUserIsEditorOrCreator(message.userId);

    // validate user permissions
    if (!hasPermissions) {
      ws.send(JSON.stringify({ error: "Insufficient permissions" }));
      return;
    }

    // existing logic for finding presentation and adding the slide
    const presentationRepository = AppDataSource.getRepository(Presentation);
    const slideRepository = AppDataSource.getRepository(Slide);

    const presentation = await presentationRepository.findOne({
      where: { id: message.payload.presentationId },
      relations: ["slides"],
    });

    if (!presentation) {
      ws.send(JSON.stringify({ error: "Presentation not found" }));
      return;
    }

    const newSlide = slideRepository.create({
      id: generateSlideId(),
      content: "",
      presentation: presentation,
    });

    await slideRepository.save(newSlide);

    // broadcast new slide to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({ action: "slideAdded", payload: newSlide })
        );
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      ws.send(JSON.stringify({ error: error.message }));
    } else {
      ws.send(JSON.stringify({ error: "An unknown error occurred" }));
    }
  }
};

// handle editing a slide's text
export const editText = async (
  message: any,
  ws: WebSocket,
  wss: WebSocket.Server
) => {
  const userRepository = AppDataSource.getRepository(User);
  const slideRepository = AppDataSource.getRepository(Slide);

  const user = await userRepository.findOne({ where: { id: message.userId } });
  if (!user || (user.role !== "creator" && user.role !== "editor")) {
    ws.send(JSON.stringify({ error: "Insufficient permissions" }));
    return;
  }

  // find the slide by id
  const slide = await slideRepository.findOne({
    where: { id: message.payload.slideId },
  });

  if (slide) {
    // update slide content and save
    slide.content = message.payload.content;
    await slideRepository.save(slide);

    // broadcast updated slide to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ action: "slideEdited", payload: slide }));
      }
    });
  }
};

// handle deleting a slide
export const deleteSlide = async (
  message: any,
  ws: WebSocket,
  wss: WebSocket.Server
) => {
  const userRepository = AppDataSource.getRepository(User);
  const slideRepository = AppDataSource.getRepository(Slide);

  const user = await userRepository.findOne({ where: { id: message.userId } });
  if (!user || (user.role !== "creator" && user.role !== "editor")) {
    ws.send(JSON.stringify({ error: "Insufficient permissions" }));
    return;
  }

  // find the slide by id and delete
  const slide = await slideRepository.findOne({
    where: { id: message.payload.slideId },
  });

  if (slide) {
    await slideRepository.remove(slide);

    // broadcast slide deletion to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            action: "slideDeleted",
            payload: { slideId: message.payload.slideId },
          })
        );
      }
    });
  }
};
