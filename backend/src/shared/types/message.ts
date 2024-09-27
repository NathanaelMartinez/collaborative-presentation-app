import { ActionType, UserRole } from "../enums/enums";

export type CreatePresentationPayload = { content: string };
export type JoinPresentationPayload = { presentationId: string };
export type DeletePresentationPayload = { presentationId: string };
export type AddSlidePayload = { content: string };
export type DeleteSlidePayload = { slideId: string };
export type EditTextPayload = { slideId: string; content: string };
export type SetRolePayload = {
  userId: string;
  role: "creator" | "editor" | "viewer";
};

// Export all as part of the MessagePayload union
export type MessagePayload =
  | CreatePresentationPayload
  | JoinPresentationPayload
  | DeletePresentationPayload
  | AddSlidePayload
  | DeleteSlidePayload
  | EditTextPayload
  | SetRolePayload;
export interface Message {
  type: "action" | "chat";
  action: ActionType;
  payload: MessagePayload; // more flexible payload
  userId: string; // keep this required for tracking users
  role?: UserRole; // keep optional, as roles may not always be sent
}
