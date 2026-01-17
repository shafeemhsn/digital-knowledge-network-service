import { AppDataSource } from "../../config/db";
import HttpException from "../../util/http-exception.model";
import logger from "../../util/logger";
import { KnowledgeResource } from "../knowledge-manager/enity/knowledge-resource.enity";
import { KnowledgeResourceStatus } from "../knowledge-manager/interface/knowledge-resource.status";
import { getUserById } from "../users/user.service";
import { ComplianceCheck } from "./entity/compliance-check.enity";
import { AuditRecord } from "./entity/audit-record.entity";
import { ValidationRecord } from "./entity/validation-record.enity";
import { PublishingRecord } from "./entity/publishing-record.entity";
import {
  PublishingScope,
  ValidationDecision,
} from "./interface/compliance.enums";

const getKnowledgeResourceOrThrow = async (knowledgeId: string) => {
  const knowledgeRepository = AppDataSource.getRepository(KnowledgeResource);
  const resource = await knowledgeRepository.findOne({
    where: { id: knowledgeId },
    relations: { uploadedBy: true },
  });
  if (!resource) {
    throw new HttpException(404, {
      message: "Knowledge not found",
      result: false,
    });
  }
  return resource;
};

export const approveComplianceInDb = async (
  knowledgeId: string,
  payload: any,
  userId: string
) => {
  try {
    const user = await getUserOrThrow(userId);
    const resource = await getKnowledgeResourceOrThrow(knowledgeId);

    const knowledgeRepository = AppDataSource.getRepository(KnowledgeResource);
    const complianceRepository = AppDataSource.getRepository(ComplianceCheck);
    const auditRepository = AppDataSource.getRepository(AuditRecord);

    resource.status = KnowledgeResourceStatus.PENDING_GOVERNANCE;
    await knowledgeRepository.save(resource);

    const complianceCheck = complianceRepository.create({
      knowledgeResourceId: resource,
      gdprCompliant: !!payload?.gdprCompliant,
      localisationCompliant: !!payload?.dataLocalizationOk,
      checkedBy: user,
      checkedAt: new Date(),
    });
    await complianceRepository.save(complianceCheck);

    if (payload?.notes) {
      const audit = auditRepository.create({
        knowledgeResourceId: resource,
        findings: payload.notes,
        auditedBy: user,
        auditedAt: new Date(),
      });
      await auditRepository.save(audit);
    }

    return resource;
  } catch (error: any) {
    logger.error(`Approve compliance repo error: ${error.message}`);
    throw error;
  }
};

export const rejectComplianceInDb = async (
  knowledgeId: string,
  payload: any,
  userId: string
) => {
  try {
    const user = await getUserOrThrow(userId);
    const resource = await getKnowledgeResourceOrThrow(knowledgeId);

    const knowledgeRepository = AppDataSource.getRepository(KnowledgeResource);
    const auditRepository = AppDataSource.getRepository(AuditRecord);

    resource.status = KnowledgeResourceStatus.REJECTED;
    await knowledgeRepository.save(resource);

    if (payload?.reason) {
      const audit = auditRepository.create({
        knowledgeResourceId: resource,
        findings: payload.reason,
        auditedBy: user,
        auditedAt: new Date(),
      });
      await auditRepository.save(audit);
    }

    return resource;
  } catch (error: any) {
    logger.error(`Reject compliance repo error: ${error.message}`);
    throw error;
  }
};

export const requestComplianceChangesInDb = async (
  knowledgeId: string,
  payload: any,
  userId: string
) => {
  try {
    const user = await getUserOrThrow(userId);
    const resource = await getKnowledgeResourceOrThrow(knowledgeId);

    const knowledgeRepository = AppDataSource.getRepository(KnowledgeResource);
    const auditRepository = AppDataSource.getRepository(AuditRecord);

    resource.status = KnowledgeResourceStatus.CHANGES_REQUESTED;
    await knowledgeRepository.save(resource);

    if (payload?.notes) {
      const audit = auditRepository.create({
        knowledgeResourceId: resource,
        findings: payload.notes,
        auditedBy: user,
        auditedAt: new Date(),
      });
      await auditRepository.save(audit);
    }

    return resource;
  } catch (error: any) {
    logger.error(`Request changes repo error: ${error.message}`);
    throw error;
  }
};

export const publishKnowledgeInDb = async (
  knowledgeId: string,
  payload: any,
  userId: string
) => {
  try {
    const user = await getUserOrThrow(userId);
    const resource = await getKnowledgeResourceOrThrow(knowledgeId);

    const knowledgeRepository = AppDataSource.getRepository(KnowledgeResource);
    const validationRepository = AppDataSource.getRepository(ValidationRecord);
    const publishingRepository = AppDataSource.getRepository(PublishingRecord);
    const auditRepository = AppDataSource.getRepository(AuditRecord);

    resource.status = KnowledgeResourceStatus.PUBLISHED;
    resource.publishedAt = new Date();
    await knowledgeRepository.save(resource);

    const validation = validationRepository.create({
      knowledgeResourceId: resource,
      decision: ValidationDecision.APPROVED,
      validatedBy: user,
      validatedAt: new Date(),
    });
    await validationRepository.save(validation);

    const publishing = publishingRepository.create({
      knowledgeResourceId: resource,
      scope: PublishingScope.GLOBAL,
      publishedBy: user,
      publishedAt: new Date(),
    });
    await publishingRepository.save(publishing);

    if (payload?.qualityScore !== undefined) {
      const audit = auditRepository.create({
        knowledgeResourceId: resource,
        findings: `Quality score: ${payload.qualityScore}`,
        auditedBy: user,
        auditedAt: new Date(),
      });
      await auditRepository.save(audit);
    }

    return resource;
  } catch (error: any) {
    logger.error(`Publish knowledge repo error: ${error.message}`);
    throw error;
  }
};

export const rejectGovernanceInDb = async (
  knowledgeId: string,
  payload: any,
  userId: string
) => {
  try {
    const user = await getUserOrThrow(userId);
    const resource = await getKnowledgeResourceOrThrow(knowledgeId);

    const knowledgeRepository = AppDataSource.getRepository(KnowledgeResource);
    const validationRepository = AppDataSource.getRepository(ValidationRecord);
    const auditRepository = AppDataSource.getRepository(AuditRecord);

    resource.status = KnowledgeResourceStatus.REJECTED;
    await knowledgeRepository.save(resource);

    const validation = validationRepository.create({
      knowledgeResourceId: resource,
      decision: ValidationDecision.REJECTED,
      validatedBy: user,
      validatedAt: new Date(),
    });
    await validationRepository.save(validation);

    if (payload?.reason) {
      const audit = auditRepository.create({
        knowledgeResourceId: resource,
        findings: payload.reason,
        auditedBy: user,
        auditedAt: new Date(),
      });
      await auditRepository.save(audit);
    }

    return resource;
  } catch (error: any) {
    logger.error(`Reject governance repo error: ${error.message}`);
    throw error;
  }
};

const getUserOrThrow = async (userId: string) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new HttpException(404, { message: "User not found", result: false });
  }
  return user;
};
