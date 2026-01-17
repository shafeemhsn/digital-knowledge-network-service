import HttpException from "../../util/http-exception.model";
import logger from "../../util/logger";
import { KnowledgeResourceStatus } from "../knowledge-manager/interface/knowledge-resource.status";
import { getKnowledgeList } from "../knowledge-manager/knowledge-manager.service";
import {
  approveComplianceInDb,
  publishKnowledgeInDb,
  rejectComplianceInDb,
  rejectGovernanceInDb,
  requestComplianceChangesInDb,
} from "./governance-manager.repository";
import { createNotification } from "../notifications/notifications.service";

export const getCompliancePending = async (limit?: number) => {
  return await getKnowledgeList({
    status: KnowledgeResourceStatus.PENDING_COMPLIANCE,
    ...(limit ? { limit } : {}),
  });
};

export const approveCompliance = async (
  knowledgeId: string,
  payload: any,
  userId: string
) => {
  try {
    const resource = await approveComplianceInDb(knowledgeId, payload, userId);

    if (resource.uploadedBy?.id) {
      await createNotification(
        resource.uploadedBy.id,
        `Compliance approved for "${resource.title}"`,
        "compliance"
      );
    }

    return { message: "Compliance approved", result: true };
  } catch (error: any) {
    logger.error(`Approve compliance error: ${error.message}`);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(500, { message: "Server error", result: false });
  }
};

export const rejectCompliance = async (
  knowledgeId: string,
  payload: any,
  userId: string
) => {
  try {
    const resource = await rejectComplianceInDb(knowledgeId, payload, userId);

    if (resource.uploadedBy?.id) {
      await createNotification(
        resource.uploadedBy.id,
        `Compliance rejected for "${resource.title}"`,
        "compliance"
      );
    }

    return { message: "Compliance rejected", result: true };
  } catch (error: any) {
    logger.error(`Reject compliance error: ${error.message}`);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(500, { message: "Server error", result: false });
  }
};

export const requestComplianceChanges = async (
  knowledgeId: string,
  payload: any,
  userId: string
) => {
  try {
    const resource = await requestComplianceChangesInDb(
      knowledgeId,
      payload,
      userId
    );

    if (resource.uploadedBy?.id) {
      await createNotification(
        resource.uploadedBy.id,
        `Changes requested for "${resource.title}"`,
        "compliance"
      );
    }

    return { message: "Changes requested", result: true };
  } catch (error: any) {
    logger.error(`Request changes error: ${error.message}`);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(500, { message: "Server error", result: false });
  }
};

export const getGovernancePending = async (limit?: number) => {
  return await getKnowledgeList({
    status: KnowledgeResourceStatus.PENDING_GOVERNANCE,
    ...(limit ? { limit } : {}),
  });
};

export const publishKnowledge = async (
  knowledgeId: string,
  payload: any,
  userId: string
) => {
  try {
    const resource = await publishKnowledgeInDb(knowledgeId, payload, userId);

    if (resource.uploadedBy?.id) {
      await createNotification(
        resource.uploadedBy.id,
        `Knowledge published: "${resource.title}"`,
        "governance"
      );
    }

    return { message: "Knowledge published", result: true };
  } catch (error: any) {
    logger.error(`Publish knowledge error: ${error.message}`);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(500, { message: "Server error", result: false });
  }
};

export const rejectGovernance = async (
  knowledgeId: string,
  payload: any,
  userId: string
) => {
  try {
    const resource = await rejectGovernanceInDb(knowledgeId, payload, userId);

    if (resource.uploadedBy?.id) {
      await createNotification(
        resource.uploadedBy.id,
        `Governance rejected: "${resource.title}"`,
        "governance"
      );
    }

    return { message: "Governance rejected", result: true };
  } catch (error: any) {
    logger.error(`Reject governance error: ${error.message}`);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(500, { message: "Server error", result: false });
  }
};
