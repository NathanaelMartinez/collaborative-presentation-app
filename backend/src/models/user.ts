import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserPresentation } from "./user-presentation";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @OneToMany(
    () => UserPresentation,
    (userPresentation) => userPresentation.user
  )
  presentations!: UserPresentation[]; // join table with presentations
}
