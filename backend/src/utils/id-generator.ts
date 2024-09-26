export const generateSlideId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const generatePresentationId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};
