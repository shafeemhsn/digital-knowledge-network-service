import { Router, Request, Response, NextFunction } from "express";

import {
  createKnowledgeVersion,
  deleteKnowledgeVersionById,
  getVersionsByResourceId,
  updateKnowledgeVersionDetails,
} from "./knowledge-version.service";
import logger from "../../util/logger";

const router = Router();

router.post(
  "/resource/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const resourceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    logger.info(
      `POST /knowledge-versions/resource/${resourceId} - Create version request received`
    );

    try {
      const result = await createKnowledgeVersion(resourceId, req.body);

      res.status(201).json(result);
    } catch (error: any) {
      logger.error(
        `Error creating knowledge version for resource ${resourceId}: ${error.message}`
      );
      next(error);
    }
  }
);

router.get(
  "/resource/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const resourceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    logger.info(
      `GET /knowledge-versions/resource/${resourceId} - Fetch versions request received`
    );

    try {
      const versions = await getVersionsByResourceId(resourceId);

      res.status(201).json(versions);
    } catch (error: any) {
      logger.error(
        `Error fetching knowledge versions for resource ${resourceId}: ${error.message}`
      );
      next(error);
    }
  }
);

router.put(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const versionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    logger.info(`PUT /knowledge-versions/${versionId} - Update request received`);

    try {
      const version = await updateKnowledgeVersionDetails(versionId, req.body);

      res.status(201).json(version);
    } catch (error: any) {
      logger.error(
        `Error updating knowledge version ${versionId}: ${error.message}`
      );
      next(error);
    }
  }
);

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const versionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    logger.info(
      `DELETE /knowledge-versions/${versionId} - Deletion request received`
    );

    try {
      const version = await deleteKnowledgeVersionById(versionId);

      res.status(201).json(version);
    } catch (error: any) {
      logger.error(
        `Error deleting knowledge version ${versionId}: ${error.message}`
      );
      next(error);
    }
  }
);

export { router as knowledgeVersionController };
