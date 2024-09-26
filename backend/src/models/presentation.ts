// /src/models/presentation.ts

export interface Presentation {
  id: string;
  creatorId: string;
  slides: Slide[];
  users: Map<string, { role: "creator" | "editor" | "viewer" }>;
}

export interface Slide {
  id: string;
  content: string;
  elements: Element[];
}
