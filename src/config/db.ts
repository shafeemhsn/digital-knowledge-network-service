import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { DataSource } from "typeorm";
import logger from "../util/logger";
import { User } from "../modules/users/entity/user.enity";
import { Role } from "../modules/users/entity/role.enity";
import { Permission } from "../modules/users/entity/permission.enity";
import { KnowledgeResource } from "../modules/knowledge-manager/enity/knowledge-resource.enity";
import { KnowledgeMetadata } from "../modules/knowledge-manager/enity/knowledge-metadata.entity";
import { KnowledgeVersion } from "../modules/knowledge-manager/enity/knowledge-version.entity";
import { ComplianceCheck } from "../modules/governance-manager/entity/compliance-check.enity";
import { ValidationRecord } from "../modules/governance-manager/entity/validation-record.enity";
import { AuditRecord } from "../modules/governance-manager/entity/audit-record.entity";
import { PublishingRecord } from "../modules/governance-manager/entity/publishing-record.entity";
import { Region } from "../modules/geo-location/entity/region.entity";
import { Office } from "../modules/geo-location/entity/office.entity";

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
  entities: [
    User,
    Role,
    Permission,
    KnowledgeResource,
    KnowledgeMetadata,
    KnowledgeVersion,
    ComplianceCheck,
    ValidationRecord,
    AuditRecord,
    PublishingRecord,
    Region,
    Office,
  ],
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
