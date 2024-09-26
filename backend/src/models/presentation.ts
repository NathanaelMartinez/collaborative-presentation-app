import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Slide } from "./slide";
import { User } from "./user";

@Entity()
export class Presentation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  creatorId!: string;

  @OneToMany(() => Slide, (slide) => slide.presentation, { cascade: true })
  slides!: Slide[];

  @ManyToMany(() => User, (user) => user.presentations)
  @JoinTable() // required for owning side of MtM relationship
  users!: User[];
}
export { Slide };
