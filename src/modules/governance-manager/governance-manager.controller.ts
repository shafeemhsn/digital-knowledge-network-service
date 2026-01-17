import { Router, Request, Response, NextFunction } from "express";
import HttpException from "../../util/http-exception.model";
import logger from "../../util/logger";
import { getAuthPayload } from "../auth/auth.utils";
import {
  approveCompliance,
  getCompliancePending,
  rejectCompliance,
  requestComplianceChanges,
  getGovernancePending,
  publishKnowledge,
  rejectGovernance,
} from "./governance-manager.service";

const complianceRouter = Router();
const governanceRouter = Router();

const requireAuth = (req: Request) => {
  const payload = getAuthPayload(req);
  if (!payload?.userId) {
    throw new HttpException(401, { message: "Unauthorized", result: false });
  }
  return payload.userId;
};

complianceRouter.get(
  "/pending",
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("GET /compliance/pending called");

    try {
      const data = await getCompliancePending(
        req.query?.limit ? Number(req.query?.limit) : undefined
      );
      res.status(200).json(data);
    } catch (error: any) {
      logger.error(`Get compliance pending error: ${error.message}`);
      next(error);
    }
  }
);

complianceRouter.post(
  "/:id/approve",
  async (req: Request, res: Response, next: NextFunction) => {
    const knowledgeId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    logger.info(`POST /compliance/${knowledgeId}/approve called`);

    try {
      const userId = requireAuth(req);
      const result = await approveCompliance(knowledgeId, req.body, userId);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Approve compliance error: ${error.message}`);
      next(error);
    }
  }
);

complianceRouter.post(
  "/:id/reject",
  async (req: Request, res: Response, next: NextFunction) => {
    const knowledgeId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    logger.info(`POST /compliance/${knowledgeId}/reject called`);

    try {
      const userId = requireAuth(req);
      const result = await rejectCompliance(knowledgeId, req.body, userId);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Reject compliance error: ${error.message}`);
      next(error);
    }
  }
);

complianceRouter.post(
  "/:id/request-changes",
  async (req: Request, res: Response, next: NextFunction) => {
    const knowledgeId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    logger.info(`POST /compliance/${knowledgeId}/request-changes called`);

    try {
      const userId = requireAuth(req);
      const result = await requestComplianceChanges(knowledgeId, req.body, userId);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Request compliance changes error: ${error.message}`);
      next(error);
    }
  }
);

governanceRouter.get(
  "/pending",
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("GET /governance/pending called");

    try {
      const data = await getGovernancePending(
        req.query?.limit ? Number(req.query?.limit) : undefined
      );
      res.status(200).json(data);
    } catch (error: any) {
      logger.error(`Get governance pending error: ${error.message}`);
      next(error);
    }
  }
);

governanceRouter.post(
  "/:id/publish",
  async (req: Request, res: Response, next: NextFunction) => {
    const knowledgeId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    logger.info(`POST /governance/${knowledgeId}/publish called`);

    try {
      const userId = requireAuth(req);
      const result = await publishKnowledge(knowledgeId, req.body, userId);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Publish governance error: ${error.message}`);
      next(error);
    }
  }
);

governanceRouter.post(
  "/:id/reject",
  async (req: Request, res: Response, next: NextFunction) => {
    const knowledgeId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    logger.info(`POST /governance/${knowledgeId}/reject called`);

    try {
      const userId = requireAuth(req);
      const result = await rejectGovernance(knowledgeId, req.body, userId);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Reject governance error: ${error.message}`);
      next(error);
    }
  }
);

export { complianceRouter as complianceController, governanceRouter as governanceController };
