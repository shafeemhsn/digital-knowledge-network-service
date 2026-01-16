import { Router, Request, Response, NextFunction } from "express";

import {
  createKnowledgeResource,
  deleteKnowledgeResourceById,
  getKnowledgeResourcesByUserId,
  updateKnowledgeResourceDetails,
} from "./knowledge-resource.service";
import logger from "../../util/logger";

const router = Router();

router.post(
  "/user/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    logger.info(
      `POST /knowledge-resources/user/${userId} - Create knowledge resource request received`
    );

    try {
      const result = await createKnowledgeResource(userId, req.body);

      res.status(201).json(result);
    } catch (error: any) {
      logger.error(
        `Error creating knowledge resource for user ${userId}: ${error.message}`
      );
      next(error);
    }
  }
);

router.get(
  "/user/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    logger.info(
      `GET /knowledge-resources/user/${userId} - Fetch knowledge resources request received`
    );

    try {
      const resources = await getKnowledgeResourcesByUserId(userId);

      res.status(201).json(resources);
    } catch (error: any) {
      logger.error(
        `Error fetching knowledge resources for user ${userId}: ${error.message}`
      );
      next(error);
    }
  }
);

router.put(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const resourceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    logger.info(
      `PUT /knowledge-resources/${resourceId} - Update request received`
    );

    try {
      const resource = await updateKnowledgeResourceDetails(resourceId, req.body);

      res.status(201).json(resource);
    } catch (error: any) {
      logger.error(
        `Error updating knowledge resource ${resourceId}: ${error.message}`
      );
      next(error);
    }
  }
);

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const resourceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    logger.info(
      `DELETE /knowledge-resources/${resourceId} - Deletion request received`
    );

    try {
      const resource = await deleteKnowledgeResourceById(resourceId);

      res.status(201).json(resource);
    } catch (error: any) {
      logger.error(
        `Error deleting knowledge resource ${resourceId}: ${error.message}`
      );
      next(error);
    }
  }
);

export { router as knowledgeResourceController };
