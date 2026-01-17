import { Router, Request, Response, NextFunction } from "express";
import {
  uploadKnowledge,
  getKnowledgeList,
  getKnowledgeById,
  updateKnowledgeById,
  deleteKnowledgeById,
  searchKnowledge,
  rateKnowledge,
  saveFavorite,
  getRecommendations,
  getTrendingKnowledge,
} from "./knowledge-manager.service";
import { getAuthPayload } from "../auth/auth.utils";
import logger from "../../util/logger";
import { KnowledgeUploadInput } from "./interface/knowledge-metadata.interface";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  logger.info("GET /knowledge called");

  try {
    const payload = getAuthPayload(req);
    const data = await getKnowledgeList(req.query, payload?.userId);
    res.status(200).json(data);
  } catch (error: any) {
    logger.error(`Get knowledge error: ${error.message}`);
    next(error);
  }
});

router.get(
  "/search",
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("GET /knowledge/search called");

    try {
      const query = `${req.query?.q || ""}`;
      const data = await searchKnowledge(query, req.query);
      res.status(200).json(data);
    } catch (error: any) {
      logger.error(`Search knowledge error: ${error.message}`);
      next(error);
    }
  }
);

router.get(
  "/recommendations",
  async (_req: Request, res: Response, next: NextFunction) => {
    logger.info("GET /knowledge/recommendations called");

    try {
      const data = await getRecommendations();
      res.status(200).json(data);
    } catch (error: any) {
      logger.error(`Get recommendations error: ${error.message}`);
      next(error);
    }
  }
);

router.get(
  "/trending",
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("GET /knowledge/trending called");

    try {
      const data = await getTrendingKnowledge(`${req.query?.period || ""}`);
      res.status(200).json(data);
    } catch (error: any) {
      logger.error(`Get trending error: ${error.message}`);
      next(error);
    }
  }
);

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const knowledgeId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  logger.info(`GET /knowledge/${knowledgeId} called`);

  try {
    const data = await getKnowledgeById(knowledgeId);
    res.status(200).json(data);
  } catch (error: any) {
    logger.error(`Get knowledge by id error: ${error.message}`);
    next(error);
  }
});

router.post(
  "/:id/rate",
  async (req: Request, res: Response, next: NextFunction) => {
    const knowledgeId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    logger.info(`POST /knowledge/${knowledgeId}/rate called`);

    try {
      const result = await rateKnowledge(knowledgeId, Number(req.body?.rating));
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Rate knowledge error: ${error.message}`);
      next(error);
    }
  }
);

router.post(
  "/:id/favorite",
  async (_req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /knowledge/:id/favorite called");

    try {
      const result = await saveFavorite();
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Save favorite error: ${error.message}`);
      next(error);
    }
  }
);

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  logger.info("POST /knowledge called");

  try {
    const result = await uploadKnowledge(req.body as KnowledgeUploadInput);
    res.status(201).json(result);
  } catch (error: any) {
    logger.error(`Knowledge upload error: ${error.message}`);
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const knowledgeId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  logger.info(`PUT /knowledge/${knowledgeId} called`);

  try {
    const result = await updateKnowledgeById(knowledgeId, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    logger.error(`Update knowledge error: ${error.message}`);
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const knowledgeId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    logger.info(`DELETE /knowledge/${knowledgeId} called`);

    try {
      const result = await deleteKnowledgeById(knowledgeId);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Delete knowledge error: ${error.message}`);
      next(error);
    }
  }
);

export { router as knowledgeManagerController };
