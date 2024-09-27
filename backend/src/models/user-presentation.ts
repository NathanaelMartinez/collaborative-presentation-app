import { Entity, ManyToOne, Column, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Presentation } from "./presentation";
import { UserRole } from "../shared/enums/enums";

@Entity()
export class UserPresentation {
  @PrimaryGeneratedColumn()
  id!: number;

  // This is a junction entity of user and presentation to use UserRole
  @ManyToOne(() => User, (user) => user.presentations)
  user!: User;

  @ManyToOne(() => Presentation, (presentation) => presentation.users)
  presentation!: Presentation;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.Viewer, // default role is 'viewer'
  })
  role!: UserRole; // user's role in the presentation
}
