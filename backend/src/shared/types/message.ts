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
  payload:
    | { content: string } // for adding or editing slides
    | { presentationId: string } // for joining or deleting a presentation
    | { slideId: string }; // for deleting a slide
  userId?: string; // to keep track of which user sent which message
  role?: "creator" | "editor" | "viewer"; // user roles
}
