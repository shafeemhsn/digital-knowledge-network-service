import dotenv from "dotenv";
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
import { Notification } from "../modules/notifications/entity/notification.entity";

dotenv.config();

const DEFAULT_PORT = 5432;
const toNumber = (value: string | undefined, fallback: number) => {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const toBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === "true";
};

const sslEnabled = toBoolean(process.env.DB_SSL_ENABLED, true);
const sslAllowSelfSigned = toBoolean(
  process.env.DB_SSL_ALLOW_SELF_SIGNED,
  true
);

const commonEntities = [
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
  Notification,
  Region,
  Office,
];

const extra: Record<string, unknown> = {
  statement_timeout: toNumber(process.env.DB_STATEMENT_TIMEOUT, 0),
  query_timeout: toNumber(process.env.DB_QUERY_TIMEOUT, 0),
  connectionTimeoutMillis: toNumber(
    process.env.DB_CONNECTION_TIMEOUT_MILLIS,
    0
  ),
};

if (sslEnabled) {
  extra.ssl = {
    rejectUnauthorized: !sslAllowSelfSigned,
  };
}

const baseConfig = {
  type: "postgres" as const,
  entities: commonEntities,
  synchronize: true,
  logging: false,
  extra,
};

export const AppDataSource = process.env.DATABASE_URL
  ? new DataSource({
      ...baseConfig,
      url: process.env.DATABASE_URL,
    })
  : new DataSource({
      ...baseConfig,
      host: process.env.DB_HOST,
      port: toNumber(process.env.DB_PORT, DEFAULT_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

export const initializeDatabase = async () => {
  logger.info("Connecting PostgreSQL database...");

  try {
    await AppDataSource.initialize();
    logger.info("PostgreSQL successfully connected.");
  } catch (error) {
    logger.error("PostgreSQL Connection Error:", error);
    process.exit(1);
  }
};

export default initializeDatabase;
