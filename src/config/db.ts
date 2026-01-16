import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { DataSource } from "typeorm";
import logger from "../util/logger";
import { User } from "../modules/users/models/user.model";
import { KnowledgeResource } from "../modules/knowledge-resources/models/knowledge-resource.model";
import { KnowledgeMetadata } from "../modules/knowledge-metadata/models/knowledge-metadata.model";

dotenv.config();

const SQLITE_PATH = process.env.SQLITE_PATH || "data/dkn.db";

const resolveDatabasePath = (databasePath: string) => {
  if (databasePath === ":memory:") {
    return databasePath;
  }

  return path.resolve(databasePath);
};

const resolvedDatabasePath = resolveDatabasePath(SQLITE_PATH);

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: resolvedDatabasePath,
  entities: [User, KnowledgeResource, KnowledgeMetadata],
  synchronize: true,
  logging: false,
});

const ensureDatabaseDirectory = () => {
  if (resolvedDatabasePath === ":memory:") {
    return;
  }

  const databaseDir = path.dirname(resolvedDatabasePath);
  fs.mkdirSync(databaseDir, { recursive: true });
};

export const initializeDatabase = async () => {
  logger.info("Connecting SQLite database...");

  try {
    ensureDatabaseDirectory();
    await AppDataSource.initialize();
    logger.info("SQLite successfully connected.");
  } catch (error) {
    logger.error("SQLite Connection Error:", error);
    process.exit(1);
  }
};

export default initializeDatabase;
