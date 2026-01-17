import { Router, Request, Response, NextFunction } from "express";
import logger from "../../util/logger";
import { getExperts, getExpertProfile, getLeaderboard } from "./experts.service";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  logger.info("GET /experts called");

  try {
    const data = await getExperts(`${req.query?.q || ""}`);
    res.status(200).json(data);
  } catch (error: any) {
    logger.error(`Get experts error: ${error.message}`);
    next(error);
  }
});

router.get(
  "/leaderboard",
  async (_req: Request, res: Response, next: NextFunction) => {
    logger.info("GET /experts/leaderboard called");

    try {
      const data = await getLeaderboard();
      res.status(200).json(data);
    } catch (error: any) {
      logger.error(`Get leaderboard error: ${error.message}`);
      next(error);
    }
  }
);

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const expertId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  logger.info(`GET /experts/${expertId} called`);

  try {
    const data = await getExpertProfile(expertId);
    res.status(200).json(data);
  } catch (error: any) {
    logger.error(`Get expert profile error: ${error.message}`);
    next(error);
  }
});

export { router as expertsController };
