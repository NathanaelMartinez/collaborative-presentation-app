import WebSocket from "ws";
import { Slide } from "../models/slide";
import { Presentation } from "../models/presentation";
import { AppDataSource } from "../data-source";
import { validatePermissions } from "../services/role-validation";

// handle adding a new slide
export const addSlide = async (
  message: any,
  ws: WebSocket,
  wss: WebSocket.Server
) => {
  try {
    const hasPermissions = await validatePermissions(
      message.userId,
      message.payload.presentationId
    );

    if (!hasPermissions) {
      ws.send(JSON.stringify({ error: "Insufficient permissions" }));
      return;
    }

    // fetch the presentation and slides repos
    const presentationRepository = AppDataSource.getRepository(Presentation);
    const slideRepository = AppDataSource.getRepository(Slide);

    // find presentation user is trying to add slides to
    const presentation = await presentationRepository.findOne({
      where: { id: message.payload.presentationId },
      relations: ["slides"],
    });

    if (!presentation) {
      ws.send(JSON.stringify({ error: "Presentation not found" }));
      return;
    }

    // create and save the new slide
    const newSlide = slideRepository.create({
      content: "", // start with nothing
      presentation: presentation,
    });
    await slideRepository.save(newSlide);

    // broadcast the new slide to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({ action: "slideAdded", payload: newSlide })
        );
      }
    });
  } catch (error) {
    ws.send(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      })
    );
  }
};

// handle editing a slide's text
export const editText = async (
  message: any,
  ws: WebSocket,
  wss: WebSocket.Server
) => {
  try {
    const hasPermissions = await validatePermissions(
      message.userId,
      message.payload.presentationId
    );

    if (!hasPermissions) {
      ws.send(JSON.stringify({ error: "Insufficient permissions" }));
      return;
    }

    // fetch slide to edit
    const slideRepository = AppDataSource.getRepository(Slide);
    const slide = await slideRepository.findOne({
      where: { id: message.payload.slideId },
    });

    if (!slide) {
      ws.send(JSON.stringify({ error: "Slide not found" }));
      return;
    }

    // update the slide content and save
    slide.content = message.payload.content;
    await slideRepository.save(slide);

    // broadcast updated slide to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ action: "slideEdited", payload: slide }));
      }
    });
  } catch (error) {
    ws.send(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      })
    );
  }
};

// handle deleting a slide
export const deleteSlide = async (
  message: any,
  ws: WebSocket,
  wss: WebSocket.Server
) => {
  try {
    const hasPermissions = await validatePermissions(
      message.userId,
      message.payload.presentationId
    );

    if (!hasPermissions) {
      ws.send(JSON.stringify({ error: "Insufficient permissions" }));
      return;
    }

    // fetch slide to delete
    const slideRepository = AppDataSource.getRepository(Slide);
    const slideToDelete = await slideRepository.findOne({
      where: { id: message.payload.slideId },
    });

    if (!slideToDelete) {
      ws.send(JSON.stringify({ error: "Slide not found" }));
      return;
    }

    // remove the slide from the database
    await slideRepository.remove(slideToDelete);

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
  } catch (error) {
    ws.send(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      })
    );
  }
};
