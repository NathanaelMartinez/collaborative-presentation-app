import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserPresentation } from "./user-presentation";
import { Slide } from "./slide";

@Entity()
export class Presentation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  creatorId!: string;

  @OneToMany(() => Slide, (slide) => slide.presentation, { cascade: true })
  slides!: Slide[];

  @OneToMany(
    () => UserPresentation,
    (userPresentation) => userPresentation.presentation
  )
  users!: UserPresentation[]; // join table with users
}
