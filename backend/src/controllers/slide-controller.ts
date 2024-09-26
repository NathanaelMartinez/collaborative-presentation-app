import WebSocket from "ws";
import { Slide } from "../models/presentation";
import { generateSlideId } from "../utils/id-generator";

let slides: Slide[] = []; // In-memory slide storage

// Handle adding a new slide
export const addSlide = (message: any, wss: WebSocket.Server) => {
  if (message.role === "creator" || message.role === "editor") {
    const newSlide: Slide = {
      id: generateSlideId(),
      content: "",
      elements: [],
    };
    slides.push(newSlide);

    // Broadcast the new slide to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({ action: "slideAdded", payload: newSlide })
        );
      }
    });
  }
};

// Handle editing a slide's text
export const editText = (message: any, wss: WebSocket.Server) => {
  const slide = slides.find((s) => s.id === message.payload.slideId);
  if (slide) {
    slide.content = message.payload.content;

    // Broadcast the updated slide to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ action: "slideEdited", payload: slide }));
      }
    });
  }
};

// Handle deleting a slide
export const deleteSlide = (message: any, wss: WebSocket.Server) => {
  const slideIndex = slides.findIndex((s) => s.id === message.payload.slideId);
  if (slideIndex !== -1) {
    slides.splice(slideIndex, 1); // Remove slide

    // Broadcast the deletion to all clients
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
  }
};
