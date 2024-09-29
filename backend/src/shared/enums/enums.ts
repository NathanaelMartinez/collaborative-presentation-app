export enum UserRole {
  Creator = "creator",
  Editor = "editor",
  Viewer = "viewer",
}

export enum ActionType {
  CreatePresentation = "CREATE_PRESENTATION",
  JoinPresentation = "JOIN_PRESENTATION",
  DeletePresentation = "DELETE_PRESENTATION",
  AddSlide = "ADD_SLIDE",
  EditText = "EDIT_TEXT",
  DeleteSlide = "DELETE_SLIDE",
  setRole = "SET_ROLE",
}
