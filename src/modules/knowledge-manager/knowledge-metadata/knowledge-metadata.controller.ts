import { Router, Request, Response, NextFunction } from "express";

import {
  createKnowledgeMetadata,
  deleteKnowledgeMetadataById,
  getMetadataByResourceId,
  updateKnowledgeMetadataDetails,
} from "./knowledge-metadata.service";
import logger from "../../util/logger";

const router = Router();

router.post(
  "/resource/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const resourceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    logger.info(
      `POST /knowledge-metadata/resource/${resourceId} - Create metadata request received`
    );

    try {
      const result = await createKnowledgeMetadata(resourceId, req.body);

      res.status(201).json(result);
    } catch (error: any) {
      logger.error(
        `Error creating knowledge metadata for resource ${resourceId}: ${error.message}`
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
      `GET /knowledge-metadata/resource/${resourceId} - Fetch metadata request received`
    );

    try {
      const metadata = await getMetadataByResourceId(resourceId);

      res.status(201).json(metadata);
    } catch (error: any) {
      logger.error(
        `Error fetching knowledge metadata for resource ${resourceId}: ${error.message}`
      );
      next(error);
    }
  }
);

router.put(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const metadataId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    logger.info(`PUT /knowledge-metadata/${metadataId} - Update request received`);

    try {
      const metadata = await updateKnowledgeMetadataDetails(metadataId, req.body);

      res.status(201).json(metadata);
    } catch (error: any) {
      logger.error(
        `Error updating knowledge metadata ${metadataId}: ${error.message}`
      );
      next(error);
    }
  }
);

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const metadataId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    logger.info(
      `DELETE /knowledge-metadata/${metadataId} - Deletion request received`
    );

    try {
      const metadata = await deleteKnowledgeMetadataById(metadataId);

      res.status(201).json(metadata);
    } catch (error: any) {
      logger.error(
        `Error deleting knowledge metadata ${metadataId}: ${error.message}`
      );
      next(error);
    }
  }
);

export { router as knowledgeMetadataController };
