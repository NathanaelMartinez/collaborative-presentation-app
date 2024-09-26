import "reflect-metadata";
import { DataSource } from "typeorm";
import { Presentation } from "./models/presentation";
import { Slide } from "./models/slide";
import { User } from "./models/user";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "test",
  password: "test",
  database: "test",
  synchronize: true,
  logging: false,
  entities: [Presentation, Slide, User],
  migrations: [],
  subscribers: [],
});
