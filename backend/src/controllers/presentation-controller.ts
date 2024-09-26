import WebSocket from "ws";
import { Presentation } from "../models/presentation";
import { generatePresentationId } from "../utils/id-generator";
import { AppDataSource } from "../data-source";
import { User } from "../models/user";

// handle presentation creation
export const createPresentation = async (message: any, ws: WebSocket) => {
  const presentationRepository = AppDataSource.getRepository(Presentation); // get typeorm repository
  const newPresentationId = generatePresentationId(); // generate new presentation id

  // create new presentation object
  const newPresentation = presentationRepository.create({
    id: newPresentationId,
    creatorId: message.userId!,
    slides: [],
  });

  await presentationRepository.save(newPresentation); // save new presentation to database

  // notify client that presentation has been created
  ws.send(
    JSON.stringify({
      action: "presentationCreated",
      payload: { presentationId: newPresentationId },
    })
  );
};

// handle joining a presentation
export const joinPresentation = async (message: any, ws: WebSocket) => {
  const presentationRepository = AppDataSource.getRepository(Presentation); // get typeorm repository
  const userRepository = AppDataSource.getRepository(User); // get user repository

  // find the user who is joining the presentation
  const user = await userRepository.findOne({ where: { id: message.userId } });
  if (!user) {
    ws.send(JSON.stringify({ error: "User not found" }));
    return;
  }

  // find presentation by id
  const presentation = await presentationRepository.findOne({
    where: { id: message.payload.presentationId },
    relations: ["slides", "users"], // include slides and users in the presentation
  });

  // if presentation exists, add user to presentation
  if (presentation) {
    if (!presentation.users.some((u) => u.id === user.id)) {
      // add user to the presentation if they are not already part of it
      presentation.users.push(user);
      await presentationRepository.save(presentation); // save updated presentation
    }

    // notify client that they have joined the presentation
    ws.send(
      JSON.stringify({
        action: "joinedPresentation",
        payload: presentation,
      })
    );
  } else {
    ws.send(JSON.stringify({ error: "Presentation not found" }));
  }
};

// handle deleting a presentation
export const deletePresentation = async (
  message: any,
  wss: WebSocket.Server
) => {
  const presentationRepository = AppDataSource.getRepository(Presentation); // get typeorm repository

  // find presentation by id
  const presentationToDelete = await presentationRepository.findOne(
    message.payload.presentationId
  );

  // if presentation exists and user is creator, delete it
  if (
    presentationToDelete &&
    message.userId === presentationToDelete.creatorId
  ) {
    await presentationRepository.remove(presentationToDelete); // delete presentation from database

    // notify all connected users that presentation has been deleted
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            action: "presentationDeleted",
            payload: { presentationId: message.payload.presentationId },
          })
        );
      }
    });
  }
};
