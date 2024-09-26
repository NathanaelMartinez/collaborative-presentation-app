import WebSocket from "ws";
import { Presentation } from "../models/presentation";
import { generatePresentationId } from "../utils/id-generator";

let presentations: Map<string, Presentation> = new Map(); // TEMPORARY

// handle presentation creation
export const createPresentation = (message: any, ws: WebSocket) => {
  const newPresentationId = generatePresentationId();
  const newPresentation: Presentation = {
    id: newPresentationId,
    creatorId: message.userId!,
    slides: [],
    users: new Map([[message.userId!, { role: "creator" }]]),
  };
  presentations.set(newPresentationId, newPresentation);

  // notify client that presentation has been created
  ws.send(
    JSON.stringify({
      action: "presentationCreated",
      payload: { presentationId: newPresentationId },
    })
  );
};

// handle joining a presentation
export const joinPresentation = (message: any, ws: WebSocket) => {
  const presentation = presentations.get(message.payload.presentationId);
  if (presentation) {
    presentation.users.set(message.userId!, { role: "viewer" }); // default to viewer role
    ws.send(
      JSON.stringify({
        action: "joinedPresentation",
        payload: presentation,
      })
    );
  }
};

// handle deleting presentation
export const deletePresentation = (message: any, wss: WebSocket.Server) => {
  const presentationToDelete = presentations.get(
    message.payload.presentationId
  );
  if (
    presentationToDelete &&
    message.userId === presentationToDelete.creatorId
  ) {
    presentations.delete(message.payload.presentationId); // remove presentation from map

    // notify all connected users that presentation deleted
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
