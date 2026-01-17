import { Router, Request, Response, NextFunction } from "express";
import { uploadKnowledge, KnowledgeUploadInput } from "./knowledge-manager.service";
import logger from "../../util/logger";

const router = Router();

router.post(
  "/upload",
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /knowledge/upload called");

    try {
      const result = await uploadKnowledge(req.body as KnowledgeUploadInput);
      res.status(201).json(result);
    } catch (error: any) {
      logger.error(`Knowledge upload error: ${error.message}`);
      next(error);
    }
  }
);

export { router as knowledgeManagerController };
