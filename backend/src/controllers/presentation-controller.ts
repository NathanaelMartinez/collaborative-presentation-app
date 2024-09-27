import WebSocket from "ws";
import { Presentation } from "../models/presentation";
import { AppDataSource } from "../data-source";
import { User } from "../models/user";
import { UserPresentation } from "../models/user-presentation"; // join table
import { UserRole } from "../../../shared/enums/enums";

// handle presentation creation
export const createPresentation = async (message: any, ws: WebSocket) => {
  const presentationRepository = AppDataSource.getRepository(Presentation);
  const userRepository = AppDataSource.getRepository(User);
  const userPresentationRepository =
    AppDataSource.getRepository(UserPresentation);

  // find user creating the presentation
  const user = await userRepository.findOne({ where: { id: message.userId } });
  if (!user) {
    ws.send(JSON.stringify({ error: "User not found" }));
    return;
  }

  // create new presentation
  const newPresentation = presentationRepository.create({
    creatorId: message.userId!,
    slides: [], // empty on creation
  });
  await presentationRepository.save(newPresentation);

  // assign user as creator in junction table
  const userPresentation = userPresentationRepository.create({
    user: user,
    presentation: newPresentation,
    role: UserRole.Creator, // assign creator role
  });
  await userPresentationRepository.save(userPresentation);

  // notify client that presentation has been created
  ws.send(
    JSON.stringify({
      action: "presentationCreated",
      payload: { presentationId: newPresentation.id },
    })
  );
};

export const joinPresentation = async (message: any, ws: WebSocket) => {
  const presentationRepository = AppDataSource.getRepository(Presentation);
  const userRepository = AppDataSource.getRepository(User);
  const userPresentationRepository =
    AppDataSource.getRepository(UserPresentation);

  // find the user joining the presentation
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

  if (!presentation) {
    ws.send(JSON.stringify({ error: "Presentation not found" }));
    return;
  }

  // check if user is already part of presentation
  const existingUserPresentation = await userPresentationRepository.findOne({
    where: { user: user, presentation: presentation },
  });

  if (!existingUserPresentation) {
    // add user to presentation with 'viewer' role if not already part of it
    const userPresentation = userPresentationRepository.create({
      user: user,
      presentation: presentation,
      role: UserRole.Viewer,
    });
    await userPresentationRepository.save(userPresentation);
  }

  // notify client they have joined the presentation
  ws.send(
    JSON.stringify({
      action: "joinedPresentation",
      payload: presentation,
    })
  );
};

export const deletePresentation = async (
  message: any,
  ws: WebSocket,
  wss: WebSocket.Server
) => {
  const presentationRepository = AppDataSource.getRepository(Presentation);

  // find presentation by id
  const presentationToDelete = await presentationRepository.findOne({
    where: { id: message.payload.presentationId },
  });

  if (!presentationToDelete) {
    ws.send(JSON.stringify({ error: "Presentation not found" }));
    return;
  }

  // check if user is creator, only allow creators to delete
  if (
    presentationToDelete &&
    message.userId === presentationToDelete.creatorId
  ) {
    await presentationRepository.remove(presentationToDelete); // delete presentation

    // notify all connected users
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
  } else {
    ws.send(
      JSON.stringify({
        error: "You do not have permission to delete this presentation",
      })
    );
  }
};
