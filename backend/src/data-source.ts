import "reflect-metadata";
import { DataSource } from "typeorm";
import { Presentation } from "./models/presentation";
import { Slide } from "./models/slide";
import { User } from "./models/user";
import { UserPresentation } from "./models/user-presentation";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Presentation, Slide, User, UserPresentation],
  migrations: [],
  subscribers: [],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  },
});
