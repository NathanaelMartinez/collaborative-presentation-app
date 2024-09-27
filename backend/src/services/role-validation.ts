import { AppDataSource } from "../data-source";
import { UserPresentation } from "../models/user-presentation";
import { UserRole } from "../shared/enums/user-role.enum";

export const validatePermissions = async (
  userId: number,
  presentationId: string
): Promise<boolean> => {
  const userPresentationRepository =
    AppDataSource.getRepository(UserPresentation);

  const userPresentation = await userPresentationRepository.findOne({
    where: { user: { id: userId }, presentation: { id: presentationId } },
  });

  if (!userPresentation) {
    throw new Error("User not found in this presentation");
  }

  return [UserRole.Creator, UserRole.Editor].includes(userPresentation.role);
};
