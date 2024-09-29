export enum UserRole {
  Creator = "creator",
  Editor = "editor",
  Viewer = "viewer",
}

export enum ActionType {
  CreatePresentation = "CREATE_PRESENTATION",
  PresentationCreated = "PRESENTATION_CREATED",
  JoinPresentation = "JOIN_PRESENTATION",
  DeletePresentation = "DELETE_PRESENTATION",
  AddSlide = "ADD_SLIDE",
  DeleteSlide = "DELETE_SLIDE",
  EditText = "EDIT_TEXT",
  SetRole = "SET_ROLE",
}
