export interface Message {
  type: "action" | "chat"; // communication types
  action?:
    | "createPresentation"
    | "joinPresentation"
    | "deletePresentation"
    | "addSlide"
    | "deleteSlide"
    | "editText"
    | "setRole"; // specific actions for presentation
  payload: any;
  userId?: string; // to keep track of which user sent which message
  role?: "creator" | "editor" | "viewer"; // user roles
}
