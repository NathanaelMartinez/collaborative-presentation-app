import WebSocket from "ws";
import { generatePresentationId, generateSlideId } from "../utils/id-generator";
import { Presentation, Slide } from "../models/presentation";
import { Message } from "../models/message";

// TODO: store users/slides in a db
const users = new Map<string, { role: string }>();
const slides: Slide[] = [];
let presentations: Map<string, Presentation> = new Map();

// Handle all WebSocket actions for presentations
export const handlePresentationActions = (
  message: Message,
  wss: WebSocket.Server,
  ws: WebSocket
) => {
  switch (message.action) {
    case "createPresentation":
      const newPresentationId = generatePresentationId();
      const newPresentation: Presentation = {
        id: newPresentationId,
        creatorId: message.userId!,
        slides: [],
        users: new Map([[message.userId!, { role: "creator" }]]),
      };
      presentations.set(newPresentationId, newPresentation);

      // broadcast the new presentation to the creator
      ws.send(
        JSON.stringify({
          action: "presentationCreated",
          payload: { presentationId: newPresentationId },
        })
      );
      break;

    case "joinPresentation":
      const presentation = presentations.get(message.payload.presentationId);
      if (presentation) {
        presentation.users.set(message.userId!, { role: "viewer" }); // default role is viewer
        ws.send(
          JSON.stringify({
            action: "joinedPresentation",
            payload: presentation,
          })
        );
      }
      break;

    case "deletePresentation":
      const presentationToDelete = presentations.get(
        message.payload.presentationId
      );
      if (
        presentationToDelete &&
        message.userId === presentationToDelete.creatorId
      ) {
        // only creator can delete presentation
        presentations.delete(message.payload.presentationId); // remove presentation

        // notify all connected users that the presentation has been deleted
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

        console.log(
          `Presentation ${message.payload.presentationId} deleted by ${message.userId}`
        );
      } else {
        console.log("Unauthorized attempt to delete presentation.");
      }
      break;

    case "addSlide":
      // handle adding a new slide (creators and editors only)
      if (message.role === "creator" || message.role === "editor") {
        console.log("Slide added by:", message.userId);
        const newSlide: Slide = {
          id: generateSlideId(),
          content: "",
          elements: [],
        };
        slides.push(newSlide);

        // broadcast the new slide to all users
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({ action: "slideAdded", payload: newSlide })
            ); // client messages don't have to be same as server
          }
        });
      }
      break;

    case "editText":
      // handle editing text (creators and editors only)
      if (message.role === "creator" || message.role === "editor") {
        const slide = slides.find((s) => s.id === message.payload.slideId); // fetch the slide
        if (slide) {
          slide.content = message.payload.content;
          console.log(
            `Slide ${message.payload.slideId} edited by ${message.userId}`
          );

          // broadcast the updated slide to all users
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({ action: "slideEdited", payload: slide })
              );
            }
          });
        }
      }
      break;

    case "deleteSlide":
      // TODO: change when database used
      // handle slide deletion (creators and editors only)
      if (message.role === "creator" || message.role === "editor") {
        const slideIndex = slides.findIndex(
          (s) => s.id === message.payload.slideId
        ); // retrieve index for delete
        if (slideIndex !== -1) {
          // if an index could be retrieved
          slides.splice(slideIndex, 1); // splice it out

          // broadcast slide deletion to all users
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

          console.log(
            `Slide ${message.payload.slideId} deleted by ${message.userId}`
          );
        } else {
          console.log("Unauthorized attempt to delete slide.");
        }
      }
      break;

    case "setRole":
      // only the creator can set roles
      if (message.role === "creator") {
        const targetUserId = message.payload.userId;
        const newRole = message.payload.newRole;
        users.set(targetUserId, { role: newRole });
        console.log(`User ${targetUserId} is now a ${newRole}`);
        // notify all clients about the role change
        wss.clients.forEach((client) => {
          client.send(
            JSON.stringify({
              action: "roleChanged",
              payload: { targetUserId, newRole },
            })
          );
        });
      }
      break;

    // TODO: add more cases as functionality grows
  }
};
