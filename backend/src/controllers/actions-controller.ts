import WebSocket from "ws";
import {
  createPresentation,
  joinPresentation,
  deletePresentation,
} from "./presentation-controller";
import { Message } from "../shared/types/message";
import { addSlide, deleteSlide, editText } from "./slide-controller";

// handle all WebSocket actions for presentations and slides
export const handlePresentationActions = (
  message: Message,
  wss: WebSocket.Server,
  ws: WebSocket
) => {
  switch (message.action) {
    case "createPresentation":
      createPresentation(message, ws);
      break;

    case "joinPresentation":
      joinPresentation(message, ws);
      break;

    case "deletePresentation":
      deletePresentation(message, ws, wss);
      break;

    case "addSlide":
      addSlide(message, ws, wss);
      break;

    case "editText":
      editText(message, ws, wss);
      break;

    case "deleteSlide":
      deleteSlide(message, ws, wss);
      break;

    // TODO: add more cases as functionality grows
  }
};
