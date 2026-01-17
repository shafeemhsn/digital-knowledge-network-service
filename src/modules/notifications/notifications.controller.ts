import { Router, Request, Response, NextFunction } from "express";
import { getAuthPayload } from "../auth/auth.utils";
import HttpException from "../../util/http-exception.model";
import logger from "../../util/logger";
import {
  getNotificationsForUser,
  markNotificationAsRead,
} from "./notifications.service";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  logger.info("GET /notifications called");

  try {
    const payload = getAuthPayload(req);
    if (!payload?.userId) {
      throw new HttpException(401, { message: "Unauthorized", result: false });
    }

    const data = await getNotificationsForUser(payload.userId);
    res.status(200).json(data);
  } catch (error: any) {
    logger.error(`Get notifications error: ${error.message}`);
    next(error);
  }
});

router.post(
  "/:id/read",
  async (req: Request, res: Response, next: NextFunction) => {
    const notificationId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    logger.info(`POST /notifications/${notificationId}/read called`);

    try {
      const payload = getAuthPayload(req);
      if (!payload?.userId) {
        throw new HttpException(401, { message: "Unauthorized", result: false });
      }

      const result = await markNotificationAsRead(payload.userId, notificationId);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Mark notification read error: ${error.message}`);
      next(error);
    }
  }
);

export { router as notificationsController };
