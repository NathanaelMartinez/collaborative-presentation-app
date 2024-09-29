import WebSocket from "ws";
import {
  createPresentation,
  joinPresentation,
  deletePresentation,
} from "./presentation-controller";
import {
  Message,
  ActionType,
  CreatePresentationPayload,
  JoinPresentationPayload,
  DeletePresentationPayload,
  AddSlidePayload,
  EditTextPayload,
  DeleteSlidePayload,
} from "../shared/types/message";
import { addSlide, deleteSlide, editText } from "./slide-controller";

// handle all WebSocket actions for presentations and slides
export const handlePresentationActions = (
  message: Message,
  wss: WebSocket.Server,
  ws: WebSocket
) => {
  switch (message.action) {
    case ActionType.CreatePresentation:
      createPresentation(message, ws);
      break;

    case ActionType.JoinPresentation:
      joinPresentation(message.payload as JoinPresentationPayload, ws);
      break;

    case ActionType.DeletePresentation:
      deletePresentation(message.payload as DeletePresentationPayload, ws, wss);
      break;

    case ActionType.AddSlide:
      addSlide(message.payload as AddSlidePayload, ws, wss);
      break;

    case ActionType.EditText:
      editText(message.payload as EditTextPayload, ws, wss);
      break;

    case ActionType.DeleteSlide:
      deleteSlide(message.payload as DeleteSlidePayload, ws, wss);
      break;

    // TODO: add more cases as functionality grows
    default:
      console.error("Unknown action type:", message.action);
  }
};
