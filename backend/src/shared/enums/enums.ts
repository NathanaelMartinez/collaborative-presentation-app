export enum UserRole {
  Creator = "creator",
  Editor = "editor",
  Viewer = "viewer",
}

export enum ActionType {
  CreatePresentation = "createPresentation",
  JoinPresentation = "joinPresentation",
  DeletePresentation = "deletePresentation",
  AddSlide = "addSlide",
  DeleteSlide = "deleteSlide",
  EditText = "editText",
  SetRole = "setRole",
}
