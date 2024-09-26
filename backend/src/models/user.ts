import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Presentation } from "./presentation";

// define possible roles
export enum UserRole {
  Creator = "creator",
  Editor = "editor",
  Viewer = "viewer",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: "enum", //
    enum: UserRole,
    default: UserRole.Viewer, // default role is 'viewer'
  })
  role!: UserRole;

  @ManyToMany(() => Presentation, (presentation) => presentation.users)
  presentations!: Presentation[];
}
