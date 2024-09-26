import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Presentation } from "./presentation";

@Entity()
export class Slide {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  content!: string;

  @ManyToOne(() => Presentation, (presentation) => presentation.slides)
  presentation!: Presentation;
}
